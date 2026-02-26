import { clickhouse } from "../../lib/clickhouse.js";
import prisma from "../../lib/prisma.js";
import { stripe } from "../../lib/stripe.js";

export async function syncUsageFromClickhouse(): Promise<void> {
  console.log("[sync-usage] Starting");

  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
      currentPeriodStart: { not: null },
      currentPeriodEnd: { not: null },
    },
    select: {
      id: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      user: {
        select: {
          websites: { select: { id: true } },
        },
      },
    },
  });

  console.log(
    `[sync-usage] Processing ${subscriptions.length} active subscriptions`,
  );

  let synced = 0;
  let failed = 0;

  for (const sub of subscriptions) {
    try {
      await syncOne(sub);
      synced++;
    } catch (err) {
      failed++;
      console.error(`[sync-usage] Failed for subscription ${sub.id}:`, err);
    }
  }

  console.log(`[sync-usage] Done — ${synced} synced, ${failed} failed`);
}

async function syncOne(sub: {
  id: string;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  user: { websites: { id: string }[] };
}): Promise<void> {
  const {
    id: subscriptionId,
    currentPeriodStart,
    currentPeriodEnd,
    user,
  } = sub;

  // These are already filtered above but TypeScript needs the check
  if (!currentPeriodStart || !currentPeriodEnd) return;

  const websiteIds = user.websites.map((w) => w.id);
  if (websiteIds.length === 0) {
    // No websites yet — upsert a zero-count record so the dashboard shows 0
    await upsertBillingPeriodUsage(
      subscriptionId,
      currentPeriodStart,
      currentPeriodEnd,
      BigInt(0),
    );
    return;
  }

  // Query ClickHouse for total events across all of this user's websites
  // in the current billing period.
  //
  // Adjust `events` table name and column names to match your ClickHouse schema.
  const result = await clickhouse.query({
    query: `
      SELECT count() AS total
      FROM events
      WHERE
        website_id IN ({websiteIds: Array(String)})
        AND timestamp >= {periodStart: DateTime64(3)}
        AND timestamp <  {periodEnd:   DateTime64(3)}
    `,
    query_params: {
      websiteIds,
      periodStart: currentPeriodStart.toISOString(),
      periodEnd: currentPeriodEnd.toISOString(),
    },
    format: "JSONEachRow",
  });

  const rows = await result.json<{ total: string }>();
  const totalEvents = BigInt(rows[0]?.total ?? "0");

  await upsertBillingPeriodUsage(
    subscriptionId,
    currentPeriodStart,
    currentPeriodEnd,
    totalEvents,
  );

  console.log(
    `[sync-usage] Sub ${subscriptionId}: ${totalEvents} events ` +
      `(${currentPeriodStart.toISOString().slice(0, 10)} → ${currentPeriodEnd.toISOString().slice(0, 10)})`,
  );
}

async function upsertBillingPeriodUsage(
  subscriptionId: string,
  periodStart: Date,
  periodEnd: Date,
  totalEvents: bigint,
): Promise<void> {
  await prisma.billingPeriodUsage.upsert({
    where: {
      subscriptionId_periodStart: { subscriptionId, periodStart },
    },
    update: {
      totalEvents,
      periodEnd, // keep in sync if Stripe ever shifts the period
    },
    create: {
      subscriptionId,
      periodStart,
      periodEnd,
      totalEvents,
    },
  });
}

export async function reportUsageToStripe(): Promise<void> {
  console.log("[report-stripe] Starting");

  // Find all billing periods that:
  // 1. Have NOT been reported yet (overageReportedAt is null)
  // 2. Belong to a PAYG plan (extraPricePer100k is non-null)
  // 3. Have an active subscription with a metered Stripe item
  // 4. Period has ended (don't report mid-period)
  const now = new Date();

  const unreported = await prisma.billingPeriodUsage.findMany({
    where: {
      overageReportedAt: null,
      periodEnd: { lte: now }, // only closed periods
      subscription: {
        status: { in: ["ACTIVE", "PAST_DUE"] },
        stripeMeteredItemId: { not: null },
        plan: {
          isFree: false,
          extraPricePer100k: { not: null },
          stripeMeteredPriceId: { not: null },
        },
      },
    },
    include: {
      subscription: {
        include: { plan: true },
      },
    },
  });

  console.log(`[report-stripe] ${unreported.length} periods to process`);

  let reported = 0;
  let skipped = 0;
  let failed = 0;

  for (const period of unreported) {
    try {
      const wasReported = await reportPeriod(period);
      wasReported ? reported++ : skipped++;
    } catch (err) {
      failed++;
      console.error(
        `[report-stripe] Failed for BillingPeriodUsage ${period.id}:`,
        err,
      );
    }
  }

  console.log(
    `[report-stripe] Done — ${reported} reported, ${skipped} within limit, ${failed} failed`,
  );
}

