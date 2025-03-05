import * as React from "react";
import { useAtom } from "jotai";
import type { Position, Unit } from "../types";
import {
  gameStateStore,
  selectedCardStore,
  selectedPosStore,
  selectedUnitStore,
} from "../state";
import { inverseMovePositions, onBoard } from "../utils";

import styles from "./Board.module.css";

import { Tile } from "../Tile/Tile";
import { PlayerCards } from "../PlayerCards/PlayerCards";
import NextCard from "../NextCard/NextCard";

import DebugComponent from "../debug/debug.tsx";


const boardGrid = buildGrid(5);

export default function Board({
  playTurn,
}: {
  playTurn: (
    selectedPos: Position,
    selectedCard: number,
    selectedUnit: number,
  ) => void;
}) {
  const [gameState] = useAtom(gameStateStore);
  const [selectedUnit, setSelectedUnit] = useAtom(selectedUnitStore);
  const [selectedPos, setSelectedPos] = useAtom(selectedPosStore);
  const [selectedCard, setSelectedCard] = useAtom(selectedCardStore);

  if (selectedCard == null && selectedPos != null) {
    setSelectedPos(null);
  }

  const movePosHints = React.useMemo(() => {
    if (!gameState) return [];
    if (selectedCard == null || selectedUnit == null) return [];
    const card = gameState.cards[selectedCard];
    const player = gameState?.currentPlayer;
    const possiblePosisitons =
      player == 2 ? card.positions : inverseMovePositions(card.positions);
    const relativePositions = possiblePosisitons
      .map((pos: Position) => {
        return {
          x: selectedUnit.position.x + pos.x,
          y: selectedUnit.position.y + pos.y,
        };
      })
      .filter(onBoard);
    return relativePositions;
  }, [selectedCard, selectedUnit, gameState]);

  const chooseTile = React.useCallback(
    function chooseTile(unit: Unit | null, position: Position) {
      if (!gameState) return;

      if (
        unit?.position.x == selectedUnit?.position.x &&
        selectedUnit?.position.y == unit?.position.y
      ) {
        console.log("bailing");
        setSelectedUnit(null);
        setSelectedPos(null);
        return;
      }
      if (unit && unit.owner == gameState.currentPlayer) {
        setSelectedUnit(unit);
        return;
      }

      // if we get here and we dont have a selected card
      // we gotta bail
      if (selectedCard == null) return;

      if (
        selectedPos &&
        selectedPos.x == position.x &&
        selectedPos.y == position.y
      ) {
        setSelectedPos(null);
        return;
      }

      if (selectedUnit && unit?.owner != gameState?.currentPlayer) {
        if (
          movePosHints.some(
            (hint) => hint.x == position.x && hint.y == position.y,
          )
        ) {
          setSelectedPos(position);
        }
      }
    },
    [
      selectedCard,
      selectedUnit,
      selectedPos,
      gameState,
      movePosHints,
      setSelectedPos,
      setSelectedUnit,
    ],
  );

  const handlePlayTurn = React.useCallback(() => {
    if (selectedUnit == null || selectedCard == null || selectedPos == null) {
      // all of these are required so if we don't got'em we can't procede
      return;
    }
    playTurn(selectedPos, selectedCard, selectedUnit.id);
    setSelectedCard(null);
    setSelectedPos(null);
    setSelectedUnit(null);
  }, [
    selectedUnit,
    selectedPos,
    selectedCard,
    playTurn,
    setSelectedUnit,
    setSelectedPos,
    setSelectedCard,
  ]);

  if (!gameState?.player1Units || !gameState?.player2Units) {
    return null;
  }

  return (
    <div className={styles.boardWrapper}>
				 {process.env.NODE_ENV === "development" && <DebugComponent />}

      <PlayerCards
        player={1}
        selected={selectedCard}
        setSelected={setSelectedCard}
      />
      <div className={styles.board}>
        {boardGrid.map((row, y: number) => {
          return row.map((_col, x: number) => {
            const owner = findOwner(
              { x, y },
              gameState.player1Units,
              gameState.player2Units,
            );
            return (
              <Tile
								x={x}
								y={y}
                isSelectedPos={selectedPos?.x == x && selectedPos?.y == y}
                isSelectedUnit={
                  selectedUnit?.position.x == x && selectedUnit?.position.y == y
                }
                onClick={() => chooseTile(owner, { x, y })}
                key={`${x}, ${y} `}
                owner={owner}
                isMoveHint={isMoveHint({ x, y }, movePosHints)}
                handlePlayTurn={handlePlayTurn}
              />
            );
          });
        })}
      </div>
      <NextCard player={1} />
      <NextCard player={2} />
      <PlayerCards
        player={2}
        selected={selectedCard}
        setSelected={setSelectedCard}
      />
    </div>
  );
}

function findOwner(
  position: Position,
  player1Units: Unit[],
  player2Units: Unit[],
) {
  if (!player1Units.length || !player2Units.length) return null;
  for (const unit of player1Units) {
    if (
      unit.position.x == position.x &&
      unit.position.y == position.y &&
      unit.isAlive
    ) {
      return unit;
    }
  }

  for (const unit of player2Units) {
    if (
      unit.position.x == position.x &&
      unit.position.y == position.y &&
      unit.isAlive
    ) {
      return unit;
    }
  }

  return null;
}

function isMoveHint({ x, y }: Position, possiblePosisitons: Position[]) {
  const res = possiblePosisitons.some(({ x: xpos, y: ypos }) => {
    const res = xpos == x && ypos == y;
    return res;
  });
  // console.log(res)
  return res;
}

export function buildGrid(count: number) {
  const grid: number[][] = [];
  for (let y = 0; y < count; y++) {
    grid.push([]);
    for (let x = 0; x < count; x++) {
      grid[y].push(0);
    }
  }
  return grid;
}
