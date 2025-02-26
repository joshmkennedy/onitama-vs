import { GameState, Position, Unit } from "./types";
import { inverseMovePositions } from "./utils";
import cardlist from "./cards";
import { atom, useAtom } from "jotai";

function getRandomCards() {
	if (typeof window === 'undefined') return
	const cards = cardlist.sort(() => Math.floor(Math.random() - 0.5));
	cards.length = 5;
	return cards;
}

function getInitialState(): GameState {
	return {
		currentPlayer: 1,
		cards: getRandomCards() ?? [],
		player1Cards: [0, 1],
		player1NextCard: 2,
		player2NextCard: null,
		player2Cards: [3, 4],
		player1Units: [
			{ id: 1, type: "pawn", position: { x: 0, y: 0 }, owner: 1 },
			{ id: 2, type: "pawn", position: { x: 1, y: 0 }, owner: 1 },
			{ id: 3, type: "captain", position: { x: 2, y: 0 }, owner: 1 },
			{ id: 4, type: "pawn", position: { x: 3, y: 0 }, owner: 1 },
			{ id: 5, type: "pawn", position: { x: 4, y: 0 }, owner: 1 },
		],
		player2Units: [
			{ id: 6, type: "pawn", position: { x: 0, y: 4 }, owner: 2 },
			{ id: 7, type: "pawn", position: { x: 1, y: 4 }, owner: 2 },
			{ id: 8, type: "captain", position: { x: 2, y: 4 }, owner: 2 },
			{ id: 9, type: "pawn", position: { x: 3, y: 4 }, owner: 2 },
			{ id: 10, type: "pawn", position: { x: 4, y: 4 }, owner: 2 },
		],
	};
}

export const selectedCardStore = atom<null | number>(null);
export const selectedPosStore = atom<null | Position>(null);
export const selectedUnitStore = atom<null | Unit>(null);

const initialState = getInitialState();
export const gameStateStore = atom<GameState | undefined>(undefined);

export const playerInfoStore = atom<{ gameId: string, playerId: number } | undefined>(undefined)

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

function normalizePositions(
	currentPlayer: "player1" | "player2",
	positions: Position[],
) {
	if (currentPlayer == "player2") {
		return positions;
	}
	return inverseMovePositions(positions);
}

const playerOneBase = { x: 2, y: 0 };
const playerTwoBase = { x: 2, y: 4 };
function isOpponentsBase(position: Position, currentPlayer: 1 | 2) {
	const opponentBase = currentPlayer == 1 ? playerTwoBase : playerOneBase;
	return position.x == opponentBase.x && opponentBase.y == position.y;
}
