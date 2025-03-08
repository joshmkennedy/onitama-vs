import { Position } from "./types";

export function inverseMovePositions(positions: Position[]) {
  return positions.map(({ x, y }) => {
    return { x: x * -1, y: y * -1 };
  });
}
export function isCenter(count: number, pos: Position) {
  if (count % 2 == 0) return false;
  const center = (count - 1) / 2;
  return pos.x == center && pos.y == center;
}
export function isPossibleMove(
  cardPosistions: Position[],
  { x, y }: Position,
  owner?: 1 | 2,
) {
  return cardPosistions.some(({ x: _xPos, y: _yPos }) => {
    const xPos = owner && owner == 1 ? _xPos * -1 : _xPos;
    const yPos = owner && owner == 1 ? _yPos * -1 : _yPos;
    return x == 2 + xPos && y == 2 + yPos; // this is confusing but trust me it works.
    //past me wicked smart
  });
}
export function onBoard(pos: Position): boolean {
  return pos.x >= 0 && pos.x < 5 && pos.y >= 0 && pos.y < 5;
}

export function playerCardsKey(player: 1 | 2) {
  return `player${player}Cards`;
}
