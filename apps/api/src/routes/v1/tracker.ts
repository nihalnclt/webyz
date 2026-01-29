import { FastifyInstance } from "fastify";

import {
  handleTrackerPost,
  handleTrackingGet,
} from "../../controllers/tracker.controllers.js";

export default async function trackerRoutes(fastify: FastifyInstance) {
  fastify.post("/track", handleTrackerPost);
  fastify.get("/track", handleTrackingGet);
}
