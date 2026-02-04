import {
  topPagesStatsBasicQuery,
  topPagesStatsDetailedQuery,
  topPagesTotalsQuery,
} from "../../db/clickhouse/pages.js";
import { AppContext } from "../context.js";
import { calculatePercentage } from "./helpers.js";
import { TopPagesStatsInput } from "./types.js";

export const getTopPagesStats = async (
  { clickhouse }: AppContext,
  input: TopPagesStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await topPagesStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await topPagesStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totalVisitors = await topPagesTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      page: r.page,
      visitors: r.visitors,
      percentage: calculatePercentage(r.visitors, totalVisitors),
      ...(input.detailed && {
        time_on_page: Math.round(r.time_on_page ?? 0),
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
      }),
    })),
  };
};