async function reportPeriod(period: any): Promise<boolean> {
  const {
    id: billingPeriodUsageId,
    subscriptionId,
    totalEvents,
    periodEnd,
    subscription,
  } = period;
  const { plan, stripeMeteredItemId } = subscription;

  const eventLimit = BigInt(plan.eventLimit);
  const overageEvents =
    totalEvents > eventLimit ? totalEvents - eventLimit : BigInt(0);

  if (overageEvents === BigInt(0)) {
    // Within plan limit — still mark as "reported" so we don't re-check it daily
    await prisma.billingPeriodUsage.update({
      where: { id: billingPeriodUsageId },
      data: { overageReportedAt: new Date() },
    });
    console.log(
      `[report-stripe] Period ${billingPeriodUsageId}: within limit, no charge`,
    );
    return false;
  }

  // Convert raw event overage to Stripe units.
  // If your metered price is "per 100k events", divide and round up.
  // Adjust the denominator to match your Stripe price config.
  const UNITS_PER_BLOCK = BigInt(100_000);
  const stripeQuantity = Number(
    (overageEvents + UNITS_PER_BLOCK - BigInt(1)) / UNITS_PER_BLOCK,
  ); // ceiling

  // Report to Stripe
  const stripeRecord = await stripe.billing.meterEvents.create({
    event_name: "events_used",
    payload: {
      stripe_customer_id: subscription.stripeCustomerId,
      value: stripeQuantity.toString(),
    },
    timestamp: Math.floor(periodEnd.getTime() / 1000),
  });

  // Write the UsageRecord and mark the period as reported in a transaction
  await prisma.$transaction([
    prisma.usageRecord.create({
      data: {
        subscriptionId,
        billingPeriodUsageId,
        overageEvents,
        stripeQuantity,
        stripeUsageRecordId: stripeRecord.identifier,
        reportedToStripe: true,
        reportedAt: new Date(),
      },
    }),
    prisma.billingPeriodUsage.update({
      where: { id: billingPeriodUsageId },
      data: { overageReportedAt: new Date() },
    }),
  ]);

  console.log(
    `[report-stripe] Period ${billingPeriodUsageId}: ` +
      `reported ${overageEvents} overage events as ${stripeQuantity} units ` +
      `(Stripe record: ${stripeRecord.identifier})`,
  );

  return true;
}

const WARN_THRESHOLDS = [0.8, 0.9, 1.0] as const;

export async function enforceUsageLimits(): Promise<void> {
  console.log("[enforce-limits] Starting");

  const now = new Date();

  // Load all active billing periods with their subscription + plan + user websites
  const periods = await prisma.billingPeriodUsage.findMany({
    where: {
      periodStart: { lte: now },
      periodEnd: { gte: now }, // only current (open) periods
      subscription: {
        status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
      },
    },
    include: {
      subscription: {
        include: {
          plan: true,
          user: {
            include: {
              websites: {
                select: { id: true, isBlocked: true },
              },
            },
          },
        },
      },
    },
  });

  console.log(
    `[enforce-limits] Checking ${periods.length} active billing periods`,
  );

  let blocked = 0;
  let unblocked = 0;
  let warned = 0;
  let failed = 0;

  for (const period of periods) {
    try {
      const result = await checkPeriod(period);
      if (result.blocked) blocked += result.blocked;
      if (result.unblocked) unblocked += result.unblocked;
      if (result.warned) warned++;
    } catch (err) {
      failed++;
      console.error(`[enforce-limits] Failed for period ${period.id}:`, err);
    }
  }

  console.log(
    `[enforce-limits] Done — ${blocked} websites blocked, ${unblocked} unblocked, ${warned} warnings sent, ${failed} failed`,
  );
}

