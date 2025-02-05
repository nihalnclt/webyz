package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/nihalnclt/webyz/internal/models"
	"github.com/nihalnclt/webyz/internal/utils"
	"github.com/volatiletech/null/v9"
)

type RegisterRequest struct {
	Name     string `json:"name" validate:"required"`
	Email    string `json:"email" validate:"required"`
	Password string `json:"password" validate:"required"`
}

func handleRegister(c echo.Context) error {
	var (
		app = c.Get("app").(*App)
	)

	var request RegisterRequest
	if err := c.Bind(&request); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid request format")
	}

	if err := c.Validate(&request); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	hashedPassword, err := utils.HashPassword(request.Password)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Password hashing failed")
	}
	nullPassword := null.StringFrom(hashedPassword)

	u := models.User{
		Name:     request.Name,
		Email:    request.Email,
		Password: &nullPassword,
	}

	if _, err := app.core.CreateUser(&u); err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"message": "User registered successfully",
		"userId":  1,
	})
}

// func handleLogin(c echo.Context) error {
// 	// app := c.Get("app").(*App)
// 	var (
// 		req struct {
// 			Username string `json:"username" validate:"required"`
// 			Password string `json:"password" validate:"required"`
// 		}
// 	)

// 	// Get and validate fields
// 	if err := c.Bind(&req); err != nil {
// 		return err
// 	}

// 	if !utils.StrHasLen(req.Username, 3, stdInputMaxLen) {
// 		return echo.NewHTTPError(http.StatusBadRequest, "Invalid fields: username")
// 	}

// 	if !utils.StrHasLen(req.Password, 8, stdInputMaxLen) {
// 		return echo.NewHTTPError(http.StatusBadRequest, "Invalid fields: password")
// 	}

// 	response := map[string]string{
// 		"message":  "Login successful!",
// 		"username": req.Username,
// 	}

// 	return c.JSON(http.StatusOK, response)
// }
