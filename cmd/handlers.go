package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

const (
	// stdInputMaxLen is the maximum allowed length for a standard input field.
	stdInputMaxLen = 2000

	sortAsc  = "asc"
	sortDesc = "desc"
)

func initHTTPHandlers(e *echo.Echo, app *App) {
	// Default error handler
	e.HTTPErrorHandler = func(err error, c echo.Context) {
		if _, ok := err.(*echo.HTTPError); !ok {
			// app.log.Println(err.Error())
			println(err.Error())
		}
		e.DefaultHTTPErrorHandler(err, c)
	}

	var (
		// Authenticated /api/* handlers
		api = e.Group("")
	)

	api.GET("/api/v1/health", handleHealthCheck)
	api.POST("/api/v1/register", handleRegister)
	// api.POST("/api/v1/login", handleLogin)
}

// handleHealthCheck is a health check endpoint that returns a 200 response
func handleHealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, "OK RESP")
}
