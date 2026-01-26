CREATE MATERIALIZED VIEW webyz_analytics.hourly_aggregates_mv
TO webyz_analytics.hourly_aggregates
AS
SELECT
  website_id,
  toStartOfHour(timestamp) AS hour,
  hostname,
  browser,
  os,
  device,
  country,
  city,
  sumIf(1, event_type = 'pageview') AS views
FROM webyz_analytics.events
GROUP BY
  website_id,
  hour,
  hostname,
  browser,
  os,
  device,
  country,
  city;
