import { useAtom } from "jotai";
import { gameStateStore, playerInfoStore } from "./state";
import { useMemo } from "react";

export default function Header({
  showHelp,
}: {
  showHelp: () => void;
}) {
  const [gameState] = useAtom(gameStateStore);
  const [playerInfo] = useAtom(playerInfoStore);
  const currentPlayer = gameState?.currentPlayer;
  const thisPlayer = playerInfo?.playerId ?? 0;

  const isPlayerTurn = currentPlayer === thisPlayer;

  return (
    <header className="app-header">
      <div className="whos-turn">
        {isPlayerTurn ? "Your turn" : "Waiting for other player"}
      </div>
      <button onClick={showHelp}>?</button>
    </header>
  );
}
