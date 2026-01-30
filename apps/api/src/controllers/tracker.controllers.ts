import { FastifyReply, FastifyRequest } from "fastify";

import { TrackingPayload } from "../types/tracking.js";
import { publishTracking } from "../core/tracker/publisher.js";

export const handleTrackerPost = async (
  request: FastifyRequest<{ Body: TrackingPayload }>,
  reply: FastifyReply,
) => {
  console.log("request.body", request.body);
  await publishTracking(request.body, request);
  reply.code(204).send();
};

export const handleTrackingGet = async (
  request: FastifyRequest<{ Querystring: TrackingPayload }>,
  reply: FastifyReply,
) => {
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
