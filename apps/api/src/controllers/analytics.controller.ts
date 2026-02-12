import { FastifyReply, FastifyRequest } from "fastify";

import {
  getBrowsersStats,
  getBrowserVersionsStats,
} from "../core/analytics/browsers.js";
import { getOsStats, getOsVersionsStats } from "../core/analytics/os.js";
import { normalizePagination } from "../http/normalize/pagination.js";
import { resolvePeriod } from "../http/normalize/period.js";
import { sendResponse } from "../http/helper/send-response.js";
import { getDeviceTypeStats } from "../core/analytics/device.js";
import {
  getEntryPagesStats,
  getExitPagesStats,
  getTopPagesStats,
} from "../core/analytics/page.js";
import {
  getChannelsStats,
  getSourcesStats,
  getUtmCampaignStats,
  getUtmContentStats,
  getUtmMediumStats,
  getUtmSourceStats,
  getUtmTermStats,
} from "../core/analytics/utm.js";
import { getTopStats } from "../core/analytics/top-stats.js";

export const getBrowsersStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getBrowsersStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getBrowserVersionsStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    browser: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getBrowserVersionsStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    browser: query.browser,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getOsStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getOsStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getOsVersionsStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    os: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getOsVersionsStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    os: query.os,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getDeviceTypeStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getDeviceTypeStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getTopPagesStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getTopPagesStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getEntryPagesStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getEntryPagesStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getExitPagesStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getExitPagesStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getChannelsStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getChannelsStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getSourcesStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getSourcesStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getUtmMediumStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getUtmMediumStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getUtmSourceStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getUtmSourceStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getUtmCampaignStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getUtmCampaignStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getUtmContentStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getUtmContentStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getUtmTermStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
    limit?: number;
    page?: number;
    detailed?: string;
  };

  const { limit, page } = normalizePagination(query as any);
  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const data = await getUtmTermStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    limit,
    page,
    detailed: query.detailed === "true",
  });

  return sendResponse(reply, data);
};

export const getTopStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { siteId } = request.params as { siteId: string };
  const query = request.query as {
    period: string;
    date: string;
    from?: string;
    to?: string;
  };

  const range = resolvePeriod({
    period: query.period,
    date: query.date,
    from: query.from,
    to: query.to,
  });

  const diff = range.to - range.from;
  const compareRange = {
    from: range.from - diff,
    to: range.to - diff,
  };

  const stats = await getTopStats(request.ctx, {
    websiteId: siteId,
    from: range.from,
    to: range.to,
    compareFrom: compareRange.from,
    compareTo: compareRange.to,
  });

  return sendResponse(reply, {
    from: range.from,
    to: range.to,
    comparing_from: compareRange.from,
    comparing_to: compareRange.to,
    top_stats: stats,
  });
};
