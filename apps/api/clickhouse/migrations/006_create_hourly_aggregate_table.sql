CREATE TABLE webyz_analytics.hourly_aggregates (
  `website_id` String,
  `hour` DateTime('UTC'),

  `visits` SimpleAggregateFunction(sum, UInt64),
  `pageviews` SimpleAggregateFunction(sum, UInt64),
  `bounces` SimpleAggregateFunction(sum, UInt64),
  `total_duration` SimpleAggregateFunction(sum, UInt64),

  `visitors` AggregateFunction(uniq, String)
)
ENGINE = AggregatingMergeTree
PARTITION BY toYYYYMM(hour)
ORDER BY (website_id, hour)
SETTINGS index_granularity = 8192;
