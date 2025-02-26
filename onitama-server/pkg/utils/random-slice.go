package utils

import (
	"math/rand"
	"time"
)

// getRandomSlice returns a random subset of items from the input slice
func GetRandomSlice[T any](items []T, count int) []T {
	// Shuffle the slice to randomize order
    rn := rand.New(rand.NewSource(time.Now().UnixNano()))
	rn.Shuffle(len(items), func(i, j int) { items[i], items[j] = items[j], items[i] })

	// Ensure count doesn't exceed available items
	if count > len(items) {
		count = len(items)
	}

	// Return a random slice of the specified length
	return items[:count]
}
