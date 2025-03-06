package game

import (
	"encoding/json"
	"io"
	"os"
	"testing"
)

// WITH THIS SPECIFIC STATE
// I WAS GETTING A PANIC AS IT COULDNT FIND
// VIALBLE MOVES WHICH IS NOT TRUE
// FIXED: 2025-3-6
// THE I DIDNT UNDERSTAND GO TO STATEMENTS (still dont lol)
func TestGameState_mock_1(t *testing.T) {
	file, err := os.Open(os.Getenv("HOME") + "/projects/onitama-vs/onitama-server/assets/mock-01.json")
	if err != nil {
		t.Fatal(err)
	}
	defer file.Close()
	input, err := io.ReadAll(file)
	if err != nil {
		t.Fatal(err)
	}
	gs := &GameState{}
	err = json.Unmarshal(input, gs)
	if err != nil {
		t.Fatal(err)
	}

	t.Run("should not panic", func(t *testing.T) {
		gs.AiPlayTurn()
	})
}
