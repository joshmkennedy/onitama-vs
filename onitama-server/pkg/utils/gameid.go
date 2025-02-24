package utils

import (
	"crypto/rand"
	"encoding/base64"
	"strings"
)

// Generate a short random string for game ID
func GenerateGameID() string {
	b := make([]byte, 6) // 6 bytes = ~8 characters after encoding
	_, err := rand.Read(b)
	if err != nil {
		panic(err) // Handle error properly in real apps
	}
	return strings.TrimRight(base64.URLEncoding.EncodeToString(b), "=") // Example: "fG_9dK3"
}

