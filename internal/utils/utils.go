package utils

import "golang.org/x/crypto/bcrypt"

// strHasLen checks if the given string has a length with min-max.
func StrHasLen(str string, min, max int) bool {
	return len(str) >= min && len(str) <= max
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}
