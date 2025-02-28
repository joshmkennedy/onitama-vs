import { SetStateAction, useAtom } from "jotai";
import { gameStateStore } from "../state";
import { playerCardsKey } from "../utils";
import { Card } from "../types";
import styles from "./PlayerCards.module.css";
import CardDisplay from "../CardDisplay/CardDisplay";

type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

export function PlayerCards({
	player,
	selected,
	setSelected,
}: {
	player: 1 | 2;
	selected: number | null;
	setSelected: SetAtom<[SetStateAction<number | null>], void>;
}) {
	const [gameState] = useAtom(gameStateStore);
	if (!gameState) return null;
	const currentPlayer = gameState.currentPlayer;
	const cardIndexes: number[] = gameState[playerCardsKey(player) as "player1Cards" | "player2Cards"];
	const cards: [Card, number][] = cardIndexes.map((cardIndex) => {
		return [gameState.cards[cardIndex], cardIndex];
	});
	return (
		<div className={`${styles[`player${player}`]} ${styles.playerCards}`}>
			{cards.map((card) => (
				<CardDisplay
					key={card[1]}
					classes={selected == card[1] ? styles.selectedCard : ""}
					handleClick={
						currentPlayer == player
							? () => {
								setSelected((prevSelected: number | null) => {
									if (prevSelected == card[1]) {
										return null;
									}
									return card[1];
								});
							}
							: undefined
					}
					owner={player}
					card={card[0]}
				/>
			))}
		</div>
	);
}
