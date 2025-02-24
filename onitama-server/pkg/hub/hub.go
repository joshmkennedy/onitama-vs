package hub

import (
	"encoding/json"
	"log"
	"net/http"
	"onitama-server/pkg/utils"
)

func NewHub() *Hub {
	return &Hub{

		broadcast: make(chan *Message),

		register: make(chan *Client),

		unregister: make(chan *Client),

		games: make(map[string]*Game),
	}
}

type Message struct {
	GameId   string
	Contents []byte
}

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// inbound messages from clients
	broadcast chan *Message

	// register requests from clients
	register chan *Client

	// unregister requests from clients
	unregister chan *Client

	games map[string]*Game
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.JoinGame(client, client.gameId)

		case client := <-h.unregister:
			if _, ok := h.games[client.gameId].Clients[client]; ok {
				delete(h.games[client.gameId].Clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			if game, ok := h.games[message.GameId]; ok {
				for client := range game.Clients {
					select {
					case client.send <- message.Contents:
					default:
						close(client.send)
						delete(game.Clients, client)
					}
				}
			}
		}
	}
}

type RegisterResponse struct {
	GameId string `json:"gameId"`
}

// TODO: Maybe this shouldnt be on Hub but on something like App{} that contains a hub.
func (h *Hub) RegisterGame(w http.ResponseWriter, r *http.Request) {
	// Ensure the request method is POST
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	gameId, err := h.newGame()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	// Respond with game ID
	resp := RegisterResponse{GameId: gameId}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *Hub) newGame() (string, error) {
	newGameId := utils.GenerateGameID()


	h.games[newGameId] = &Game{
		Id:      newGameId,
		Clients: make(map[*Client]bool),
	}
	log.Println("Created new game: ", newGameId)
	return newGameId, nil
}

func (h *Hub) JoinGame(client *Client, gameId string) {
	// Possibly remove client from previous game
	if client.gameId != "" && client.gameId != gameId {
        log.Println("Uh OH")
		h.LeaveGame(client, client.gameId)
	}

	if _, ok := h.games[gameId]; !ok {
		gid, err := h.newGame()
		if err != nil {
			log.Println("Couldnt Create new Game from Join Game")
			return
		}

		gameId = gid
		// if we do this we need to
		// send a message to client to let them know
		// to update their url and
        client.send <- []byte("UPDATE GAMEID: " + gid)
	}


	if len(h.games[gameId].Clients) >= 2 {
		gid, err := h.newGame()
		if err != nil {
			log.Println("Couldnt Create new Game from Join Game")
			return
		}
		gameId = gid
		// we need to send a message to 
        // client to let them know
		// to update their url and
        client.send <- []byte("UPDATE GAMEID: " + gid)
	}


	// Add client to the game
    client.gameId = gameId
	h.games[client.gameId].Clients[client] = true
    client.send <- []byte("You have joined " + client.gameId)
	log.Println("Joined game: ", client.gameId)
}

func (h *Hub) LeaveGame(client *Client, gameId string) {
	if game, ok := h.games[gameId]; ok {
		delete(game.Clients, client)
		if len(game.Clients) == 0 {
			delete(h.games, gameId) // Remove empty game
		}

		client.gameId = ""
		log.Println("Left game: ", gameId)
	}
}
