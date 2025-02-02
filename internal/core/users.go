package core

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/nihalnclt/webyz/internal/models"
)

func (c *Core) GetUser(id int, email string) (models.User, error) {
	var out models.User
	// if err := c.pgQ.GetUser.Get(&out, id, email); err != nil {
	// 	if err == sql.ErrNoRows {
	// 		return out, echo.NewHTTPError(http.StatusInternalServerError, "No user found")
	// 	}

	// 	return out, echo.NewHTTPError(http.StatusInternalServerError, "Error fetching user")
	// }

	return out, nil
}

func (c *Core) CreateUser(u *models.User) (models.User, error) {
	var id int

	// var out models.User
	if err := c.pgQ.CreateUser.Get(&id, u.Name, u.Email, u.Password); err != nil {
		if isPgUniqueViolation(err) {
			return models.User{}, echo.NewHTTPError(http.StatusConflict, "Email already exists")
		}
		return models.User{}, echo.NewHTTPError(http.StatusInternalServerError, "Failed to create user")
	}

	out, err := c.GetUser(id, "")
	return out, err
}
