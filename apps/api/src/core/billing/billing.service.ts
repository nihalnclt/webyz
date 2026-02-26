import Stripe from "stripe";
import { stripe } from "../../lib/stripe.js";
import { AppContext } from "../context.js";
import {
  Prisma,
  PrismaClient,
  SubscriptionStatus,
} from "../../generated/prisma/client.js";

export const createCheckoutSession = async (
  { prisma }: AppContext,
  userId: string,
  planId: string,
  billingCycle: "MONTHLY" | "YEARLY" = "MONTHLY",
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error("Plan not found");
  if (!plan.isActive) throw new Error("Plan is no longer available");
  if (plan.isFree) throw new Error("Free plan does not need checkout");

  // Pick the right base price based on billing cycle
  const basePriceId =
    billingCycle === "YEARLY"
      ? plan.stripePriceYearlyId
      : plan.stripePriceMonthlyId;

  if (!basePriceId) {
    throw new Error(
      `Stripe ${billingCycle.toLowerCase()} price not configured for this plan`,
    );
  }

  // Metered price is required for PAYG overage billing
  if (!plan.stripeMeteredPriceId) {
    throw new Error("Stripe metered price not configured for this plan");
  }

  // Check if user already has an active subscription — prevent double checkout
  const existingSub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ["ACTIVE", "TRIALING"] },
    },
  });
  if (existingSub) throw new Error("User already has an active subscription");

  // Create or reuse Stripe customer
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    payment_method_types: ["card"],

    line_items: [
      // Fixed recurring charge (monthly or yearly)
      { price: basePriceId, quantity: 1 },
      // Metered overage charge (no quantity — Stripe pulls from usage records)
      { price: plan.stripeMeteredPriceId },
    ],

    subscription_data: {
      metadata: {
        userId: user.id,
        planId: plan.id,
        billingCycle,
      },
    },

    metadata: {
      userId: user.id,
      planId: plan.id,
      billingCycle,
    },

    success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing`,
  });

  if (!session.url) throw new Error("Failed to create Stripe checkout session");

  return session.url;
};

// ─── Billing Portal ───────────────────────────────────────────────────────────

export const createBillingPortal = async (
  { prisma }: AppContext,
  userId: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.stripeCustomerId) throw new Error("No billing account found");

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.FRONTEND_URL}/settings/billing`,
  });

  return session.url;
};

// ─── Cancel / Resume ──────────────────────────────────────────────────────────

export const cancelSubscription = async (
  { prisma }: AppContext,
  userId: string,
) => {
  const sub = await getActiveSubscription(prisma, userId);

  if (!sub.stripeSubscriptionId)
    throw new Error("No Stripe subscription linked");

  await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await prisma.subscription.update({
    where: { id: sub.id },
    data: { cancelAtPeriodEnd: true },
  });

  return { success: true };
};

export const resumeSubscription = async (
  { prisma }: AppContext,
  userId: string,
) => {
  const sub = await getActiveSubscription(prisma, userId);

  if (!sub.stripeSubscriptionId)
    throw new Error("No Stripe subscription linked");

  await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    cancel_at_period_end: false,
  });

  await prisma.subscription.update({
    where: { id: sub.id },
    data: { cancelAtPeriodEnd: false },
  });

  return { success: true };
};

// ─── Query helpers ────────────────────────────────────────────────────────────

export const getMySubscription = async (
  { prisma }: AppContext,
  userId: string,
) => {
  return prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
    },
    orderBy: { createdAt: "desc" },
    include: {
      plan: true,
      // Include current billing period usage for the dashboard
      billingPeriodUsages: {
        orderBy: { periodStart: "desc" },
        take: 1,
      },
    },
  });
};

// ─── Webhook Handler ──────────────────────────────────────────────────────────

