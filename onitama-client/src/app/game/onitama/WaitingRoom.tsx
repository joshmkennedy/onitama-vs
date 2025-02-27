"use client"
import { CopyText } from "./CopyText";

export function WaitingRoom({ playerId }: { playerId: number }) {
	const URL = typeof window != "undefined" && window.location.href;
  return (
    <div className="waiting-room">
      <h1>Waiting For the other player</h1>
      <p>You are player {playerId}</p>
      <CopyText value={URL || ""} />
    </div>
  );
}
