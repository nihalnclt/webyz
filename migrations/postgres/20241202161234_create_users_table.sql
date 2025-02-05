-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- +goose StatementEnd

CREATE TABLE users (
  id          BIGSERIAL PRIMARY KEY,
  displayName TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT,
  logoUrl     TEXT,
  is_active   BOOLEAN NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- +goose StatementEnd

drop table if exists users;