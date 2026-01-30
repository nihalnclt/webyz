CREATE TABLE webyz_analytics.events (
  `event_id` String,
  `website_id` String,
  `session_id` String,
  `user_id` String,
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
