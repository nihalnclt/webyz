package models

import null "github.com/volatiletech/null/v9"

type Base struct {
	ID        int       `db:"id" json:"id"`
	CreatedAt null.Time `db:"created_at" json:"created_at"`
	UpdatedAt null.Time `db:"updated_at" json:"updated_at"`
}

type User struct {
	Base

	Name     string       `db:"name" json:"name"`
	Email    string       `db:"email" json:"email"`
	Password *null.String `db:"password" json:"password,omitempty"`
}
