package game


func inverseMovePositions(positions []Position) []Position {
    inversedPositions := make([]Position, len(positions))
    for i, pos := range positions {
        inversedPositions[i] = Position{X: pos.X * -1, Y: pos.Y * -1}
    }
    return inversedPositions
}

