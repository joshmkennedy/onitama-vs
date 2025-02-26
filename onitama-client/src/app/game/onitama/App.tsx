"use client";

import { useCallback, useState } from "react";
import "./App.css";
import Board from "./Board";
import Header from "./Header";
import Help from "./Help";
import { useWS } from "./ws";
import { Position } from "./types";
import { gameStateStore, playerInfoStore } from "./state";
import { useAtom } from "jotai";

function App() {
	const [isHelpShowing, setIsHelpShowing] = useState(!true);
	const [winner, setWinner] = useState<1 | 2 | 0>(0);
	function showWinner(winner: 1 | 2 | 0) {
		setWinner(winner);
	}

	const [gameState, setGameState] = useAtom(gameStateStore);
	const [playerInfo, setPlayerInfo] = useAtom<
		| {
			playerId: number;
			gameId: string;
		}
		| undefined
	>(playerInfoStore);

	const messageHandler = useCallback(
		(message: any) => {
			const data = JSON.parse(message.data);

			if (data.type == "gameState") {
				setGameState(data.payload);
			}
			if (data.type == "newGame") {
				setWinner(0);
				setGameState(data.payload);
			}

			if (data.type == "endGame") {
				setGameState(data.payload.finalGameState);
				setTimeout(() => showWinner(data.payload.winner));
			}

			if (data.type == "welcome") {
				setPlayerInfo(data.payload);
				updateGameIdParam(data.payload.gameId);
			}

			if (data.type == "message") {
				console.log(data.payload);
			}
		},
		[setGameState, setWinner],
	);
	const ws = useWS(messageHandler);

	function playTurn(
		selectedPos: Position,
		selectedCard: number,
		selectedUnit: number,
	) {
		ws.send(
			JSON.stringify({
				type: "playTurn",
				payload: { selectedCard, selectedPosition: selectedPos, selectedUnit },
			}),
		);
	}
	function resetGame() {
		ws.send(
			JSON.stringify({
				type: "newGame",
				payload: {},
			}),
		);
	}

	return (
		<>
			{isHelpShowing ? (
				<Help close={() => setIsHelpShowing(false)} />
			) : (
				<>
					{playerInfo ? (
						<span>You are player {playerInfo.playerId}</span>
					) : null}
				</>
			)}
			<div className="App">
				<Header
					winner={winner}
					newGame={resetGame}
					showHelp={() => setIsHelpShowing(true)}
				/>
				<Board gameState={gameState} playTurn={playTurn} />
			</div>
		</>
	);
}

function updateGameIdParam(id: string) {
	const url = new URL(window.location.href);
	url.searchParams.set("gameId", id);
	window.history.replaceState(null, "", url.toString());
}

export default App;
