import { FastifyInstance } from "fastify";

import { getBrowsersStatsController } from "../../controllers/analytics.controller.js";

export default async function trackerRoutes(fastify: FastifyInstance) {
  fastify.get("/:siteId/browsers", getBrowsersStatsController);
}
