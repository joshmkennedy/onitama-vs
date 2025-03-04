package game

func (g *GameState) AiPlayer(eventType string, payload interface{}) uint8 {
	if eventType == "playTurn" {
		return g.AiPlayTurn()
	}
    return INVALID_PAYLOAD // this should be a dedicated int
}

func (g *GameState) AiPlayTurn() uint8 {
    return SUCCESS
}

