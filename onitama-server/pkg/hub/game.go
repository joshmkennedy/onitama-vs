package hub

type Game struct {
    Id string
    Clients map[*Client]bool
}
