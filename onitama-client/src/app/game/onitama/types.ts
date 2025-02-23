
export type Position = { x: number, y: number }

export type Card = {
  name: string,
  positions: Position[]
}

export type Unit = {
  type: "pawn" | "captain"
  position: Position
  owner: 1 | 2,
  id: number,
}

export type GameState = {
  currentPlayer: 1 | 2,
  Cards: Card[]
  player1Cards: number[]
  player2Cards: number[],
  player1NextCard: number | null,
  player2NextCard?: number | null,
  player1Units: Unit[],
  player2Units: Unit[],
}
