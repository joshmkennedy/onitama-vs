import { useAtom } from "jotai";
import * as React from "react";
import CardDisplay from "./CardDisplay";
import { gameStateStore } from "./state";

export default function NextCard({ player }: { player: 1 | 2 }) {
  const [gameState] = useAtom(gameStateStore);
  const nextCardIndex = gameState[playerNexCardKey(player)];
  if (nextCardIndex == null) return null;
  const card = gameState.Cards[nextCardIndex];
  const side = player == 1 ? "left-next" : "right-next";
  return (
    <div className={`${side} next-card`}>
      <p className="next-card-label">Next</p>
      <CardDisplay classes={``} owner={player} card={card} />
    </div>
  );
}

export function playerNexCardKey(player: 1 | 2) {
  return `player${player}NextCard` as "player1NextCard" | "player2NextCard";
}