export const handleStripeWebhook = async (
  { prisma }: AppContext,
  event: Stripe.Event,
) => {
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await onCheckoutCompleted(
          prisma,
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case "customer.subscription.updated":
        await onSubscriptionUpdated(
          prisma,
          event.data.object as Stripe.Subscription,
        );
        break;

      case "customer.subscription.deleted":
        await onSubscriptionDeleted(
          prisma,
          event.data.object as Stripe.Subscription,
        );
        break;

      case "invoice.payment_failed":
        await onPaymentFailed(prisma, event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_succeeded":
        await onPaymentSucceeded(prisma, event.data.object as Stripe.Invoice);
        break;

      default:
        // Unhandled event — ignore silently
        break;
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${event.type}:`, err);
    // Re-throw so your webhook route returns 500, prompting Stripe to retry
    throw err;
  }
};

// ─── Webhook event handlers ───────────────────────────────────────────────────

async function onCheckoutCompleted(
  prisma: PrismaClient,
  session: Stripe.Checkout.Session,
) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;
  const billingCycle = (session.metadata?.billingCycle ?? "MONTHLY") as
    | "MONTHLY"
    | "YEARLY";
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !planId || !stripeSubscriptionId) {
    console.warn(
      "[webhook] checkout.session.completed: missing metadata",
      session.metadata,
    );
    return;
  }

  // Retrieve the full subscription to get item IDs and period dates
  const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const recurringItem = stripeSub.items.data.find(
    (item) => item.price.recurring?.usage_type !== "metered",
  );
  const meteredItem = stripeSub.items.data.find(
    (item) => item.price.recurring?.usage_type === "metered",
  );

  const periodStart = new Date(
    (recurringItem?.current_period_start ?? 0) * 1000,
  );
  const periodEnd = new Date((recurringItem?.current_period_end ?? 0) * 1000);

  // Deactivate any existing subscription (shouldn't exist, but be safe)
  await prisma.subscription.updateMany({
    where: { userId, status: { in: ["ACTIVE", "TRIALING"] } },
    data: { status: "CANCELED", canceledAt: new Date() },
  });

  // Create the new subscription record
  await prisma.subscription.create({
    data: {
      userId,
      planId,
      status: "ACTIVE",
      billingCycle,
      stripeSubscriptionId,
      stripeRecurringItemId: recurringItem?.id ?? null,
      stripeMeteredItemId: meteredItem?.id ?? null,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
    },
  });

  // Unblock all websites in case they were blocked on a free plan
  await prisma.website.updateMany({
    where: { userId },
    data: { isBlocked: false, blockedAt: null },
  });

  console.log(`[webhook] Subscription activated for user ${userId}`);
}

async function onSubscriptionUpdated(
  prisma: PrismaClient,
  stripeSub: Stripe.Subscription,
) {
  const customerId = stripeSub.customer as string;

  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: stripeSub.id },
  });

  if (!subscription) {
    console.warn(
      `[webhook] subscription.updated: no local sub found for ${stripeSub.id}`,
    );
    return;
  }

  const recurringItem = stripeSub.items.data.find(
    (item) => item.price.recurring?.usage_type !== "metered",
  );
  const meteredItem = stripeSub.items.data.find(
    (item) => item.price.recurring?.usage_type === "metered",
  );

  const periodStart = new Date(
    (recurringItem?.current_period_start ?? 0) * 1000,
  );
  const periodEnd = new Date((recurringItem?.current_period_end ?? 0) * 1000);

  // Map Stripe status to our enum
  const status = mapStripeStatus(stripeSub.status);

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status,
      stripeRecurringItemId: recurringItem?.id ?? null,
      stripeMeteredItemId: meteredItem?.id ?? null,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
      // New period started — reset BillingPeriodUsage will happen automatically
      // via the next sync-usage job run
    },
  });

  // If subscription renewed into a new period, unblock websites
  if (status === "ACTIVE") {
    await prisma.website.updateMany({
      where: { userId: subscription.userId },
      data: { isBlocked: false, blockedAt: null },
    });
  }

  console.log(`[webhook] Subscription updated: ${stripeSub.id} → ${status}`);
}

async function onSubscriptionDeleted(
  prisma: PrismaClient,
  stripeSub: Stripe.Subscription,
) {
  const subscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: stripeSub.id },
  });

  if (!subscription) {
    console.warn(
      `[webhook] subscription.deleted: no local sub found for ${stripeSub.id}`,
    );
    return;
  }

  const freePlan = await prisma.plan.findFirst({ where: { isFree: true } });
  if (!freePlan) throw new Error("No free plan configured");

  // Mark old subscription as canceled
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
    },
  });

  // Create a new free plan subscription
  await prisma.subscription.create({
    data: {
      userId: subscription.userId,
      planId: freePlan.id,
      status: "ACTIVE",
      billingCycle: "MONTHLY",
    },
  });

  console.log(
    `[webhook] Subscription canceled → downgraded to free for user ${subscription.userId}`,
  );
}

async function onPaymentFailed(prisma: PrismaClient, invoice: Stripe.Invoice) {
  const stripeSubId = getSubscriptionIdFromInvoice(invoice);
  if (!stripeSubId) return;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: stripeSubId },
    data: { status: "PAST_DUE" },
  });

  console.log(`[webhook] Payment failed for subscription ${stripeSubId}`);
}

async function onPaymentSucceeded(
  prisma: PrismaClient,
  invoice: Stripe.Invoice,
) {
  const stripeSubId = getSubscriptionIdFromInvoice(invoice);
  if (!stripeSubId) return;

  // Only flip back to ACTIVE if it was PAST_DUE — don't overwrite TRIALING etc.
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: stripeSubId,
      status: "PAST_DUE",
    },
    data: { status: "ACTIVE" },
  });

  console.log(`[webhook] Payment recovered for subscription ${stripeSubId}`);
}

function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  if (
    invoice.parent?.type === "subscription_details" &&
    invoice.parent.subscription_details?.subscription
  ) {
    return invoice.parent.subscription_details.subscription as string;
  }
  return null;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function getActiveSubscription(prisma: PrismaClient, userId: string) {
  const sub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ["ACTIVE", "TRIALING"] },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!sub) throw new Error("No active subscription found");
  return sub;
}

function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status,
): SubscriptionStatus {
  const map: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
    active: "ACTIVE",
    canceled: "CANCELED",
    incomplete: "INCOMPLETE",
    incomplete_expired: "CANCELED",
    past_due: "PAST_DUE",
    paused: "CANCELED",
    trialing: "TRIALING",
    unpaid: "UNPAID",
  };

  return map[stripeStatus] ?? "ACTIVE";
}
