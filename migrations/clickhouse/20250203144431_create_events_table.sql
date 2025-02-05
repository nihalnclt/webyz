-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

CREATE TABLE webyz_analytics.events (
  `event_id` UUID,
  `website_id` UUID,
  `session_id` UUID,
  `user_id` UUID,
  `event_type` LowCardinality(String),
  `event_name` LowCardinality(String),
  `timestamp` DateTime('UTC') CODEC(Delta(4), LZ4),
  `url_path` String CODEC(ZSTD(3)),
  `url_query` String CODEC(ZSTD(3)),
  `referrer_path` String CODEC(ZSTD(3)),
  `referrer_query` String CODEC(ZSTD(3)),
  `referrer_domain` String CODEC(ZSTD(3)),
  `page_title` String CODEC(ZSTD(3)),
  `hostname` LowCardinality(String),
  `browser` LowCardinality(String),
  `os` LowCardinality(String),
  `device` LowCardinality(String),
  `screen` LowCardinality(String),
  `language` LowCardinality(String),
  `country` LowCardinality(FixedString(2)),
  `subdivision1` LowCardinality(String),
  `subdivision2` LowCardinality(String),
  `city` String CODEC(ZSTD(3)),
  `utm_source` String CODEC(ZSTD(3)),
  `utm_medium` String CODEC(ZSTD(3)),
  `utm_campaign` String CODEC(ZSTD(3)),
  `utm_content` String CODEC(ZSTD(3)),
  `utm_term` String CODEC(ZSTD(3)),
  `meta.key` Array(String) CODEC(ZSTD(3)),
  `meta.value` Array(String) CODEC(ZSTD(3))
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(timestamp)
ORDER BY (website_id, timestamp, user_id, session_id)
SETTINGS index_granularity = 8192;


CREATE TABLE webyz_analytics.sessions (
  `session_id` UUID,
  `website_id` UUID,
  `user_id` UUID,
  `start_time` DateTime('UTC') CODEC(Delta(4), LZ4),
  `end_time` DateTime('UTC') CODEC(Delta(4), LZ4),
  `duration_seconds` UInt32,
  `entry_page` String CODEC(ZSTD(3)),
  `exit_page` String CODEC(ZSTD(3)),
  `page_views` UInt32,
  `events` UInt32,
  `hostname` LowCardinality(String),
  `browser` LowCardinality(String),
  `os` LowCardinality(String),
  `device` LowCardinality(String),
  `country` LowCardinality(FixedString(2)),
  `city` LowCardinality(String)
)
ENGINE = ReplacingMergeTree(end_time)
ORDER BY (website_id, session_id)
SETTINGS index_granularity = 8192;


CREATE TABLE webyz_analytics.event_data (
  `event_id` UUID,
  `website_id` UUID,
  `data_key` LowCardinality(String),
  `string_value` Nullable(String) CODEC(ZSTD(3)),
  `number_value` Nullable(Decimal64(4)),
  `date_value` Nullable(DateTime('UTC')),
  `data_type` LowCardinality(String),
)
ENGINE = MergeTree
ORDER BY (website_id, data_key)
SETTINGS index_granularity = 8192;


CREATE TABLE webyz_analytics.hourly_aggregates (
  `website_id` UUID,
  `hour` DateTime('UTC'),
  `hostname` LowCardinality(String),
  `browser` LowCardinality(String),
  `os` LowCardinality(String),
  `device` LowCardinality(String),
  `country` LowCardinality(FixedString(2)),
  `city` String CODEC(ZSTD(3)),
  `views` SimpleAggregateFunction(sum, UInt64),
)
ENGINE = AggregatingMergeTree
PARTITION BY toYYYYMM(hour)
ORDER BY (website_id, hour, hostname, browser, os, device, country)
SETTINGS index_granularity = 8192;

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

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd

DROP MATERIALIZED VIEW IF EXISTS webyz_analytics.hourly_aggregates_mv;
DROP TABLE IF EXISTS webyz_analytics.hourly_aggregates;
DROP TABLE IF EXISTS webyz_analytics.event_data;
DROP TABLE IF EXISTS webyz_analytics.sessions;
DROP TABLE IF EXISTS webyz_analytics.events;