CREATE TABLE webyz_analytics.hourly_aggregates (
  `website_id` String,
  `hour` DateTime('UTC'),
  `hostname` LowCardinality(String),
  `browser` LowCardinality(String),
  `os` LowCardinality(String),
  `device_type` LowCardinality(String),
  `country` LowCardinality(FixedString(2)),
  `city` String CODEC(ZSTD(3)),
  `views` SimpleAggregateFunction(sum, UInt64),
)
ENGINE = AggregatingMergeTree
PARTITION BY toYYYYMM(hour)
ORDER BY (website_id, hour, hostname, browser, os, device_type, country)
SETTINGS index_granularity = 8192;
