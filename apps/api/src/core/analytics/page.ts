import {
  entryPagesStatsBasicQuery,
  entryPagesStatsDetailedQuery,
  entryPagesTotalsQuery,
  exitPagesStatsBasicQuery,
  exitPagesStatsDetailedQuery,
  exitPagesTotalsQuery,
  topPagesStatsBasicQuery,
  topPagesStatsDetailedQuery,
  topPagesTotalsQuery,
} from "../../db/clickhouse/pages.js";
import { AppContext } from "../context.js";
import { calculatePercentage } from "./helpers.js";
import {
  EntryPagesStatsInput,
  ExitPagesStatsInput,
  TopPagesStatsInput,
} from "./types.js";

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

export const getEntryPagesStats = async (
  { clickhouse }: AppContext,
  input: EntryPagesStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await entryPagesStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await entryPagesStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totalSessions = await entryPagesTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      page: r.page,
      visitors: r.visitors,
      percentage: calculatePercentage(r.visitors, totalSessions),
      ...(input.detailed && {
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
        visit_duration: Math.round(r.visit_duration ?? 0),
        entrances: Math.round(r.entrances ?? 0),
      }),
    })),
  };
};

export const getExitPagesStats = async (
  { clickhouse }: AppContext,
  input: ExitPagesStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await exitPagesStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await exitPagesStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totalExits = await exitPagesTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      page: r.page,
      visitors: r.visitors,
      percentage: calculatePercentage(r.visitors, totalExits),
      ...(input.detailed && {
        exits: Math.round(r.exits ?? 0),
      }),
    })),
  };
};
