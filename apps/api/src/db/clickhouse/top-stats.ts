import { ClickHouseClient } from "@clickhouse/client";
import { TopStatsRow } from "./types.js";

export const topStatsQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  compareFrom: number,
  compareTo: number,
): Promise<TopStatsRow | null> => {
  const result = await clickhouse.query({
    query: `
      WITH
      current AS (
        SELECT
          uniq(user_id) AS visitors,
          count() AS visits,
          sum(page_views) AS pageviews,
          avg(duration_seconds) AS visit_duration,
          sumIf(1, page_views = 1) AS bounces
        FROM webyz_analytics.sessions
        WHERE website_id = {websiteId:String}
        AND start_time >= {from:DateTime}
        AND start_time <= {to:DateTime}
      ),

      comparison AS (
        SELECT
          uniq(user_id) AS visitors,
          count() AS visits,
          sum(page_views) AS pageviews,
          avg(duration_seconds) AS visit_duration,
          sumIf(1, page_views = 1) AS bounces
        FROM webyz_analytics.sessions
        WHERE website_id = {websiteId:String}
        AND start_time >= {compareFrom:DateTime}
        AND start_time <= {compareTo:DateTime}
      )

      SELECT
        current.visitors,
        comparison.visitors AS prev_visitors,

        current.visits,
        comparison.visits AS prev_visits,

        current.pageviews,
        comparison.pageviews AS prev_pageviews,

        current.visit_duration,
        comparison.visit_duration AS prev_visit_duration,

        current.bounces,
        comparison.bounces AS prev_bounces
      FROM current
      CROSS JOIN comparison
    `,
    query_params: {
      websiteId,
      from,
      to,
      compareFrom,
      compareTo,
    },
  });

  const { data } = await result.json<TopStatsRow>();
  return data.length ? data[0] : null;
};
