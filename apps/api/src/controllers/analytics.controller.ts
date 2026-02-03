import { FastifyReply, FastifyRequest } from "fastify";

import {
  getBrowsersStats,
  getBrowserVersionsStats,
} from "../core/analytics/browsers.js";
import { getOsStats } from "../core/analytics/os.js";
import { normalizePagination } from "../http/normalize/pagination.js";
import { resolvePeriod } from "../http/normalize/period.js";
import { sendResponse } from "../http/helper/send-response.js";

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
    browser: string;
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
