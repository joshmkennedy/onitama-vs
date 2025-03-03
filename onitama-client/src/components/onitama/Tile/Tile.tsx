import type { Unit } from "../types";
import { Player1CaptainUnit } from "../units/Player1Captain";
import { Player1PawnUnit } from "../units/Player1Pawn";
import { Player2CaptainUnit } from "../units/Player2Captain";
import { Player2PawnUnit } from "../units/Player2Pawn";

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
	{
		/*<img
					alt={`Player ${owner.owner}\'s ${owner.type}`}
					className={styles.unitimage}
					src={`/Player${owner.owner}-${owner.type}.png`}
				/>*/
	}

	return (
		<div
			onClick={onClick}
			className={`${styles.tile} ${owner ? styles[`type${owner.type}`] : ""} ${isSelectedUnit ? styles.selectedUnit : ""} ${isSelectedPos ? styles.selectedPos : ""} ${isMoveHint ? styles.moveHint : ""}`.trim()}
		>
			{owner ? <Unit unit={owner} /> : null}

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

function Unit({ unit }: { unit: Unit }) {
	if (unit.type === "captain" && unit.owner === 1) {
		return <Player1CaptainUnit />;
	}
	if (unit.type === "pawn" && unit.owner === 1) {
		return <Player1PawnUnit />;
	}
	if (unit.type === "pawn" && unit.owner === 2) {
		return <Player2PawnUnit />;
	}
	if (unit.type === "captain" && unit.owner === 2) {
		return <Player2CaptainUnit />;
	}
	return null
}
