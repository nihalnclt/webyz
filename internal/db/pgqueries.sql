-- pgqueries.sql

-- name: create-user
INSERT INTO users (name, email, password)
VALUES ($1, $2, $3)
RETURNING id;

-- name: get-user
SELECT id, name, email, created_at, updated_at 
FROM users
WHERE (
  CASE
    WHEN $1::INT != 0 THEN id = $1
    WHEN $2::TEXT != '' THEN email = $2
  END
)