import { ClickHouseClient } from "@clickhouse/client";

const metricSql = (metric: string) => {
  switch (metric) {
    case "visitors":
      return "uniqCombined64Merge(visitors)";
    case "visits":
      return "sum(visits)";
    case "pageviews":
      return "sum(pageviews)";
    case "views_per_visit":
      return "sum(pageviews) / sum(visits)";
    case "bounce_rate":
      return "(sum(bounces) / sum(visits)) * 100";
    case "visit_duration":
      return "sum(total_duration) / sum(visits)";
    default:
      return "sum(visits)";
  }
};

export const mainGraphAggQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  metric: string,
  interval: string,
  source: string,
) => {
  let bucket = "";

  if (interval === "hour") bucket = "hour";
  if (interval === "day") bucket = "day";
  if (interval === "week") bucket = "toStartOfWeek(day)";
  if (interval === "month") bucket = "toStartOfMonth(day)";

  const table =
    source === "hourly"
      ? "webyz_analytics.hourly_aggregates"
      : "webyz_analytics.daily_aggregates";

  const metricSelect = metricSql(metric);

  const result = await clickhouse.query({
    query: `
      SELECT
      ${bucket} as t,
      ${metricSelect} as value
    FROM ${table}
    WHERE website_id = {websiteId:String}
      AND ${bucket} >= toDateTime({from:Int64})
      AND ${bucket} <= toDateTime({to:Int64})
    GROUP BY t
    ORDER BY t ASC
    `,
    query_params: { websiteId, from, to },
  });

  const json = await result.json<{ t: string; value: string }>();
  return json.data;
};

const metricSqlRealtime = (metric: string) => {
  switch (metric) {
    case "visitors":
      return "uniq(user_id)";
    case "visits":
      return "count()";
    case "pageviews":
      return "sum(page_views)";
    case "views_per_visit":
      return "sum(page_views)/count()";
    case "bounce_rate":
      return "(sumIf(1,page_views=1)/count())*100";
    case "visit_duration":
      return "avg(duration_seconds)";
    default:
      return "count()";
  }
};

export const mainGraphRealtimeQuery = async (
  clickhouse: ClickHouseClient,
  websiteId: string,
  from: number,
  to: number,
  metric: string,
) => {
  const metricSelect = metricSqlRealtime(metric);

  const result = await clickhouse.query({
    query: `
      SELECT
        toStartOfMinute(start_time) as t,
        ${metricSelect} as value
      FROM webyz_analytics.sessions
      WHERE website_id = {websiteId:String}
        AND start_time>=toDateTime({from:Int64})
        AND start_time<=toDateTime({to:Int64})
      GROUP BY t
      ORDER BY t ASC
    `,
    query_params: { websiteId, from, to },
  });

  const json = await result.json<{ t: string; value: string }>();
  return json.data;
};
