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
  `browser` LowCardinality(String),
  `os` LowCardinality(String),
  `device` LowCardinality(String),
  `country` LowCardinality(FixedString(2)),
  `city` LowCardinality(String)
)
ENGINE = ReplacingMergeTree(end_time)
ORDER BY (website_id, session_id)
SETTINGS index_granularity = 8192;