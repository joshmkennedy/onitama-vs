package game

import "log"

// Responses
const (
	SUCCESS = iota
	WRONG_PLAYER

	INVALID_PAYLOAD

	INVALID_UNIT
	INVALID_CARD
	INVALID_POSITION

	WON_STATE_REACHED

    NEW_GAME
)

func (g *GameState) HandleEvent(from uint8, eventType string, payload interface{}) uint8 {
	if eventType == "playTurn" {
		log.Printf("Play Turn %+v\n", payload)
        payloadArg:= payload.(map[string]interface{})
		return g.PlayTurn(from, payloadArg)
	}

    if eventType == "newGame" {
        return NEW_GAME
    }
	return 0
}
