import { useAtom } from "jotai";
import { gameStateStore, playerInfoStore } from "./state";
import { useMemo } from "react";

export default function Header({
	showHelp,
	newGame,
	winner,
}: {
	showHelp: () => void;
	winner: 1 | 2 | 0;
	newGame: () => void;
}) {
	const [gameState] = useAtom(gameStateStore);
	const [playerInfo] = useAtom(playerInfoStore);
	const currentPlayer = gameState?.currentPlayer;
	const thisPlayer = playerInfo?.playerId ?? 0;
	const winnerMessage = useMemo(() => {
		if (winner === thisPlayer) {
			return "Congrats!! you won!";
		}
		return `Oooh, soo sorry. Player ${winner} won 🙁`;
	}, [winner, thisPlayer]);

	return (
		<header className="app-header">
			{winner > 0 ? (
				<>
					<div>{winnerMessage}</div>
					<button onClick={newGame}>New Game</button>
				</>
			) : (
				<>
					<div>Player {currentPlayer}'s Turn</div>
					<button onClick={showHelp}>?</button>
				</>
			)}
		</header>
	);
}
