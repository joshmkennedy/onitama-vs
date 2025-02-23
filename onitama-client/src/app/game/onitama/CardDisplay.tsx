import { buildGrid } from "./Board";
import type { Card } from "./types";
import { isCenter, isPossibleMove } from "./utils";

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
  if (!card) return null;
  return (
    <div className={`card ${classes}`} onClick={handleClick}>
      <h3>{card.name}</h3>
      <div className="card-grid">
        {cardGrid.map((row, y) => {
          return row.map((_, x) => {
            return (
              <div
                onClick={handleClick}
                key={`${x},${y}`}
                className={`
              move-position 
              ${isCenter(5, { x, y }) ? "me" : ""}
              ${isPossibleMove(card.positions, { x, y }, owner) ? "possible-move" : ""}
            `}
              ></div>
            );
          });
        })}
      </div>
    </div>
  );
}
