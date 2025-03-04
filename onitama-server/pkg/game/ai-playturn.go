package game

import (
	"log"
	"onitama-server/pkg/utils"
)

type Turn struct {
	Card int
	Pos  Position
	Unit uint8
}

func (g *GameState) AiPlayTurn() (int, Position, uint8) {
	log.Println("AiPlayer is thinking")
	// lets just pick a random card
	cards := g.PlayerCards(2)
	foundPos := false
	var validMoves []Turn

	for _, cardIdx := range cards {
		cardPositions := normalizePositionsForPlayer(2, g.Cards[cardIdx].Positions)

		for _, unit := range g.PlayerUnits(2) {

			if !unit.IsAlive {
				continue
			}
			upos := unit.Position
			// try all positions relative to the unit position
			for _, pos := range cardPositions {
				possibleMovePos := Position{X: upos.X + pos.X, Y: upos.Y + pos.Y}
				if possibleMovePos.X < 0 || possibleMovePos.X >= 5 || possibleMovePos.Y < 0 || possibleMovePos.Y >= 5 {
					continue
				}

				ourUnits := g.PlayerUnits(2)
				for _, ourUnit := range ourUnits {
					if ourUnit.Position == possibleMovePos {
						continue
					}
				}
				turn := Turn{Card: cardIdx, Pos: possibleMovePos, Unit: unit.Id}
				validMoves = append(validMoves, turn)
				foundPos = true
			}

		}
	}

	if !foundPos {
		panic("No valid positions found")
	}

	chosenMove := utils.GetRandomSlice(validMoves, 1)[0]
	log.Printf("AI player CHOSE this move:\n %+v", chosenMove)
	return chosenMove.Card, chosenMove.Pos, chosenMove.Unit
}
