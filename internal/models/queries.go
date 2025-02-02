package models

import (
	"github.com/jmoiron/sqlx"
)

// Queries contains all prepared SQL queries.
type PgQueries struct {
	CreateUser *sqlx.Stmt `query:"create-user"`
	GetUser    *sqlx.Stmt `query:"get-user"`
}

type ChQueries struct {
	CreateUser *sqlx.Stmt `query:"create-user"`
}
