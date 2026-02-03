import { ClickHouseClient } from "@clickhouse/client";

import { AppContext } from "../context.js";
import { BrowserStatsInput } from "./types.js";
import { calculatePercentage } from "./helpers.js";
import {
  browserStatsBasicQuery,
  browserStatsDetailedQuery,
  browsersTotalsQuery,
  browserVersionStatsBasicQuery,
  browserVersionStatsDetailedQuery,
  browserVersionsTotalsQuery,
} from "../../db/clickhouse/browser.js";

export const getBrowsersStats = async (
  { clickhouse }: AppContext,
  input: BrowserStatsInput,
) => {
  try {
    const offset = (input.page - 1) * input.limit;
    const pagination = { limit: input.limit, offset };

    const rows = input.detailed
      ? await browserStatsDetailedQuery(
          clickhouse,
          input.websiteId,
          input.from,
          input.to,
          pagination,
        )
      : await browserStatsBasicQuery(
          clickhouse,
          input.websiteId,
          input.from,
          input.to,
          pagination,
        );

    const totalVisitors = await browsersTotalsQuery(
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
  } catch (error) {
    console.error("Error in getBrowsersStats:", error);
    throw error;
  }
};

export const getBrowserVersionsStats = async (
  { clickhouse }: AppContext,
  input: {
    websiteId: string;
    from: number;
    to: number;
    browser: string;
    limit: number;
    page: number;
    detailed: boolean;
  },
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await browserVersionStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        input.browser,
        pagination,
      )
    : await browserVersionStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        input.browser,
        pagination,
      );

  const totalVisitors = await browserVersionsTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
    input.browser,
  );

  return {
    results: rows.map((r) => ({
      name: r.browser + " " + r.version,
      version: r.version,
      browser: r.browser,
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
