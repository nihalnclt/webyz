import { ClickHouseClient } from "@clickhouse/client";

import { Pagination } from "../../core/types/pagination.js";
import { DeviceTypeStatsRow } from "./types.js";

export const deviceTypeStatsBasicQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  pagination: Pagination,
) => {
  const query = `
    SELECT
      device_type AS name,
      count() AS visitors
    FROM sessions FINAL
    WHERE website_id = {websiteId:String}
      AND start_time <= fromUnixTimestamp({to:UInt32})
      AND end_time >=fromUnixTimestamp({from:UInt32}) 
    GROUP BY device_type
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

  return result.json<DeviceTypeStatsRow>();
};

export const deviceTypeStatsDetailedQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  pagination: Pagination,
) => {
  const query = `
    SELECT
      device_type AS name,
      count() AS visitors,
      avg(duration_seconds) AS visit_duration,
      sum(page_views = 1) / count() * 100 AS bounce_rate
    FROM sessions FINAL
    WHERE website_id = {websiteId:String}
      AND start_time <= fromUnixTimestamp({to:UInt32})
      AND end_time >=fromUnixTimestamp({from:UInt32}) 
    GROUP BY device_type
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

  return result.json<DeviceTypeStatsRow>();
};

export const deviceTypeTotalsQuery = async (
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
