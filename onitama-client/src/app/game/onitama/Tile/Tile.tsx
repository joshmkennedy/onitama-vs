import type { Unit } from "../types";

import styles from "./Tile.module.css";
export function Tile({
  isMoveHint,
  onClick,
  handlePlayTurn,
  owner,
  isSelectedPos,
  isSelectedUnit,
}: {
  handlePlayTurn: () => void;
  isMoveHint: boolean;
  onClick: () => void;
  owner: null | Unit;
  isSelectedPos: boolean;
  isSelectedUnit: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`${owner ? styles[`type${owner.type}`] : ""} ${isSelectedUnit ? styles.selectedUnit : ""} ${isSelectedPos ? styles.selectedPos : ""} ${isMoveHint ? styles.moveHint : ""}`.trim()}
    >
      {owner ? (
        <img
          alt={`Player ${owner.owner}\'s ${owner.type}`}
          className={styles.unitimage}
          src={`/Player${owner.owner}-${owner.type}.png`}
        />
      ) : null}
      {isSelectedPos ? (
        <button
          className={styles.confirmButton}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePlayTurn();
          }}
        >
          Confirm
        </button>
      ) : null}
    </div>
  );
}
