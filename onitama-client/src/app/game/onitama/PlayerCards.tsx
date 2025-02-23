import { SetStateAction, useAtom } from "jotai";
import CardDisplay from "./CardDisplay";
import { gameStateStore } from "./state";
import { Card } from "./types";
import { playerCardsKey } from "./utils";

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
  const { currentPlayer } = gameState;
  const cardIndexes: number[] =
    gameState[playerCardsKey(player) as "player1Cards" | "player2Cards"];
  const cards: [Card, number][] = cardIndexes.map((cardIndex) => {
    return [gameState.Cards[cardIndex], cardIndex];
  });
  return (
    <div className={`player-${player} player-cards`}>
      {cards.map((card) => (
        <CardDisplay
          key={card[1]}
          classes={selected == card[1] ? `selected-card` : ""}
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
