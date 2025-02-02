package core

import (
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"github.com/nihalnclt/webyz/internal/models"
)

type Core struct {
	pgQ  *models.PgQueries
	chQ  *models.ChQueries
	pgDB *sqlx.DB
	chDB *sqlx.DB
}

type Opt struct {
	PgDB      *sqlx.DB
	ChDB      *sqlx.DB
	PgQueries *models.PgQueries
	ChQueries *models.ChQueries
}

func New(o *Opt) *Core {
	return &Core{
		pgDB: o.PgDB,
		chDB: o.ChDB,
		pgQ:  o.PgQueries,
		chQ:  o.ChQueries,
	}
}

// Helper function to check for postgres unique violation
func isPgUniqueViolation(err error) bool {
	pgErr, ok := err.(*pq.Error)
	return ok && pgErr.Code == "23505"
}
