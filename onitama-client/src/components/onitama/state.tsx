import { useCallback } from "react";
import { GameState, Position, Unit } from "./types";
import { atom, useAtom } from "jotai";

export const selectedCardStore = atom<null | number>(null);
export const selectedPosStore = atom<null | Position>(null);
export const selectedUnitStore = atom<null | Unit>(null);

export const gameStateStore = atom<GameState | undefined>(undefined);

export const playerInfoStore = atom<{ playerId: 1 | 2 } | undefined>(undefined);

export const gameInfoStore = atom<
  | {
      gameId: string;
      playerCount: number;
      gameKind: "singleplayer" | "mulitplayer";
    }
  | undefined
>(undefined);

export function updateGameState(
  newState: GameState | undefined,
  isInversed: boolean,
) {
  if (!isInversed || !newState) {
    return newState;
  }
  const copy = structuredClone(newState);
  copy.player1Units = copy.player1Units.map((unit) => {
    return {
      ...unit,
      position: {
        x: 4 - unit.position.x,
        y: 4 - unit.position.y,
      },
    };
  });
  copy.player2Units = copy.player2Units.map((unit) => {
    return {
      ...unit,
      position: {
        x: 4 - unit.position.x,
        y: 4 - unit.position.y,
      },
    };
  });
  return copy;
}

// the inverse of updateGameState
export function normalizedTurn(
  payload: {
    selectedCard: number;
    selectedUnit: number;
    selectedPosition: Position;
  },
  isInversed: boolean,
): { selectedCard: number; selectedUnit: number; selectedPosition: Position } {
  if (!isInversed) {
    return payload;
  }

  return {
    selectedCard: payload.selectedCard,
    selectedUnit: payload.selectedUnit,
    selectedPosition: {
      x: 4 - payload.selectedPosition.x,
      y: 4 - payload.selectedPosition.y,
    },
  };
}

// export function usePlayTurn() {
// 	const [gameState, setGameState] = useAtom(gameStateStore);
//
// 	function playTurn(cardIndex: number, proposedUnit: Unit, position: Position) {
// 		const currentPlayer = gameState?.currentPlayer == 1 ? "player1" : "player2";
// 		//checks to make sure we own the unit
// 		const unitIndex = gameState?.[`${currentPlayer}Units`].findIndex(
// 			(unit) => unit.id == proposedUnit.id,
// 		);
// 		if (unitIndex == -1) {
// 			throw new Error("currentPlayer doesnt own that unit");
// 		}
//
// 		const unit = proposedUnit;
//
// 		if (!gameState[`${currentPlayer}Cards`].includes(cardIndex)) {
// 			throw new Error(`${currentPlayer} doesnt own played card`);
// 		}
//
// 		const card = gameState.Cards[cardIndex];
//
// 		//check if position exits on card
// 		if (
// 			!normalizePositions(currentPlayer, card.positions).some(({ x, y }) => {
// 				const uPos = unit.position;
// 				const newX = uPos.x + x;
// 				const newY = uPos.y + y;
// 				console.log(newX, newY, position.x, position.y);
// 				return newX == position.x && newY == position.y;
// 			})
// 		) {
// 			throw new Error(`position does not exist on card`);
// 		}
//
// 		//check if position exists
// 		if (
// 			!(position.x >= 0 && position.x < 5) ||
// 			!(position.y >= 0 && position.y < 5)
// 		) {
// 			throw new Error(`position not on board`);
// 		}
//
// 		setGameState((prevState: GameState) => {
// 			const newState = { ...prevState };
// 			//check for collisions
// 			const opponent = prevState.currentPlayer == 1 ? 2 : 1;
// 			const opponentUnitsProp = `player${opponent}Units` as
// 				| "player1Units"
// 				| "player2Units";
// 			const opponentUnits: Unit[] = [...gameState[opponentUnitsProp]];
// 			const deadUnit = opponentUnits
// 				.map((unit) => unit.position)
// 				.findIndex((OPos) => OPos.x == position.x && OPos.y == position.y);
//
// 			if (deadUnit != -1) {
// 				// we killed somebody
// 				opponentUnits.splice(deadUnit, 1);
// 				newState[opponentUnitsProp] = opponentUnits;
//
// 				// check for winner
// 				if (prevState[opponentUnitsProp][deadUnit].type == "captain") {
// 					window.alert(`the winner is ${currentPlayer}`);
// 					return getInitialState();
// 				}
// 			}
//
// 			//check for winner
// 			if (
// 				unit.type == "captain" &&
// 				isOpponentsBase(position, prevState.currentPlayer)
// 			) {
// 				window.alert(`the winner is ${currentPlayer}`);
// 				return getInitialState();
// 			}
//
// 			//move the peice(s)
// 			newState[`${currentPlayer}Units`][unitIndex].position = position;
//
// 			//update currentPlayer
// 			newState.currentPlayer = opponent;
//
// 			//update the cards
// 			newState[`${currentPlayer}NextCard`] = null;
// 			newState[`player${opponent}NextCard`] = cardIndex;
// 			console.log(cardIndex, prevState[`${currentPlayer}Cards`]);
// 			const oldCardIndex = prevState[`${currentPlayer}Cards`].find(
// 				(c) => c != cardIndex,
// 			);
// 			if (typeof oldCardIndex == "undefined") {
// 				throw new Error("couldnt find alternate card for player");
// 			}
// 			newState[`${currentPlayer}Cards`] = [
// 				oldCardIndex,
// 				prevState[`${currentPlayer}NextCard`] as number,
// 			];
//
// 			return newState;
// 		});
// 		return true;
// 	}
// 	return playTurn;
// }

// function normalizePositions(
// 	currentPlayer: "player1" | "player2",
// 	positions: Position[],
// ) {
// 	if (currentPlayer == "player2") {
// 		return positions;
// 	}
// 	return inverseMovePositions(positions);
// }
