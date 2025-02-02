package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/knadh/koanf/v2"
	"github.com/knadh/stuffbin"
	"github.com/nihalnclt/webyz/internal/core"
	"github.com/nihalnclt/webyz/internal/models"
)

type App struct {
	core      *core.Core
	chReload  chan os.Signal
	pgDB      *sqlx.DB // PostgresSQL
	chDB      *sqlx.DB // Clickhouse
	pgQueries *models.PgQueries
	chQueries *models.ChQueries
}

var (
	ko        = koanf.New(".")
	fs        stuffbin.FileSystem
	pgDB      *sqlx.DB
	chDB      *sqlx.DB
	pgQueries *models.PgQueries
	chQueries *models.ChQueries

	appDir = "."
)

func init() {
	initConfigFiles([]string{"config.toml"}, ko)

	dbConnections := initDB()
	pgDB = dbConnections.Postgres
	chDB = dbConnections.Clickhouse

	fs = initFS(appDir)

	// Read the SQL queries from the queries file
	pgQMap := readQueries("pgqueries.sql", fs)
	pgQueries = preparePgQueries(pgQMap, pgDB)

	// Prepare queries.
	// chQMap := readQueries("chqueries.sql", fs)
	// chQueries = prepareChQueries(chQMap, chDB)
}

func main() {
	app := &App{
		pgDB: pgDB,
		chDB: chDB,
	}

	app.pgQueries = pgQueries
	app.chQueries = chQueries

	app.core = core.New(&core.Opt{
		PgQueries: pgQueries,
		ChQueries: chQueries,
		PgDB:      pgDB,
		ChDB:      chDB,
	})

	srv := initHttpServer(app)

	app.chReload = make(chan os.Signal)
	signal.Notify(app.chReload, syscall.SIGHUP)

	closerWait := make(chan bool)
	<-awaitReload(app.chReload, closerWait, func() {
		// Stop the HTTP server
		ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
		defer cancel()
		srv.Shutdown(ctx)

		// Signal the close
		closerWait <- true
	})
}
