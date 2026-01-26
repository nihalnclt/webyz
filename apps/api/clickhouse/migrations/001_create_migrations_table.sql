-- This migration creates the migrations tracking table
CREATE TABLE IF NOT EXISTS webyz_analytics.migrations (
  name String,
  executed_at DateTime
) ENGINE = MergeTree() ORDER BY executed_at;