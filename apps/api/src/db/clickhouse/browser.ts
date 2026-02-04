import { ClickHouseClient } from "@clickhouse/client";
import { BrowserStatsRow, BrowserVersionStatsRow } from "./types.js";
import { Pagination } from "../../core/types/pagination.js";

export const browserStatsBasicQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  pagination: Pagination,
) => {
  const query = `
    SELECT
      browser_family AS name,
      count() AS visitors
    FROM sessions FINAL
    WHERE website_id = {websiteId:String}
      AND start_time <= fromUnixTimestamp({to:UInt32})
      AND end_time >=fromUnixTimestamp({from:UInt32}) 
    GROUP BY browser_family
    ORDER BY visitors DESC
    LIMIT {limit:UInt32} OFFSET {offset:UInt32}
  `;

  const result = await clickhouse.query({
    query,
    query_params: {
      websiteId,
      from,
      to,
      limit: pagination.limit,
      offset: pagination.offset,
    },
    format: "JSONEachRow",
  });

  return result.json<BrowserStatsRow>();
};

export const browserStatsDetailedQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  pagination: Pagination,
) => {
  const query = `
    SELECT
      browser_family AS name,
      count() AS visitors,
      avg(duration_seconds) AS visit_duration,
      sum(page_views = 1) / count() * 100 AS bounce_rate
    FROM sessions FINAL
    WHERE website_id = {websiteId:String}
      AND start_time <= fromUnixTimestamp({to:UInt32})
      AND end_time >=fromUnixTimestamp({from:UInt32}) 
    GROUP BY browser_family
    ORDER BY visitors DESC
    LIMIT {limit:UInt32} OFFSET {offset:UInt32}
  `;

  const result = await clickhouse.query({
    query,
    query_params: {
      websiteId,
      from,
      to,
      limit: pagination.limit,
      offset: pagination.offset,
    },
    format: "JSONEachRow",
  });

  return result.json<BrowserStatsRow>();
};

export const browsersTotalsQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
) => {
  const result = await clickhouse.query({
    query: `
      SELECT count() AS total
      FROM sessions FINAL
      WHERE website_id = {websiteId:String}
        AND start_time <= fromUnixTimestamp({to:UInt32})
        AND end_time >=fromUnixTimestamp({from:UInt32}) 
    `,
    query_params: {
      websiteId,
      from,
      to,
    },
  });

  const { data } = await result.json<{ total: string }>();
  return data.length > 0 ? parseInt(data[0].total, 10) : 0;
};

export const browserVersionStatsBasicQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  browser: string,
  pagination: Pagination,
) => {
  const query = `
    SELECT
      browser_version AS version,
      browser_family AS browser,
      count() AS visitors
    FROM sessions FINAL
    WHERE website_id = {websiteId:String}
      AND start_time <= fromUnixTimestamp({to:UInt32})
      AND end_time >=fromUnixTimestamp({from:UInt32}) 
      AND browser_family = {browser:String}
    GROUP BY browser_family, browser_version
    ORDER BY visitors DESC
    LIMIT {limit:UInt32} OFFSET {offset:UInt32}
  `;

  const result = await clickhouse.query({
    query,
    query_params: {
      websiteId,
      from,
      to,
      browser,
      limit: pagination.limit,
      offset: pagination.offset,
    },
    format: "JSONEachRow",
  });

  return result.json<BrowserVersionStatsRow>();
};

export const browserVersionStatsDetailedQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  browser: string,
  pagination: Pagination,
) => {
  const query = `
    SELECT
      browser_version AS version,
      browser_family AS browser,
      count() AS visitors,
      avg(duration_seconds) AS visit_duration,
      sum(page_views = 1) / count() * 100 AS bounce_rate
    FROM sessions FINAL
    WHERE website_id = {websiteId:String}
      AND start_time <= fromUnixTimestamp({to:UInt32})
      AND end_time >=fromUnixTimestamp({from:UInt32}) 
      AND browser_family = {browser:String}
    GROUP BY browser_family, browser_version
    ORDER BY visitors DESC
    LIMIT {limit:UInt32} OFFSET {offset:UInt32}
  `;

  const result = await clickhouse.query({
    query,
    query_params: {
      websiteId,
      from,
      to,
      browser,
      limit: pagination.limit,
      offset: pagination.offset,
    },
    format: "JSONEachRow",
  });

  return result.json<BrowserVersionStatsRow>();
};

export const browserVersionsTotalsQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  browser: string,
) => {
  const result = await clickhouse.query({
    query: `
      SELECT count() AS total
      FROM sessions FINAL
      WHERE website_id = {websiteId:String}
        AND start_time <= fromUnixTimestamp({to:UInt32})
        AND end_time >=fromUnixTimestamp({from:UInt32}) 
        AND browser_family = {browser:String}
    `,
    query_params: {
      websiteId,
      from,
      to,
      browser,
    },
  });

  const { data } = await result.json<{ total: string }>();
  return data.length > 0 ? parseInt(data[0].total, 10) : 0;
};
