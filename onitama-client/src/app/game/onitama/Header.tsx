import { useAtom } from "jotai";
import { gameStateStore } from "./state";

export default function Header({ showHelp }: { showHelp: () => void }) {
  const [gameState] = useAtom(gameStateStore);
  const currentPlayer = gameState.currentPlayer;
  return (
    <header className="app-header">
      <div>Player {currentPlayer}'s Turn</div>
      <button onClick={showHelp}>?</button>
    </header>
  );
}
