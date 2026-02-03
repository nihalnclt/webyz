import { FastifyInstance } from "fastify";

import {
  getBrowsersStatsController,
  getBrowserVersionsStatsController,
  getOsStatsController,
} from "../../controllers/analytics.controller.js";

export default async function trackerRoutes(fastify: FastifyInstance) {
  fastify.get("/:siteId/browsers", getBrowsersStatsController);
  fastify.get("/:siteId/browser-versions", getBrowserVersionsStatsController);
  fastify.get("/:siteId/os", getOsStatsController);
}
