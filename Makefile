# Variables for goose
GOOSE=goose
POSTGRES_DIR=migrations/postgres
CLICKHOUSE_DIR=migrations/clickhouse

POSTGRES_URL=postgres://postgres:postgres@localhost:5432/webyz?sslmode=disable
CLICKHOUSE_URL=clickhouse://default:@localhost:9000/webyz_analytics


postgres_up:
	$(GOOSE) --dir $(POSTGRES_DIR) postgres $(POSTGRES_URL) up

postgres_down:
	$(GOOSE) --dir $(POSTGRES_DIR) postgres $(POSTGRES_URL) down


clickhouse_up:
	$(GOOSE) --dir $(CLICKHOUSE_DIR) clickhouse $(CLICKHOUSE_URL) up

clickhouse_down:
	$(GOOSE) --dir $(CLICKHOUSE_DIR) clickhouse $(CLICKHOUSE_URL) down