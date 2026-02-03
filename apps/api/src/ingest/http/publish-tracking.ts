import { FastifyRequest } from "fastify";

import { TrackingPayload } from "../types.js";
import { KAFKA_ENABLED, KAFKA_TRACK_TOPIC } from "../../config/env.js";
import { track } from "../../core/tracker/track.js";
import { normalizeTracking } from "../normalize/normalize-tracking.js";

export const publishTracking = async (
  payload: TrackingPayload,
  request: FastifyRequest,
) => {
  // Kafka path
  if (KAFKA_ENABLED && request.server.kafkaProducer) {
    try {
      await request.server.kafkaProducer.send({
        topic: KAFKA_TRACK_TOPIC,
        messages: [
          {
            key: payload.sid,
            value: JSON.stringify({
              payload,
              headers: {
                "user-agent": request.headers["user-agent"],
                "x-forwarded-for": request.headers["x-forwarded-for"],
                "x-real-ip": request.headers["x-real-ip"],
                host: request.headers["host"],
              },
            }),
          },
        ],
      });
      return;
    } catch (err) {
      request.log.error(err, "Kafka publish failed, falling back");
    }
  }

  const normalized = await normalizeTracking(payload, request);
  if (!normalized) return;

  await track({ clickhouse: request.server.clickhouse }, normalized);
};
