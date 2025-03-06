package game

import (
	"log"
	"sort"
)

type Turn struct {
	Card   int
	Pos    Position
	Unit   uint8
	Rating int
}

func (g *GameState) AiPlayTurn() (int, Position, uint8) {
	log.Println("AiPlayer is thinking...")
	// lets just pick a random card
	cards := g.PlayerCards(2)
	foundPos := false
	var validMoves []Turn
	for _, cardIdx := range cards {
		cardPositions := normalizeCardPositionsForPlayer(2, g.Cards[cardIdx].Positions)

		for _, unit := range g.PlayerUnits(2) {

			// if unit.Type == "captain" {
			// 	log.Printf("CHECKING CAP'N: %+v\n", cardPositions)
			// }

			if !unit.IsAlive {
				continue
			}

			moveEvaluator := newMoveEvaluation(
				unit,
				g.PlayerUnits(1),
				getCardsFromIdx(g.Cards, g.PlayerCards(1)),
			)

			upos := unit.Position
			// try all positions relative to the unit position
			for _, pos := range cardPositions {
				possibleMove := Position{X: upos.X + pos.X, Y: upos.Y + pos.Y}
				ourUnits := g.PlayerUnits(2)

				for _, ourUnit := range ourUnits {
					if ourUnit.IsAlive && ourUnit.Position.X == possibleMove.X && ourUnit.Position.Y == possibleMove.Y {
						goto NextUnit
					}
				}

				if possibleMove.X >= 0 && possibleMove.X < 5 && possibleMove.Y >= 0 || possibleMove.Y < 5 {
					moveRating := moveEvaluator.Rating(possibleMove)
					turn := Turn{Card: cardIdx, Pos: possibleMove, Unit: unit.Id, Rating: moveRating}
					validMoves = append(validMoves, turn)
					foundPos = true
				}
			NextUnit:
			}
		}
	}

	if !foundPos {
		panic("No valid positions found")
	}

	ourUnits := g.PlayerUnits(2)
	for _, ourUnit := range ourUnits {
		for _, validMove := range validMoves {
			if ourUnit.IsAlive && ourUnit.Position.X == validMove.Pos.X && ourUnit.Position.Y == validMove.Pos.Y {
				panic("AI player is trying to move to a position that is already occupied")
			}
		}
	}

	sort.Slice(validMoves, func(i, j int) bool {
		return validMoves[i].Rating > validMoves[j].Rating
	})

	chosenMove := validMoves[0]

	log.Printf("AI player CHOSE this move:\n %+v\n\n\n", chosenMove)
	return chosenMove.Card, chosenMove.Pos, chosenMove.Unit
}

type TileState int

const (
	TILE_EMPTY TileState = iota
	TILE_HASCAPTAIN
	TILE_ISHOME
	TILE_HASPAWN
	TILE_BECAPTURED
	TILE_WILLOOSE
	CURRENT_TILE_BECAPTURED
	CURRENT_TILE_WILLOOSE
)

func getCardsFromIdx(cards []Card, idx []int) []Card {
	var res []Card
	for _, i := range idx {
		res = append(res, cards[i])
	}
	return res
}

func newMoveEvaluation(unitToMove *Unit, units []*Unit, cards []Card) *MoveEvaluation {
	return &MoveEvaluation{
		unitToMove:    unitToMove,
		opponentUnits: units,
		opponentCards: cards,
	}
}

type MoveEvaluation struct {
	unitToMove    *Unit
	opponentUnits []*Unit
	opponentCards []Card
}

// THINGS TO THINK ABOUT
// ITS possible for tile to be captured and a tile to be loosing next turn
// which could substract enough from a winning tile
func (me *MoveEvaluation) Rating(nextPos Position) int {

	var rating = 1
	states := me.TileStates(nextPos)
	for _, state := range states {
		switch state {
		case TILE_HASCAPTAIN:
			rating += 7
		case TILE_ISHOME:
			rating += 7
		case TILE_HASPAWN:
			rating += 5
		case TILE_BECAPTURED:
			rating -= 4
		case CURRENT_TILE_BECAPTURED:
			rating += 3
		case TILE_WILLOOSE:
			rating -= 10
		case CURRENT_TILE_WILLOOSE:
			rating += 10
		case TILE_EMPTY:
			rating += 3
		default:
			rating += 0
		}
	}

	// log.Printf("\n%s(%d)", me.unitToMove.Type, me.unitToMove.Id)
	// log.Println("states = ", states)
	// log.Println("rating = ", rating)
	// log.Println("--")
	return rating
}

func (me *MoveEvaluation) TileStates(nextPos Position) []TileState {
	var states = []TileState{}

	unitType := me.unitToMove.Type
	currentPos := me.unitToMove.Position
	isEmpty := true

	if unitType == "captain" && isP1Home(nextPos) {
		states = append(states, TILE_ISHOME)
	}

	for _, opponent := range me.opponentUnits {
		var futureDeadUnit *Unit
		if !opponent.IsAlive {
			// dont care if dey dead
			continue
		}

		if opponent.Position.X == nextPos.X && opponent.Position.Y == nextPos.Y {
			isEmpty = false
			if opponent.Type == "captain" {
				futureDeadUnit = opponent
				states = append(states, TILE_HASCAPTAIN)
			}

			if opponent.Type == "pawn" {
				futureDeadUnit = opponent
				states = append(states, TILE_HASPAWN)
			}
		}

		for _, card := range me.opponentCards {
			for _, move := range normalizeCardPositionsForPlayer(1, card.Positions) {
				// can they get us if we DONT take THIS move //CURRENT
				if move.X+opponent.Position.X == currentPos.X && move.Y+opponent.Position.Y == currentPos.Y {
					if unitType == "captain" {
						states = append(states, CURRENT_TILE_WILLOOSE)
					} else {
						states = append(states, CURRENT_TILE_BECAPTURED)
					}
				}

				// cant they get if we DO take this move //NEXT
				if move.X+opponent.Position.X == nextPos.X && move.Y+opponent.Position.Y == nextPos.Y {
					// only will need to care if the unit will be alive next turn
					if futureDeadUnit == nil || futureDeadUnit.Id != opponent.Id {
						// oneday will need to know we are a captain
						if unitType == "captain" {
							states = append(states, TILE_WILLOOSE)
						} else {
							states = append(states, TILE_BECAPTURED)
						}
					}
				}
			}
		}
	}

	if isEmpty {
		states = append(states, TILE_EMPTY)
	}

	return states
}

func isP1Home(pos Position) bool {
	return pos.X == 2 && pos.Y == 0
}

func PrintTileStates(tiles []TileState) []string {
	var states []string
	for _, tile := range tiles {
		switch tile {
		case TILE_EMPTY:
			states = append(states, "EMPTY")
		case TILE_HASCAPTAIN:
			states = append(states, "HASCAPTAIN")
		case TILE_ISHOME:
			states = append(states, "ISHOME")
		case TILE_HASPAWN:
			states = append(states, "HASPAWN")
		case TILE_BECAPTURED:
			states = append(states, "BECAPTURED")
		case CURRENT_TILE_BECAPTURED:
			states = append(states, "CURRENT_TILE_BECAPTURED")
		case TILE_WILLOOSE:
			states = append(states, "WILLLOOSE")
		case CURRENT_TILE_WILLOOSE:
			states = append(states, "CURRENT_TILE_WILLOOSE")
		default:
			states = append(states, "UNKNOWN")
		}
	}
	return states
}
