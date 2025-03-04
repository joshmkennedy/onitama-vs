package game

import "log"

func (g *GameState) AiPlayer(eventType string, payload interface{}) uint8 {
    log.Println("AiPlayer", eventType)
	if eventType == "gameState" && g.CurrentPlayer == 2 {
		return g.AiPlayTurn()
	}
    return INVALID_PAYLOAD // this should be a dedicated int
}

func (g *GameState) AiPlayTurn() uint8 {
    println("AiPlayer PlayTurn before", g.CurrentPlayer)
    g.CurrentPlayer = 1
    println("AiPlayer PlayTurn after", g.CurrentPlayer)
    return SUCCESS
}

