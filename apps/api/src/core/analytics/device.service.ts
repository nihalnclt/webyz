import {
  deviceTypeStatsBasicQuery,
  deviceTypeStatsDetailedQuery,
  deviceTypeTotalsQuery,
} from "../../db/clickhouse/device.js";
import { AppContext } from "../context.js";
import { calculatePercentage } from "./analytics.helpers.js";
import { DeviceTypeStatsInput } from "./analytics.types.js";

export const getDeviceTypeStats = async (
  { clickhouse }: AppContext,
  input: DeviceTypeStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await deviceTypeStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await deviceTypeStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totalVisitors = await deviceTypeTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      name: r.name,
      visitors: r.visitors,
      percentage: calculatePercentage(r.visitors, totalVisitors),
      ...(input.detailed && {
        visit_duration: Math.round(r.visit_duration ?? 0),
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
      }),
    })),
  };
};
