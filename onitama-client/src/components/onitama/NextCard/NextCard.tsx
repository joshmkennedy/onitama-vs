import { useAtom } from "jotai";
import * as React from "react";
import { gameStateStore } from "../state";
import CardDisplay from "../CardDisplay/CardDisplay";
import styles from "./NextCard.module.css";

export default function NextCard({ player }: { player: 1 | 2 }) {
  const [gameState] = useAtom(gameStateStore);

	if (!gameState) return null;
  const nextCardIndex = gameState[playerNexCardKey(player)];
  if (nextCardIndex == null) return null;
  const card = gameState.cards[nextCardIndex];
  const side = player == 1 ? styles.leftNext : styles.rightNext;
  return (
    <div className={`${side} ${styles.nextCard}`}>
      <p className={ styles.nextCardLabel }>Next</p>
      <CardDisplay classes={``} owner={player} card={card} />
    </div>
  );
}

export function playerNexCardKey(player: 1 | 2) {
  return `player${player}NextCard` as "player1NextCard" | "player2NextCard";
}
