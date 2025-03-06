package game

import (
	"reflect"
	"testing"
)

// Tests to ensure we collect the correct tile states based on
// the current position and the next position and the oppenents units and cards
func TestMoveEvaluation_TileStates(t *testing.T) {
	tests := []struct {
		name string // description of this test case
		// Named input parameters for receiver constructor.
		units []*Unit

		// since cards are written from player 2's persp
		// we need to inverse from how we would think
		opponentCards []Card
		// Named input parameters for target function.
		unitToMove *Unit
		nextPos    Position
		want       []TileState
	}{
		{
			name: "WIll Add HAS Captain If Unit is Captain",
			units: []*Unit{
				{Id: 1, Type: "captain", Position: Position{X: 1, Y: 0}, Owner: 1, IsAlive: true},
			},
			opponentCards: []Card{
				{Name: "Test", Positions: []Position{{X: 0, Y: 0}}}, // they cant move
				{Name: "Test", Positions: []Position{{X: 0, Y: 0}}}, // they cant move
			},
			unitToMove: &Unit{Id: 1, Type: "captain", Position: Position{X: 1, Y: 1}, Owner: 2, IsAlive: true},
			nextPos:    Position{X: 1, Y: 0},
			want:       []TileState{TILE_HASCAPTAIN}, // Example expected state
		},
		{
			name: "WiLL Add hAS PAWN If Unit is PAWN",
			units: []*Unit{
				{Id: 1, Type: "pawn", Position: Position{X: 1, Y: 0}, Owner: 1, IsAlive: true},
				{Id: 2, Type: "captain", Position: Position{X: 0, Y: 0}, Owner: 1, IsAlive: true},
			},
			opponentCards: []Card{
				{Name: "Test", Positions: []Position{{X: 0, Y: 0}}}, // they cant move
				{Name: "Test", Positions: []Position{{X: 0, Y: 0}}}, // they cant move
			},
			unitToMove: &Unit{Id: 1, Type: "captain", Position: Position{X: 3, Y: 3}, Owner: 2, IsAlive: true},
			nextPos:    Position{X: 1, Y: 0},
			want:       []TileState{TILE_HASPAWN}, // Example expected state
		},
		{
			name: "Empty TileStates if is EMpty tile",
			units: []*Unit{
				{Id: 1, Type: "pawn", Position: Position{X: 2, Y: 0}, Owner: 1, IsAlive: true},
				{Id: 2, Type: "captain", Position: Position{X: 0, Y: 0}, Owner: 1, IsAlive: true},
			},
			opponentCards: []Card{
				{Name: "Test", Positions: []Position{{X: 0, Y: 0}}}, // they cant move
				{Name: "Test", Positions: []Position{{X: 0, Y: 0}}}, // they cant move
			},
			unitToMove: &Unit{Id: 1, Type: "captain", Position: Position{X: 2, Y: 1}, Owner: 2, IsAlive: true},
			nextPos:    Position{X: 4, Y: 4},
			want:       []TileState{TILE_EMPTY}, // Example expected state
		},
		{
			name: "TILE_BECAPTURED if unit could be captured next turn",
			units: []*Unit{
				{Id: 2, Type: "captain", Position: Position{X: 1, Y: 0}, Owner: 1, IsAlive: true}, // this is the one that shall do the capturing
			},

			opponentCards: []Card{
				{Name: "Test", Positions: []Position{{X: -1, Y: -1}}}, // can move right
			},
			unitToMove: &Unit{Id: 1, Type: "pawn", Position: Position{X: 3, Y: 1}, Owner: 2, IsAlive: true},
			nextPos:    Position{X: 2, Y: 1}, // moving to a place wher the captain can get us
			want:       []TileState{TILE_BECAPTURED, TILE_EMPTY},
		},
		{
			name: "CURRENT_TILE_BECAPTURED if unit could be captured this turn",
			units: []*Unit{
				{Id: 1, Type: "pawn", Position: Position{X: 0, Y: 0}, Owner: 1, IsAlive: true},
				{Id: 2, Type: "captain", Position: Position{X: 1, Y: 0}, Owner: 1, IsAlive: true},
			},
			opponentCards: []Card{
				// can move right 1 and down 1 this means they can capture us
				{Name: "Test", Positions: []Position{{X: -1, Y: -1}}},
				{Name: "Test", Positions: []Position{{X: 0, Y: 0}}}, // they cant move
			},
			unitToMove: &Unit{Id: 1, Type: "pawn", Position: Position{X: 2, Y: 1}, Owner: 2, IsAlive: true},
			nextPos:    Position{X: 3, Y: 0},
			want:       []TileState{CURRENT_TILE_BECAPTURED, TILE_EMPTY},
		},
		{
			//TODO: this is a good test to test to check score when that time comes
			name: "Can Collect Multiple TileStates",
			units: []*Unit{
				{Id: 1, Type: "pawn", Position: Position{X: 0, Y: 0}, Owner: 1, IsAlive: true},    // this could capture us
				{Id: 2, Type: "captain", Position: Position{X: 1, Y: 0}, Owner: 1, IsAlive: true}, // this will be captured this turn
			},
			opponentCards: []Card{
				{Name: "Test", Positions: []Position{{X: -1, Y: 0}}},
				{Name: "Test", Positions: []Position{{X: 0, Y: 0}}}, // they cant move
			},
			unitToMove: &Unit{Id: 1, Type: "pawn", Position: Position{X: 2, Y: 1}, Owner: 2, IsAlive: true},
			nextPos:    Position{X: 1, Y: 0},
			// we captured the captain and the next turn we could of been
			// caputed
			want: []TileState{TILE_BECAPTURED, TILE_HASCAPTAIN},
		},
		{
			name: "Collects both CURRENT_TILE_BECAPTURED and TILE_HASPAWN",
			units: []*Unit{
				{Id: 1, Type: "pawn", Position: Position{X: 0, Y: 0}, Owner: 1, IsAlive: true},
				{Id: 2, Type: "captain", Position: Position{X: 1, Y: 0}, Owner: 1, IsAlive: true},
			},
			opponentCards: []Card{
				{Name: "Test", Positions: []Position{{X: -1, Y: 0}}},
				{Name: "Test", Positions: []Position{{X: 0, Y: 0}}}, // they cant move
			},
			unitToMove: &Unit{Id: 1, Type: "pawn", Position: Position{X: 2, Y: 0}, Owner: 2, IsAlive: true},
			nextPos:    Position{X: 0, Y: 0},
			want:       []TileState{TILE_HASPAWN, CURRENT_TILE_BECAPTURED},
		},
		{
			name: "Collects collects TILE_ISHOME",
			units: []*Unit{
				{Id: 1, Type: "pawn", Position: Position{X: 3, Y: 3}, Owner: 1, IsAlive: true},
				{Id: 2, Type: "captain", Position: Position{X: 2, Y: 2}, Owner: 1, IsAlive: true},
			},
			opponentCards: []Card{
				// can move right 1 and down 1 this means they can capture us
				{Name: "Test", Positions: []Position{{X: 0, Y: 0}}},
				{Name: "Test", Positions: []Position{{X: 0, Y: 0}}}, // they cant move
			},
			unitToMove: &Unit{Id: 1, Type: "captain", Position: Position{X: 1, Y: 3}, Owner: 2, IsAlive: true},
			nextPos:    Position{X: 2, Y: 0},
			want:       []TileState{TILE_ISHOME, TILE_EMPTY},
		},
		{
			name: "Collects WILLLOSE ALSO CHEck if unit is alive if it can get us",
			units: []*Unit{
				// this should not move or count against as he is dead
				{Id: 1, Type: "pawn", Position: Position{X: 2, Y: 1}, Owner: 1, IsAlive: false},

				{Id: 1, Type: "pawn", Position: Position{X: 2, Y: 0}, Owner: 1, IsAlive: true},
				{Id: 2, Type: "captain", Position: Position{X: 4, Y: 0}, Owner: 1, IsAlive: true},
			},
			opponentCards: []Card{
				{Name: "Test", Positions: []Position{{X: -1, Y: -1}}},
				{Name: "Test", Positions: []Position{{X: 1, Y: 0}}},
			},
			unitToMove: &Unit{Id: 1, Type: "captain", Position: Position{X: 1, Y: 1}, Owner: 2, IsAlive: true},
			nextPos:    Position{X: 3, Y: 0},
			want:       []TileState{TILE_WILLOOSE, TILE_EMPTY},
		},
		{
			name: "Collects 'CURRENT_TILE_WILLLOSE' if we loose if we dont move",
			units: []*Unit{
				// this should not move or count against as he is dead
				{Id: 1, Type: "pawn", Position: Position{X: 2, Y: 1}, Owner: 1, IsAlive: false},

				{Id: 1, Type: "pawn", Position: Position{X: 2, Y: 0}, Owner: 1, IsAlive: true},
				{Id: 2, Type: "captain", Position: Position{X: 4, Y: 0}, Owner: 1, IsAlive: true},
			},
			opponentCards: []Card{
				// can move right 1 and down 1 this means they can capture us
				{Name: "Test", Positions: []Position{{X: 1, Y: -1}}},
				{Name: "Test", Positions: []Position{{X: 1, Y: 0}}},
			},
			unitToMove: &Unit{Id: 1, Type: "captain", Position: Position{X: 3, Y: 0}, Owner: 2, IsAlive: true},
			nextPos:    Position{X: 0, Y: 2},
			// we captured the captain and the next turn we could of been
			// caputed
			want: []TileState{CURRENT_TILE_WILLOOSE, TILE_EMPTY},
		},

		// real world scenarios?
		{
			name: "Collects will loose and current will loose",
			units: []*Unit{
				// this should not move or count against as he is dead
				{Id: 1, Type: "pawn", Position: Position{X: 2, Y: 1}, Owner: 1, IsAlive: false},

				{Id: 1, Type: "pawn", Position: Position{X: 2, Y: 0}, Owner: 1, IsAlive: true},    // this one get us now
				{Id: 2, Type: "captain", Position: Position{X: 4, Y: 0}, Owner: 1, IsAlive: true}, // this one get us next
			},
			opponentCards: []Card{
				{Name: "Test", Positions: []Position{{X: -1, Y: 0}}}, // move to get us now
				{Name: "Test", Positions: []Position{{X: 2, Y: -1}}}, // move to get us next
			},
			unitToMove: &Unit{Id: 1, Type: "captain", Position: Position{X: 3, Y: 0}, Owner: 2, IsAlive: true},
			nextPos:    Position{X: 2, Y: 1},

			want: []TileState{CURRENT_TILE_WILLOOSE, TILE_WILLOOSE, TILE_EMPTY},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			me := newMoveEvaluation(tt.unitToMove, tt.units, tt.opponentCards)
			got := me.TileStates(tt.nextPos)

			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("TileStates() = %+v, want %+v", PrintTileStates(got), PrintTileStates(tt.want))
			}
		})
	}
}
