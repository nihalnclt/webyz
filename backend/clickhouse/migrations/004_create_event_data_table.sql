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
