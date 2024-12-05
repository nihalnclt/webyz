# Variables for goose
GOOSE=goose
POSTGRES_DIR=migrations/postgres
CLICKHOUSE_DIR=migrations/clickhouse

POSTGRES_URL=postgres://postgres:postgres@localhost:5432/webyz?sslmode=disable
# CLICKHOUSE_URL=clickhouse://user:password@localhost:9000/default


postgres_up:
	$(GOOSE) --dir $(POSTGRES_DIR) postgres $(POSTGRES_URL) up

postgres_down:
	$(GOOSE) --dir $(POSTGRES_DIR) postgres $(POSTGRES_URL) down