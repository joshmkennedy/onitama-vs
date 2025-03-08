import { useAtom } from "jotai";
import { isCenter, isPossibleMove } from "../utils";
import { playerInfoStore } from "../state";
import type { Card } from "../types";
import { buildGrid } from "../Board/Board";
import styles from "./CardDisplay.module.css";

const cardGrid = buildGrid(5);
export default function CardDisplay({
  classes,
  owner,
  handleClick,
  card,
}: {
  classes: string;
  owner?: 1 | 2;
  handleClick?: () => void;
  card?: Card;
}) {
  const [playerInfo] = useAtom(playerInfoStore);
  if (!card) return null;
  const playersCard = playerInfo?.playerId === owner;
  return (
    <div
      className={`${styles.card} ${classes} ${playersCard ? styles.playersCard : styles.opponentsCard}`}
      onClick={handleClick}
    >
      <h3>{card.name}</h3>
      <div className={ styles.cardGrid }>
        {cardGrid.map((row, y) => {
          return row.map((_, x) => {
            return (
              <div
                onClick={handleClick}
                key={`${x},${y}`}
                className={`
									${styles.movePosition}
              ${isCenter(5, { x, y }) ? styles.me: ""}
              ${isPossibleMove(card.positions, { x, y }, playersCard ? 2:1) ? styles.possibleMove : ""}
            `}
              ></div>
            );
          });
        })}
      </div>
    </div>
  );
}