async function checkPeriod(period: any): Promise<{
  blocked?: number;
  unblocked?: number;
  warned?: boolean;
}> {
  const { subscription, totalEvents } = period;
  const { plan, user } = subscription;
  const websites = user.websites;

  const usageRatio = Number(totalEvents) / plan.eventLimit;

  // ── PAYG plans — never block, just send warnings ────────────────────────
  if (plan.extraPricePer100k !== null) {
    const warned = await sendWarningsIfNeeded(period, subscription, usageRatio);
    return { warned };
  }

  // ── Free / hard-limit plans ─────────────────────────────────────────────
  const isOverQuota = usageRatio >= 1.0;

  if (isOverQuota) {
    const blockedCount = await blockWebsites(
      websites,
      user,
      subscription,
      period,
    );
    return { blocked: blockedCount };
  } else {
    // Under quota: unblock any previously blocked websites (e.g. after upgrade)
    const unblockedCount = await unblockWebsites(websites);

    // Still send pre-quota warnings (80%, 90%)
    const warned = await sendWarningsIfNeeded(period, subscription, usageRatio);

    return { unblocked: unblockedCount, warned };
  }
}

async function blockWebsites(
  websites: { id: string; isBlocked: boolean }[],
  user: any,
  subscription: any,
  period: any,
): Promise<number> {
  const toBlock = websites.filter((w) => !w.isBlocked);

  if (toBlock.length === 0) return 0; // Already blocked — don't re-send email

  const now = new Date();

  await prisma.website.updateMany({
    where: { id: { in: toBlock.map((w) => w.id) } },
    data: { isBlocked: true, blockedAt: now },
  });

  // TODO: SEND EMAIL
  // Send the over-quota email once (when first crossing 100%)
  // await sendOverQuotaEmail({
  //   to: user.email,
  //   name: user.name,
  //   planName: subscription.plan.name,
  //   totalEvents: Number(period.totalEvents),
  //   eventLimit: subscription.plan.eventLimit,
  //   upgradeUrl: `${process.env.APP_URL}/settings/billing`,
  // });

  console.log(
    `[enforce-limits] Blocked ${toBlock.length} websites for sub ${subscription.id} ` +
      `(${period.totalEvents}/${subscription.plan.eventLimit} events)`,
  );

  return toBlock.length;
}

async function unblockWebsites(
  websites: { id: string; isBlocked: boolean }[],
): Promise<number> {
  const toUnblock = websites.filter((w) => w.isBlocked);

  if (toUnblock.length === 0) return 0;

  await prisma.website.updateMany({
    where: { id: { in: toUnblock.map((w) => w.id) } },
    data: { isBlocked: false, blockedAt: null },
  });

  console.log(
    `[enforce-limits] Unblocked ${toUnblock.length} websites (usage back under quota)`,
  );

  return toUnblock.length;
}

async function sendWarningsIfNeeded(
  period: any,
  subscription: any,
  usageRatio: number,
): Promise<boolean> {
  const { lastWarnedThreshold } = period;

  // Find the highest threshold we've crossed but haven't emailed about yet
  const nextThreshold = WARN_THRESHOLDS.find(
    (t) => usageRatio >= t && (lastWarnedThreshold ?? 0) < t,
  );

  if (!nextThreshold) return false;

  // Update the threshold first to prevent duplicate sends if email fails
  await prisma.billingPeriodUsage.update({
    where: { id: period.id },
    data: { lastWarnedThreshold: nextThreshold },
  });

  const user = subscription.user;
  const isPayg = subscription.plan.extraPricePer100k !== null;

  // TODO: SENT EMAIL
  // await sendLimitWarningEmail({
  //   to: user.email,
  //   name: user.name,
  //   planName: subscription.plan.name,
  //   totalEvents: Number(period.totalEvents),
  //   eventLimit: subscription.plan.eventLimit,
  //   thresholdPercent: nextThreshold * 100,
  //   isPayg, // PAYG email: "your bill will increase". Free: "upgrade or be blocked"
  //   upgradeUrl: `${process.env.APP_URL}/settings/billing`,
  // });

  console.log(
    `[enforce-limits] Warning email sent to ${user.email} at ${nextThreshold * 100}% usage`,
  );

  return true;
}
