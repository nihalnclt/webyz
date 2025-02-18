package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"strings"
	"syscall"
	"time"

	_ "github.com/ClickHouse/clickhouse-go/v2"
	"github.com/go-playground/validator/v10"
	"github.com/jmoiron/sqlx"
	"github.com/knadh/goyesql/v2"
	goyesqlx "github.com/knadh/goyesql/v2/sqlx"
	"github.com/knadh/koanf/parsers/toml"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
	"github.com/knadh/stuffbin"
	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
	"github.com/nihalnclt/webyz/internal/models"
)

type CustomValidator struct {
	validator *validator.Validate
}

func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}
	return nil
}

type DBConnections struct {
	Postgres   *sqlx.DB
	Clickhouse *sqlx.DB
}

func initDB() *DBConnections {
	var cfg struct {
		Postgres struct {
			Host     string `koanf:"host"`
			Port     int    `koanf:"port"`
			User     string `koanf:"user"`
			Password string `koanf:"password"`
			DBName   string `koanf:"dbname"`
		} `koanf:"postgres"`
		ClickHouse struct {
			Host     string `koanf:"host"`
			Port     int    `koanf:"port"`
			User     string `koanf:"user"`
			Password string `koanf:"password"`
			DBName   string `koanf:"dbname"`
		} `koanf:"clickhouse"`
	}

	// Load configuration from koanf
	if err := ko.Unmarshal("db", &cfg); err != nil {
		log.Fatalf("error loading db config: %v", err)
	}

	// PostgresSQL connection
	postgresDSN := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		cfg.Postgres.Host, cfg.Postgres.Port, cfg.Postgres.User, cfg.Postgres.Password,
		cfg.Postgres.DBName, "disable")

	log.Printf("Connecting to postgresSQL: %s:%d/%s", cfg.Postgres.Host, cfg.Postgres.Port, cfg.Postgres.DBName)
	postgresDB, err := sqlx.Connect("postgres", postgresDSN)
	if err != nil {
		log.Fatalf("error connecting to postgresSQL: %v", err)
	}

	// ClickHouse connection
	clickhouseDSN := fmt.Sprintf("clickhouse://%s:%s@%s:%d/%s",
		cfg.ClickHouse.User, cfg.ClickHouse.Password, cfg.ClickHouse.Host, cfg.ClickHouse.Port, cfg.ClickHouse.DBName)

	log.Printf("Connecting to clickHouse: %s:%d/%s", cfg.ClickHouse.Host, cfg.ClickHouse.Port, cfg.ClickHouse.DBName)
	clickhouseDB, err := sqlx.Connect("clickhouse", clickhouseDSN)
	if err != nil {
		log.Fatalf("error connecting to clickHouse: %v", err)
	}

	return &DBConnections{
		Postgres:   postgresDB,
		Clickhouse: clickhouseDB,
	}
}

func initConfigFiles(files []string, ko *koanf.Koanf) {
	for _, f := range files {
		if err := ko.Load(file.Provider(f), toml.Parser()); err != nil {
			if os.IsNotExist(err) {
				log.Fatal("config file not found.")
			}
			log.Fatalf("error loading config file: %v", err)
		}
	}
}

func initHttpServer(app *App) *echo.Echo {
	var srv = echo.New()
	srv.HideBanner = true

	// Register app (*App) to be injected into all HTTP handlers
	srv.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Set("app", app)
			return next(c)
		}
	})

	srv.Validator = &CustomValidator{validator: validator.New()}

	// Register all HTTP handlers
	initHTTPHandlers(srv, app)

	// Start the server
	go func() {
		if err := srv.Start(":8080"); err != nil {
			if errors.Is(err, http.ErrServerClosed) {
				log.Println("HTTP server shutdown")
			} else {
				log.Fatalf("Error starting http server: %v", err)
			}
		}
	}()

	return srv
}

func awaitReload(sigChan chan os.Signal, closerWait chan bool, closer func()) chan bool {
	out := make(chan bool)

	// Respawn a new process and exit the running one.
	respawn := func() {
		if err := syscall.Exec(os.Args[0], os.Args, os.Environ()); err != nil {
			log.Fatalf("error spawning process: %v", err)
		}
		os.Exit(0)
	}

	go func() {
		for range sigChan {

			go closer()
			select {
			case <-closerWait:
				// Wait for the closer to finish
				respawn()
			case <-time.After(time.Second * 3):
				// Or timeout and force close
				respawn()
			}
		}
	}()

	return out
}

func initFS(appDir string) stuffbin.FileSystem {
	// stuffbin real_path:virtual_alias paths to map local assets on disk.
	// when there is an embeded filesystem not found.

	var appFiles = []string{
		"./internal/db/pgqueries.sql:pgqueries.sql",
		"./internal/db/chqueries.sql:chqueries.sql",
	}

	// Get the executable's execPath.
	execPath, err := os.Executable()
	if err != nil {
		log.Fatalf("error getting execuable path: %v", err)
	}

	// Load embeded files in executable.
	hasEmbed := true
	fs, err := stuffbin.UnStuff(execPath)
	if err != nil {
		hasEmbed = false

		// Running in local mode. Load local assets into
		// the in-memory stuffbin.Filesystem.
		log.Printf("unable to initialize embedded filesystem (%v). Using local filesystem", err)

		fs, err = stuffbin.NewLocalFS("/")
		if err != nil {
			log.Fatalf("failed to initialize local filesystem for assets: %v", err)
		}
	}

	// If the embed failed, load app and frontend files from the compile-time paths.
	files := []string{}
	if !hasEmbed {
		files = append(files, joinFSPaths(appDir, appFiles)...)
	}

	if len(files) == 0 {
		return fs
	}

	// Load files from disk and overlay into the FS
	fStatic, err := stuffbin.NewLocalFS("/", files...)
	if err != nil {
		log.Fatalf("failed reading static files from disk: %v", err)
	}

	if err := fs.Merge(fStatic); err != nil {
		log.Fatalf("error merging static files: %v", err)
	}

	return fs
}

func joinFSPaths(root string, paths []string) []string {
	out := make([]string, 0, len(paths))
	for _, p := range paths {
		f := strings.Split(p, ":")

		out = append(out, path.Join(root, f[0]+":"+f[1]))
	}

	return out
}

func readQueries(sqlFile string, fs stuffbin.FileSystem) goyesql.Queries {
	// Load SQL queries
	qB, err := fs.Read(sqlFile)
	if err != nil {
		log.Fatalf("error reading SQL file %s: %v", sqlFile, err)
	}
	qMap, err := goyesql.ParseBytes(qB)
	if err != nil {
		log.Fatalf("error parsing SQL queries: %v", err)
	}

	return qMap
}

func preparePgQueries(qMap goyesql.Queries, db *sqlx.DB) *models.PgQueries {
	var q models.PgQueries

	if err := goyesqlx.ScanToStruct(&q, qMap, db.Unsafe()); err != nil {
		log.Fatalf("error preparing SQL queries: %v", err)
	}

	fmt.Printf("Prepared CH Queries: %+v\n", q) // Debugging log

	return &q
}

func prepareChQueries(qMap goyesql.Queries, db *sqlx.DB) *models.ChQueries {
	// Scan and prepare all queries
	var q models.ChQueries
	if err := goyesqlx.ScanToStruct(&q, qMap, db.Unsafe()); err != nil {
		log.Fatalf("error preparing SQL queries: %v", err)
	}

	fmt.Printf("Prepared CH Queries: %+v\n", q) // Debugging log

	return &q
}
