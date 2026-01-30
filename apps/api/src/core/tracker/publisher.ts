import { FastifyRequest } from "fastify";

import { TrackingPayload } from "../../types/tracking.js";
import { track } from "./track.js";
import { KAFKA_ENABLED, KAFKA_TRACK_TOPIC } from "../../config/env.js";

export const publishTracking = async (
  payload: TrackingPayload,
  request: FastifyRequest,
) => {
  if (!KAFKA_ENABLED || !request.server.kafkaProducer) {
    return track(payload, request);
  }

  try {
    await request.server.kafkaProducer.send({
      topic: KAFKA_TRACK_TOPIC,
      messages: [
        {
          key: payload.sid, // partition by website
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
  } catch (error) {
    request.log.error(error, "Kafka publish failed");
    await track(payload, request);
  }
};
