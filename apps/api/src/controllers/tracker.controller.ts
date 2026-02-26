import { FastifyReply, FastifyRequest } from "fastify";

import { TrackingPayload } from "../ingest/types.js";
import { publishTracking } from "../ingest/http/publish-tracking.js";
import { checkIngestAllowed } from "../core/tracker/tracking.service.js";

export const handleTrackerPost = async (
  request: FastifyRequest<{ Body: TrackingPayload }>,
  reply: FastifyReply,
) => {
  const usage = await checkIngestAllowed(request.ctx, request?.body?.sid);

  if (!usage.allowed) {
    return reply.status(402).send({
      code: "PAYMENT_REQUIRED",
      // message:
      //   usage.reason === "PAYMENT_REQUIRED"
      //     ? "Payment required to continue tracking"
      //     : "Free plan limit reached",
    });
  }

  await publishTracking(request.body, request);
  reply.code(204).send();
};

export const handleTrackingGet = async (
  request: FastifyRequest<{ Querystring: TrackingPayload }>,
  reply: FastifyReply,
) => {
  const usage = await checkIngestAllowed(request.ctx, request?.query?.sid);

  if (!usage.allowed) {
    // still return pixel but don't record event
    const gif = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      "base64",
    );

    return reply.code(200).type("image/gif").send(gif);
  }

  await publishTracking(request.query, request);

  // Return 1x1 transparent GIF
  const gif = Buffer.from(
    "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
    "base64",
  );

  reply
    .code(200)
    .header("Content-Type", "image/gif")
    .header("Cache-Control", "no-cache, no-store, must-revalidate")
    .header("Pragma", "no-cache")
    .header("Expires", "0")
    .send(gif);
};
