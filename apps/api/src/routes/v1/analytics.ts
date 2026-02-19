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
  getChannelsStatsController,
  getSourcesStatsController,
  getUtmMediumStatsController,
  getUtmSourceStatsController,
  getUtmCampaignStatsController,
  getUtmContentStatsController,
  getUtmTermStatsController,
  getTopStatsController,
  getMainGraphController,
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

  fastify.get("/:siteId/channel", getChannelsStatsController);
  fastify.get("/:siteId/source", getSourcesStatsController);
  fastify.get("/:siteId/utm-medium", getUtmMediumStatsController);
  fastify.get("/:siteId/utm-source", getUtmSourceStatsController);
  fastify.get("/:siteId/term-campaign", getUtmCampaignStatsController);
  fastify.get("/:siteId/term-content", getUtmContentStatsController);
  fastify.get("/:siteId/term-term", getUtmTermStatsController);

  fastify.get("/:siteId/top-stats", getTopStatsController);
  fastify.get("/:siteId/main-graph", getMainGraphController);
}
