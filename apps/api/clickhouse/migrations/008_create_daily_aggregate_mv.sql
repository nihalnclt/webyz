CREATE MATERIALIZED VIEW webyz_analytics.daily_aggregates_mv
TO webyz_analytics.daily_aggregates
AS
SELECT
  website_id,
  toDate(hour) as day,

  sumMerge(visits) as visits,
  sumMerge(pageviews) as pageviews,
  sumMerge(bounces) as bounces,
  sumMerge(total_duration) as total_duration,

  uniqMergeState(visitors) as visitors
FROM webyz_analytics.hourly_aggregates
GROUP BY website_id, day;
