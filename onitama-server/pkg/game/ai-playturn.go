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
				possibleMove := Position{X: upos.X + pos.X, Y: upos.Y + pos.Y}
				ourUnits := g.PlayerUnits(2)

				for _, ourUnit := range ourUnits {
					if ourUnit.IsAlive && ourUnit.Position.X == possibleMove.X && ourUnit.Position.Y == possibleMove.Y {
						goto NextUnit
					}
				}

				if possibleMove.X < 0 || possibleMove.X >= 5 || possibleMove.Y < 0 || possibleMove.Y >= 5 {
					continue
				}

				rating := g.moveRating(possibleMove)
				turn := Turn{Card: cardIdx, Pos: possibleMove, Unit: unit.Id, Rating: rating}
				validMoves = append(validMoves, turn)
				foundPos = true
			}
		NextUnit:
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

	log.Printf("AI player CHOSE this move:\n %+v", chosenMove)
	return chosenMove.Card, chosenMove.Pos, chosenMove.Unit
}

func (g *GameState) moveRating(pos Position) int {
	var rating = 1
	tileStates := g.TileStates(pos)

	for _, state := range tileStates {
		switch state {
		case TILE_HASCAPTAIN:
			rating += 5
		case TILE_ISHOME:
			rating += 5
		case TILE_HASPAWN:
			rating += 2
		case TILE_BECAPTURED:
			rating -= 1
		case TILE_WILLOOSE:
			rating -= 2
		case TILE_EMPTY:
			rating += 0
		default:
			rating += 0
		}
	}

	return rating
}

type TileState int

const (
	TILE_EMPTY TileState = iota
	TILE_HASCAPTAIN
	TILE_ISHOME
	TILE_HASPAWN
	TILE_BECAPTURED
	TILE_WILLOOSE
)

// THINGS TO THINK ABOUT
// ITS possible for tile to be captured and a tile to be loosing next turn
//  which could substract enough from a winning tile

func (g *GameState) TileStates(pos Position) []TileState {
	var states []TileState

	isEmpty := true
	// WIN STATE OPTION 1 [TOP(1)]
	if pos.X == 2 && pos.Y == 0 {
		states = append(states, TILE_ISHOME)
	}
	for _, opponentUnit := range g.PlayerUnits(1) {
		if opponentUnit.IsAlive && opponentUnit.Position.X == pos.X && opponentUnit.Position.Y == pos.Y {
			// WIN STATE OPTION 2 [TOP(1)]
			if opponentUnit.Type == "captain" {
				states = append(states, TILE_HASCAPTAIN)
				isEmpty = false
			}

			// PRETTY GOOD STATE [GOOD(3)]
			if opponentUnit.Type == "pawn" {
				states = append(states, TILE_HASPAWN)
				isEmpty = false
			}
		}

		opponentCards := g.PlayerCards(1)
		for _, cardIdx := range opponentCards {
			opponentCard := g.Cards[cardIdx]
			for _, opponentCardPos := range normalizePositionsForPlayer(1, opponentCard.Positions) {
				oppenentPossibleMove := Position{
					X: opponentUnit.Position.X + opponentCardPos.X,
					Y: opponentUnit.Position.Y + opponentCardPos.Y,
				}
				if oppenentPossibleMove.X == pos.X && oppenentPossibleMove.Y == pos.Y {
					if opponentUnit.Type == "captain" {
						// LOOSING STATE [BAD(2)]
						states = append(states, TILE_BECAPTURED)
					} else {
						// LOOSING STATE [BAD(3)]
						states = append(states, TILE_WILLOOSE)
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
