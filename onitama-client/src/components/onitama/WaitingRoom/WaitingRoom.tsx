import { CopyText } from "../CopyText/CopyText";
import Menu from "../Menu/Menu";
import styles from "./WaitingRoom.module.css";

export function WaitingRoom({ playerId, showHelp, newGame }: {
	playerId: number;
	showHelp: () => void;
	newGame: () => void;
}) {
	const URL = typeof window != "undefined" && window.location.href;
  return (
    <div className={styles.waitingRoom}>
			<Menu newGame={newGame} showHelp={showHelp} />
			<p>You are player {playerId}</p>
      <h1>Waiting For the other player</h1>
      <p>Send them the url if you haven{'\''}t </p>
      <CopyText value={URL || ""} />
    </div>
  );
}
