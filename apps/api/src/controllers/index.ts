import { FastifyReply, FastifyRequest } from "fastify";
import { TrackingPayload } from "../types/tracking.js";
import { handleServerError } from "../helpers/errors.helper.js";

export const track = async (request: FastifyRequest<{Body: TrackingPayload}>, reply: FastifyReply) => {
  try {
    // reply.status(STANDARD)
  } catch (err){ 
    handleServerError(reply, err)
  }
}

