-- chqueries.sql

-- name: create-user
INSERT INTO users (name, email, password)
VALUES ($1, $2, $3)
RETURNING id;