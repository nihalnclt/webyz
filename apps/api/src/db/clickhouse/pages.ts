import { ClickHouseClient } from "@clickhouse/client";
import { Pagination } from "../../core/types/pagination.js";
import { PagesStatsRows } from "./types.js";

export const topPagesStatsBasicQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  pagination: Pagination,
) => {
  const query = `
    SELECT
      url_path AS page,
      countDistinct(session_id) AS visitors
      count() AS pageviews
    FROM events
    WHERE website_id = {websiteId:String}
      AND event_type = 'pageview'
      AND timestamp BETEWEEN fromUnixTimestamp({to:UInt32})
                        AND fromUnixTimestamp({from:UInt32}) 
    GROUP BY url_path
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

  return result.json<PagesStatsRows>();
};

export const topPagesStatsDetailedQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  pagination: Pagination,
) => {
  const query = `
    WITH page_sessions AS (
      SELECT
        session_id,
        url_path,
      FROM events
      WHERE website_id = {websiteId:String}
        AND event_type = 'pageview'
        AND timestamp BETWEEN fromUnixTimestamp({from:UInt32})
                          AND fromUnixTimestamp({to:UInt32})
    )
    SELECT
      ps.url_path AS page,
      countDistinct(ps.session_id) AS visitors,
      count() AS pageviews,
      avg(s.duration_seconds) AS time_on_page,
      sum(s.page_views = 1 AND s.entry_page = ps.url_path)
        / countDistinct(ps.session_id) * 100 AS bounce_rate
    FROM page_sessions ps
    INNER JOIN sessions s
      on s.session_id = ps.session_id
      AND s.website_id = {websiteId:String}
    WHERE s.start_time <= fromUnixTimestamp({to:UInt32})
      AND s.end_time >= fromUnixTimestamp({from:UInt32})
    GROUP BY ps.url_path
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

  return result.json<PagesStatsRows>();
};

export const topPagesTotalsQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
) => {
  const result = await clickhouse.query({
    query: `
      SELECT countDistinct(url_path) AS total
      FROM events
      WHERE website_id = {websiteId:String}
        AND event_type = 'pageview'
        AND timestamp BETWEEN fromUnixTimestamp({from:UInt32})
                          AND fromUnixTimestamp({to:UInt32})
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
