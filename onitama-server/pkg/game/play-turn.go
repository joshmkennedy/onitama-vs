package game

import (
	"errors"
	"fmt"
	"log"
)

type PlayTurnPayload struct {
	SelectedCard     int      `json:"selectedCard"`
	SelectedUnit     uint8    `json:"selectedUnit"`
	SelectedPosition Position `json:"selectedPosition"`
}

func (g *GameState) PlayTurn(from uint8, rawPayload map[string]interface{}) uint8 {
	// Ensure the correct player made the turn
	if from != g.CurrentPlayer {
		return WRONG_PLAYER
	}

	payload, err := decodePlayTurnPayload(rawPayload)
	if err != nil {
		log.Println(err)
		return INVALID_PAYLOAD
	}

	if !g.hasUnit(from, payload.SelectedUnit) && g.unitAlive(from, payload.SelectedUnit) {
		log.Println("Not alive not your unit")
		return INVALID_UNIT
	}

	if !g.hasCard(from, payload.SelectedCard) {
		log.Println("Not Your card")
		return INVALID_CARD
	}

	//Check if position exists on board
	if (payload.SelectedPosition.X < 0 || payload.SelectedPosition.X >= 5) ||
		(payload.SelectedPosition.Y < 0 || payload.SelectedPosition.Y >= 5) {
		log.Println("Not on board")
		return INVALID_POSITION
	}

	// Check if position is valid and is on the card
	if !g.positionOnCard(
		g.getSelectedUnit(payload.SelectedUnit).Position,
		payload.SelectedPosition,
		payload.SelectedCard,
	) {
		log.Println("Not on card")
		return INVALID_POSITION
	}

	opponent := uint8(3 - g.CurrentPlayer) // 1 or 2

	// We keep this so we can check if ther is a winner
	// before we update the game state
	var haveAWinner bool

	// Check for collisions
	opponentUnits := g.PlayerUnits(opponent)
	for _, unit := range opponentUnits {
		pos := unit.Position
		if pos.X == payload.SelectedPosition.X && pos.Y == payload.SelectedPosition.Y {
			// KILL EM dey ded
			unit.IsAlive = false

			// Check for Winner
			if unit.Type == "captain" {
				haveAWinner = true
			}

		}
	}

	// Check for Winner
	if isHomePosition(opponent, payload.SelectedPosition) {
		haveAWinner = true
	}

	// Movie the Piece
	err = g.moveUnit(payload.SelectedUnit, payload.SelectedPosition)
	if err != nil {
		log.Println(err)
		return INVALID_UNIT
	}

	// its now fine to end early
	// and tell the clients the winner
	if haveAWinner {
		return WON_STATE_REACHED
	}

	// Update the Cards
	playedCard := g.Cards[payload.SelectedCard]

	g.setPlayerNextCard(opponent, &payload.SelectedCard)

	for i, globalCardIdx := range g.PlayerCards(g.CurrentPlayer) {
		card := g.Cards[globalCardIdx]
		if card.Name == playedCard.Name {
			nextCard := g.getPlayerNextCard(g.CurrentPlayer)
			if nextCard != nil {
				g.PlayerCards(g.CurrentPlayer)[i] = *nextCard
			}
			break
		}
	}

	g.setPlayerNextCard(g.CurrentPlayer, nil)

	// set next player as CurrentPlayer
	g.CurrentPlayer = opponent

	log.Println("Player ", from, " played card ", payload.SelectedCard)
	return SUCCESS
}

func (g *GameState) PlayerUnits(player uint8) []*Unit {
	if player == 1 {
		return g.Player1Units
	}
	return g.Player2Units
}

func (g *GameState) getPlayerNextCard(player uint8) *int {
	if player == 1 {
		return g.Player1NextCard
	}
	if player == 2 {
		return g.Player2NextCard
	}
	panic("Invalid player passed to getPlayerNextCard")
}

func (g *GameState) setPlayerNextCard(player uint8, card *int) {
	if player == 1 {
		g.Player1NextCard = card
	}
	if player == 2 {
		g.Player2NextCard = card
	}
}

func (g *GameState) getSelectedUnit(selectedUnitId uint8) *Unit {
	units := g.PlayerUnits(g.CurrentPlayer)
	for _, unit := range units {
		if unit.Id == selectedUnitId {
			return unit
		}
	}
	return nil
}

