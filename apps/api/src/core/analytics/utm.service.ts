import {
  channelsStatsBasicQuery,
  channelsStatsDetailedQuery,
  channelsTotalsQuery,
  sourcesStatsBasicQuery,
  sourcesStatsDetailedQuery,
  sourceTotalsQuery,
  utmCampaignStatsBasicQuery,
  utmCampaignStatsDetailedQuery,
  utmCampaignTotalsQuery,
  utmContentStatsBasicQuery,
  utmContentStatsDetailedQuery,
  utmContentTotalsQuery,
  utmMediumStatsBasicQuery,
  utmMediumStatsDetailedQuery,
  utmMediumTotalsQuery,
  utmSourceStatsBasicQuery,
  utmSourceStatsDetailedQuery,
  utmSourceTotalsQuery,
  utmTermStatsBasicQuery,
  utmTermStatsDetailedQuery,
  utmTermTotalsQuery,
} from "../../db/clickhouse/utm.js";
import { AppContext } from "../context.js";
import { calculatePercentage } from "./analytics.helpers.js";
import { UTMStatsInput } from "./analytics.types.js";

export const getChannelsStats = async (
  { clickhouse }: AppContext,
  input: UTMStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await channelsStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await channelsStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totals = await channelsTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      channel: r.name,
      visitors: r.visitors,
      percentage: calculatePercentage(r.visitors, totals),
      ...(input.detailed && {
        visit_duration: Math.round(r.visit_duration ?? 0),
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
      }),
    })),
  };
};

export const getSourcesStats = async (
  { clickhouse }: AppContext,
  input: UTMStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await sourcesStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await sourcesStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totals = await sourceTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      channel: r.name,
      visitors: r.visitors,
      percentage: calculatePercentage(r.visitors, totals),
      ...(input.detailed && {
        visit_duration: Math.round(r.visit_duration ?? 0),
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
      }),
    })),
  };
};

export const getUtmMediumStats = async (
  { clickhouse }: AppContext,
  input: UTMStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await utmMediumStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await utmMediumStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totals = await utmMediumTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      channel: r.name,
      visitors: r.visitors,
      percentage: calculatePercentage(r.visitors, totals),
      ...(input.detailed && {
        visit_duration: Math.round(r.visit_duration ?? 0),
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
      }),
    })),
  };
};

export const getUtmSourceStats = async (
  { clickhouse }: AppContext,
  input: UTMStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await utmSourceStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await utmSourceStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totals = await utmSourceTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      channel: r.name,
      visitors: r.visitors,
      percentage: calculatePercentage(r.visitors, totals),
      ...(input.detailed && {
        visit_duration: Math.round(r.visit_duration ?? 0),
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
      }),
    })),
  };
};

export const getUtmCampaignStats = async (
  { clickhouse }: AppContext,
  input: UTMStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await utmCampaignStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await utmCampaignStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totals = await utmCampaignTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      channel: r.name,
      visitors: r.visitors,
      percentage: calculatePercentage(r.visitors, totals),
      ...(input.detailed && {
        visit_duration: Math.round(r.visit_duration ?? 0),
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
      }),
    })),
  };
};

export const getUtmContentStats = async (
  { clickhouse }: AppContext,
  input: UTMStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await utmContentStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await utmContentStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totals = await utmContentTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      channel: r.name,
      visitors: r.visitors,
      percentage: calculatePercentage(r.visitors, totals),
      ...(input.detailed && {
        visit_duration: Math.round(r.visit_duration ?? 0),
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
      }),
    })),
  };
};

export const getUtmTermStats = async (
  { clickhouse }: AppContext,
  input: UTMStatsInput,
) => {
  const offset = (input.page - 1) * input.limit;
  const pagination = { limit: input.limit, offset };

  const rows = input.detailed
    ? await utmTermStatsDetailedQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      )
    : await utmTermStatsBasicQuery(
        clickhouse,
        input.websiteId,
        input.from,
        input.to,
        pagination,
      );

  const totals = await utmTermTotalsQuery(
    clickhouse,
    input.websiteId,
    input.from,
    input.to,
  );

  return {
    results: rows.map((r) => ({
      channel: r.name,
      visitors: r.visitors,
      percentage: calculatePercentage(r.visitors, totals),
      ...(input.detailed && {
        visit_duration: Math.round(r.visit_duration ?? 0),
        bounce_rate: Number((r.bounce_rate ?? 0).toFixed(2)),
      }),
    })),
  };
};
