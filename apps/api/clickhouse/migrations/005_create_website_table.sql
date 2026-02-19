CREATE TABLE webyz_analytics.websites
(
  `id` String,
  `domain` String,
  `timezone` String,
  `created_at` DateTime
)
ENGINE = ReplacingMergeTree
ORDER BY id;
