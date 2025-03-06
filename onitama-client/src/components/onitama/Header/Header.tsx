import { useAtom } from "jotai";
import { gameStateStore, playerInfoStore } from "../state";
import styles from "./Header.module.css";
import Menu from "../Menu/Menu";

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
    <header className={styles.appHeader}>
      {winner > 0 ? (
        <button onClick={newGame}>New Game</button>
      ) : (
        <>
          <div className={styles.whosTurn}>
            {isPlayerTurn ? "Your turn" : "Waiting for other player"}
          </div>
					<Menu newGame={newGame} showHelp={showHelp} />
        </>
      )}
    </header>
  );
}
