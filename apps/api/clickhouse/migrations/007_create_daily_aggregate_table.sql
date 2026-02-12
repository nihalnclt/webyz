CREATE TABLE webyz_analytics.daily_aggregates (
  `website_id` String,
  `day` Date,
  `visits` SimpleAggregateFunction(sum, UInt64),
  `pageviews` SimpleAggregateFunction(sum, UInt64),
  `bounces` SimpleAggregateFunction(sum, UInt64),
  `total_duration` SimpleAggregateFunction(sum, UInt64),
  `visitors` AggregateFunction(uniq, String)
)
ENGINE = AggregatingMergeTree
PARTITION BY toYYYYMM(day)
ORDER BY (website_id, day)
SETTINGS index_granularity = 8192;
