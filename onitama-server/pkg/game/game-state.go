package game

import (
	"encoding/json"
	"onitama-server/pkg/utils"
	"os"
)

// PLAYER 1 UNITS
/*
   { id: 1, type: "pawn", position: { x: 0, y: 0 }, owner: 1 },
   { id: 2, type: "pawn", position: { x: 1, y: 0 }, owner: 1 },
   { id: 3, type: "captain", position: { x: 2, y: 0 }, owner: 1 },
   { id: 4, type: "pawn", position: { x: 3, y: 0 }, owner: 1 },
   { id: 5, type: "pawn", position: { x: 4, y: 0 }, owner: 1 },
*/
// PLAYER 2 UNITS
/*
   { id: 6, type: "pawn", position: { x: 0, y: 4 }, owner: 2 },
   { id: 7, type: "pawn", position: { x: 1, y: 4 }, owner: 2 },
   { id: 8, type: "captain", position: { x: 2, y: 4 }, owner: 2 },
   { id: 9, type: "pawn", position: { x: 3, y: 4 }, owner: 2 },
   { id: 10, type: "pawn", position: { x: 4, y: 4 }, owner: 2 },
*/

type Status int
const (
    STATUS_WAITING Status = iota
    STATUS_PLAYING
    STATUS_WON
)

type GameState struct {
    Status Status
	// Who Can play their turn
	CurrentPlayer uint8 `json:"currentPlayer"`

	// Cards Available in this game
	Cards []Card `json:"cards"`

	// Player 1's Cards they can play
	Player1Cards [2]int `json:"player1Cards"`

	// Player 2's Cards they can play
	Player2Cards [2]int `json:"player2Cards"`

	// Next Card Available to Player 1
	Player1NextCard *int `json:"player1NextCard"`

	// Next Card Available to Player 2
	Player2NextCard *int `json:"player2NextCard"`

	// Player 1's Units
	Player1Units [5]*Unit `json:"player1Units"`

	// Player 2's Units
	Player2Units [5]*Unit `json:"player2Units"`
}

type Card struct {
	Name      string     `json:"name"`
	Positions []Position `json:"positions"`
}

type Position struct {
	X int8 `json:"x"`
	Y int8 `json:"y"`
}

type Unit struct {
	Id       uint8    `json:"id"`
	Owner    uint8    `json:"owner"`
	Type     string   `json:"type"` // "captain" || "pawn"
	Position Position `json:"position"`
	IsAlive  bool     `json:"isAlive"`
}

func NewGameState() *GameState {
	generatedCards := generateCards()

    player1Cards := [2]int{0,1}
	player1NextCard := 2

    player2Cards := [2]int{3,4}

	var player1Units = [5]*Unit{
		{Id: 1, Type: "pawn", Position: Position{X: 0, Y: 0}, Owner: 1, IsAlive: true},
		{Id: 2, Type: "pawn", Position: Position{X: 1, Y: 0}, Owner: 1, IsAlive: true},
		{Id: 3, Type: "captain", Position: Position{X: 2, Y: 0}, Owner: 1, IsAlive: true},
		{Id: 4, Type: "pawn", Position: Position{X: 3, Y: 0}, Owner: 1, IsAlive: true},
		{Id: 5, Type: "pawn", Position: Position{X: 4, Y: 0}, Owner: 1, IsAlive: true},
	}

	var player2Units = [5]*Unit{
		{Id: 6, Type: "pawn", Position: Position{X: 0, Y: 4}, Owner: 2, IsAlive: true},
		{Id: 7, Type: "pawn", Position: Position{X: 1, Y: 4}, Owner: 2, IsAlive: true},
		{Id: 8, Type: "captain", Position: Position{X: 2, Y: 4}, Owner: 2, IsAlive: true},
		{Id: 9, Type: "pawn", Position: Position{X: 3, Y: 4}, Owner: 2, IsAlive: true},
		{Id: 10, Type: "pawn", Position: Position{X: 4, Y: 4}, Owner: 2, IsAlive: true},
	}

	return &GameState{
		CurrentPlayer: 1,

		Cards: generatedCards,

		Player1Cards:    player1Cards,
		Player1NextCard: &player1NextCard,
		Player1Units:    player1Units,

		Player2Cards: player2Cards,
		Player2Units: player2Units,
	}
}

func generateCards() []Card {
	// read from cards.json
    cardsfile := os.Getenv("CARD_CONFIG_FILE")
	jsonContents, err := os.ReadFile(cardsfile)
	if err != nil {
		panic(err)
	}
	_cards := &[]Card{}
	json.Unmarshal(jsonContents, _cards)
	cards := utils.GetRandomSlice(*_cards, 5)
	return cards
}
