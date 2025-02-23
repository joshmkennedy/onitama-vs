import type { Unit } from "./types";
export function Tile({
  classes,
  onClick,
  handlePlayTurn,
  owner,
  isSelectedPos,
  isSelectedUnit,
}: {
  handlePlayTurn: () => void;
  classes: string;
  onClick: () => void;
  owner: null | Unit;
  isSelectedPos: boolean;
  isSelectedUnit: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`${owner ? `player-${owner.owner}` : ""} ${
        owner ? `type-${owner.type}` : ""
      } ${isSelectedUnit ? "selected-unit" : ""} ${
        isSelectedPos ? "selected-pos" : ""
      } ${classes}`.trim()}
    >
      {owner ? (
        <img
          className="unit-image"
          src={`/Player${owner.owner}-${owner.type}.png`}
        />
      ) : null}
      {isSelectedPos ? (
        <button
          className="tile__confirm-button"
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
