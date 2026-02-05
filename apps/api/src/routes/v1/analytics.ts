import { FastifyInstance } from "fastify";

import {
  getBrowsersStatsController,
  getBrowserVersionsStatsController,
  getDeviceTypeStatsController,
  getOsStatsController,
  getOsVersionsStatsController,
  getTopPagesStatsController,
  getEntryPagesStatsController,
  getExitPagesStatsController,
} from "../../controllers/analytics.controller.js";

export default async function trackerRoutes(fastify: FastifyInstance) {
  fastify.get("/:siteId/browsers", getBrowsersStatsController);
  fastify.get("/:siteId/browser-versions", getBrowserVersionsStatsController);
  fastify.get("/:siteId/os", getOsStatsController);
  fastify.get("/:siteId/os-versions", getOsVersionsStatsController);
  fastify.get("/:siteId/device-types", getDeviceTypeStatsController);
  fastify.get("/:siteId/pages", getTopPagesStatsController);
  fastify.get("/:siteId/entry-pages", getEntryPagesStatsController);
  fastify.get("/:siteId/exit-pages", getExitPagesStatsController);
}
