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

  const isPlayerTurn = currentPlayer === thisPlayer;

  return (
    <header className="app-header">
      {winner > 0 ? (
        <>
          <button onClick={newGame}>New Game</button>
        </>
      ) : (
        <>
          <div className="whos-turn">
            {isPlayerTurn ? "Your turn" : "Waiting for other player"}
          </div>
          <button className="show-help" onClick={showHelp}>?</button>
        </>
      )}
    </header>
  );
}
