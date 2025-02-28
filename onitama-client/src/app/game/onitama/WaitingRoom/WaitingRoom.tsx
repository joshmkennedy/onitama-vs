"use client"
import { CopyText } from "../CopyText/CopyText";
import styles from "./WaitingRoom.module.css";

export function WaitingRoom({ playerId }: { playerId: number }) {
	const URL = typeof window != "undefined" && window.location.href;
  return (
    <div className={styles.waitingRoom}>
			<p>You are player {playerId}</p>
      <h1>Waiting For the other player</h1>
      <p>Send them the url if you haven{'\''}t </p>
      <CopyText value={URL || ""} />
    </div>
  );
}
