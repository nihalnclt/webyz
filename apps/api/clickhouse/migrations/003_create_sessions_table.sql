CREATE TABLE webyz_analytics.sessions (
  `session_id` String,
  `website_id` String,
  `user_id` String,
  `start_time` DateTime('UTC') CODEC(Delta(4), LZ4),
  `end_time` DateTime('UTC') CODEC(Delta(4), LZ4),
  `duration_seconds` UInt32,
  `entry_page` String CODEC(ZSTD(3)),
  `exit_page` String CODEC(ZSTD(3)),
  `page_views` UInt32,
  `events` UInt32,
  `hostname` LowCardinality(String),
  `browser_family` LowCardinality(String),
  `browser_version` LowCardinality(String),
  `os_family` LowCardinality(String),
  `os_version` LowCardinality(String),
  `device_type` LowCardinality(String),
  `device_brand` LowCardinality(String),
  `country` LowCardinality(FixedString(2)),
  `sub_division_1` LowCardinality(String),
  `sub_division_2` LowCardinality(String),
  `city` LowCardinality(String),
  `channel` LowCardinality(String),
  `utm_source` LowCardinality(String),
  `utm_medium` LowCardinality(String),
  `utm_campaign` LowCardinality(String),
  `utm_content` LowCardinality(String),
  `utm_term` LowCardinality(String),
  `referrer_domain` LowCardinality(String),
  `updated_at` DateTime64(3, 'UTC')
)
ENGINE = ReplacingMergeTree(updated_at)
PARTITION BY toYYYYMM(start_time)
ORDER BY (website_id, session_id)
SETTINGS index_granularity = 8192;