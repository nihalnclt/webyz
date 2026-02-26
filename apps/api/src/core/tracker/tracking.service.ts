import { updateSession } from "./session.service.js";
import { EventInput, SessionUAInfo } from "./tracker.types.js";
import { ClickHouseClient } from "@clickhouse/client";
import { mapEventInputToEventData } from "./event.service.js";
import { insertEvent } from "../../db/clickhouse/event.js";
import { AppContext } from "../context.js";

export const track = async (
  deps: { clickhouse: ClickHouseClient },
  input: {
    input: EventInput;
    uaInfo: SessionUAInfo;
    isPageView: boolean;
    newSession: boolean;
  },
) => {
  const event = mapEventInputToEventData(input.input);

  // Store the event
  await insertEvent(deps.clickhouse, event);

  // Update session if it's pageview
  if (input.isPageView) {
    await updateSession(deps.clickhouse, event, input.newSession, input.uaInfo);
  }
};

export type IngestResult =
  | { allowed: true }
  | {
      allowed: false;
      status: 404 | 429;
      code: "website_not_found" | "quota_exceeded";
      message: string;
    };

export async function checkIngestAllowed(
  { prisma }: AppContext,
  websiteId: string,
): Promise<IngestResult> {
  let website: {
    isBlocked: boolean;
    user: {
      subscriptions: {
        plan: {
          extraPricePer100k: number | null;
        };
      }[];
    };
  } | null;

  try {
    website = await prisma.website.findUnique({
      where: { id: websiteId },
      select: {
        isBlocked: true,
        user: {
          select: {
            subscriptions: {
              where: { status: { in: ["ACTIVE", "TRIALING"] } },
              orderBy: { createdAt: "desc" },
              take: 1,
              select: {
                plan: {
                  select: {
                    extraPricePer100k: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  } catch (err) {
    // Fail open: Postgres unavailable. Log and allow to avoid data loss.
    console.error("[ingest-guard] Postgres unavailable, failing open:", err);
    return { allowed: true };
  }

  if (!website) {
    return {
      allowed: false,
      status: 404,
      code: "website_not_found",
      message: "Website not found. Check your tracking ID.",
    };
  }

  // PAYG plans are never blocked — overage is just billed
  const subscription = website.user.subscriptions[0];

  if (!subscription) {
    if (website.isBlocked) {
      return {
        allowed: false,
        status: 429,
        code: "quota_exceeded",
        message:
          "Monthly event quota reached. Upgrade your plan to continue tracking.",
      };
    }
    return { allowed: true };
  }

  // PAYG plans (extraPricePer100k is explicitly a number) — never block
  // Must check typeof/!== null carefully: undefined means no sub, null means free plan
  if (subscription.plan.extraPricePer100k !== null) {
    return { allowed: true };
  }

  // Free / hard-limit plan — respect the block flag set by enforce-limits job
  if (website.isBlocked) {
    return {
      allowed: false,
      status: 429,
      code: "quota_exceeded",
      message:
        "Monthly event quota reached. Upgrade your plan to continue tracking.",
    };
  }

  return { allowed: true };
}
