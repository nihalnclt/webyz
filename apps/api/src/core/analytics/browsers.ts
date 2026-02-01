import { FastifyRequest } from "fastify";

import { browserStatsQuery, browsersTotalsQuery } from "../../db/clickhouse.js";

export const getBrowsersStats = async ({
  request,
  websiteId,
  from,
  to,
  limit,
  page,
  detailed,
}: {
  request: FastifyRequest;
  websiteId: string;
  from: number;
  to: number;
  limit: number;
  page: number;
  detailed: boolean;
}) => {
  const offset = (page - 1) * limit;

  const [rows, totalVisitors] = await Promise.all([
    browserStatsQuery(
      request.server.clickhouse,
      websiteId,
      from,
      to,
      limit,
      offset,
      detailed,
    ),
    browsersTotalsQuery(request.server.clickhouse, websiteId, from, to),
  ]);

  return {
    results: rows.map((r) => ({
      name: r.name,
      visitors: r.visitors,
      percentage:
        totalVisitors === 0
          ? 0
          : Number(((r.visitors / totalVisitors) * 100).toFixed(2)),
      ...(detailed && {
        visit_duration: Math.round(r.visit_duration ?? 0),
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
      }),
    })),
  };
};
