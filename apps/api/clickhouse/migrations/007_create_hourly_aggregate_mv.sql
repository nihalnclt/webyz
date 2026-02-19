CREATE MATERIALIZED VIEW webyz_analytics.hourly_aggregates_mv
TO webyz_analytics.hourly_aggregates
AS
SELECT
  website_id,
  
  toStartOfHour(start_time) AS hour,

  count() as visits,
  sum(page_views) as pageviews,
  sumIf(1, page_views = 1) as bounces,
  sum(duration_seconds) as total_duration,

  uniqState(user_id) as visitors
FROM webyz_analytics.sessions
GROUP BY website_id, hour;