func (g *GameState) hasUnit(player uint8, id uint8) bool {
	units := g.PlayerUnits(player)
	for _, unit := range units {
		if unit.Id == id {
			return true
		}
	}
	return false
}

func (g *GameState) unitAlive(player uint8, id uint8) bool {
	units := g.PlayerUnits(player)
	for _, unit := range units {
		if unit.Id == id {
			return unit.IsAlive
		}
	}
	return false
}

func (g *GameState) moveUnit(unitId uint8, pos Position) error {
	for _, u := range g.PlayerUnits(g.CurrentPlayer) {
		if u.Id == unitId {
			u.Position = pos
			return nil
		}
	}

	return fmt.Errorf("Unit not found")
}

func (g *GameState) PlayerCards(player uint8) []int {
	if player == 1 {
		return g.Player1Cards
	}
	return g.Player2Cards
}

func (g *GameState) hasCard(player uint8, idx int) bool {
	playerCards := g.PlayerCards(player)
	if len(g.Cards) < idx {
		return false
	}
	selectedCard := g.Cards[idx]
	for _, globalCardIdx := range playerCards {
		card := g.Cards[globalCardIdx]
		if card.Name == selectedCard.Name {
			return true
		}
	}
	return false
}

func (g *GameState) positionOnCard(start, end Position, cardIdx int) bool {
	possibleMoves := normalizeCardPositionsForPlayer(g.CurrentPlayer, g.Cards[cardIdx].Positions)
	log.Println("Unit Starts at", start, "Ends at", end)
	log.Println("Card Positions", possibleMoves)

	for _, move := range possibleMoves {
		if start.X+move.X == end.X && start.Y+move.Y == end.Y {
			return true
		}
	}
	return false
}

func normalizeCardPositionsForPlayer(player uint8, positions []Position) []Position {
	if player == 2 {
		return positions
	}
	return inverseMovePositions(positions)
}

func isHomePosition(player uint8, position Position) bool {
	homePositions := map[uint8]Position{
		1: {X: 2, Y: 0},
		2: {X: 2, Y: 4},
	}
	homePos := homePositions[player]
	return position.X == homePos.X && position.Y == homePos.Y
}

func findCardIndex(cards []Card, name string) int {
	for i, card := range cards {
		if card.Name == name {
			return i
		}
	}
	// TODO: return error
	return -1
}

func decodePlayTurnPayload(rawPayload map[string]interface{}) (*PlayTurnPayload, error) {
	// Extract "selectedUnit"
	suVal, ok := rawPayload["selectedUnit"]
	if !ok {
		return nil, errors.New("missing 'selectedUnit' field")
	}
	suFloat, ok := suVal.(float64) // JSON numbers often decode as float64
	if !ok {
		return nil, errors.New("invalid type for 'selectedUnit'; expected a number")
	}
	selectedUnit := uint8(suFloat)

	// Extract "selectedCard"
	scVal, ok := rawPayload["selectedCard"]
	if !ok {
		return nil, errors.New("missing 'selectedCard' field")
	}
	scFloat, ok := scVal.(float64)
	if !ok {
		return nil, errors.New("invalid type for 'selectedCard'; expected a number")
	}
	selectedCard := int(scFloat)

	// Extract "selectedPosition"
	spVal, ok := rawPayload["selectedPosition"]
	if !ok {
		return nil, errors.New("missing 'selectedPosition' field")
	}
	spMap, ok := spVal.(map[string]interface{})
	if !ok {
		return nil, errors.New("invalid type for 'selectedPosition'; expected an object")
	}

	// Extract X
	xVal, ok := spMap["x"]
	if !ok {
		return nil, errors.New("missing 'x' in 'selectedPosition'")
	}
	xFloat, ok := xVal.(float64)
	if !ok {
		return nil, errors.New("invalid type for 'x'; expected a number")
	}
	x := int8(xFloat)

	// Extract Y
	yVal, ok := spMap["y"]
	if !ok {
		return nil, errors.New("missing 'y' in 'selectedPosition'")
	}
	yFloat, ok := yVal.(float64)
	if !ok {
		return nil, errors.New("invalid type for 'y'; expected a number")
	}
	y := int8(yFloat)

	selectedPosition := Position{X: x, Y: y}

	// Build final payload
	payload := &PlayTurnPayload{
		SelectedUnit:     selectedUnit,
		SelectedCard:     selectedCard,
		SelectedPosition: selectedPosition,
	}

	return payload, nil
}
