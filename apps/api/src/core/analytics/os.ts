import {
  osStatsBasicQuery,
  osStatsDetailedQuery,
  osTotalsQuery,
} from "../../db/clickhouse/os.js";
import { AppContext } from "../context.js";
import { OsStatsInput } from "./types.js";

export const getOsStats = async (
  { clickhouse }: AppContext,
  input: OsStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await osStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await osStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totalVisitors = await osTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      name: r.name,
      visitors: r.visitors,
      percentage:
        totalVisitors === 0
          ? 0
          : Number(((r.visitors / totalVisitors) * 100).toFixed(2)),
      ...(input.detailed && {
        visit_duration: Math.round(r.visit_duration ?? 0),
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
      }),
    })),
  };
};
