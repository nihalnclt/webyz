import { FastifyInstance } from "fastify";

import {
  handleTrackerPost,
  handleTrackingGet,
} from "../../controllers/tracker.controller.js";

export default async function trackerRoutes(fastify: FastifyInstance) {
  fastify.post("/track", handleTrackerPost);
  fastify.get("/track", handleTrackingGet);
}
