package hub

import (
	"encoding/json"
	"log"
	"onitama-server/pkg/game"
	"time"
)

type Game struct {
	Id       string
	Clients  map[*Client]bool
	State    *game.GameState
	GameKind string
	hub      *Hub
}

func (g *Game) HandleMessage(message *Message) (uint8, []byte, error) {
	var decodedMsg GameMessage
	err := json.Unmarshal(message.Contents, &decodedMsg)
	if err != nil {
		return 0, []byte{}, err
	}

	if len(g.Clients) < 2 && g.GameKind != "singleplayer" {
        return 0, sendGameInfoUpdateMessage(g.Id, len(g.Clients), g.GameKind), nil
    }

	// MAIN GAME LOGIC HAPPENS IN HERE 👇
	result := g.State.HandleEvent(message.From, decodedMsg.MsgType, decodedMsg.Payload)

	if result == game.NEW_GAME {
		g.State = game.NewGameState()
		g.State.Status = game.STATUS_PLAYING
		return 0, sendNewGameState(g.State), nil
	}
	if result == game.WON_STATE_REACHED {
		g.State.Status = game.STATUS_WON
		return 0, sendEndGameMessage(g.State), nil
	}
	if result == game.INVALID_UNIT {
		return g.State.CurrentPlayer, sendMessage("Invalid Unit"), nil
	}
	if result == game.INVALID_CARD {
		return g.State.CurrentPlayer, sendMessage("Invalid Card"), nil
	}
	if result == game.INVALID_POSITION {
		return g.State.CurrentPlayer, sendMessage("Invalid Position"), nil
	}
	if result == game.WRONG_PLAYER {
		return g.State.CurrentPlayer, sendMessage("Not your turn BRUH"), nil
	}

	return 0, sendGameState(g.State), nil
}

type GameMessage struct {
	Payload interface{} `json:"payload"`
	MsgType string      `json:"type"`
}

func sendMessage(msg string) []byte {
	jsonMsg, err := json.Marshal(GameMessage{Payload: msg, MsgType: "message"})
	if err != nil {
		return []byte{}
	}
	return jsonMsg
}

func sendGameState(state *game.GameState) []byte {
    log.Println("Sending Game State")
	jsonState, err := json.Marshal(GameMessage{Payload: state, MsgType: "gameState"})
	if err != nil {
		return []byte{}
	}
	return jsonState
}

type GameInfo struct {
	GameId      string `json:"gameId"`
	PlayerCount int    `json:"playerCount"`
	GameKind    string `json:"gameKind"`
}
type PlayerInfo struct {
	PlayerId uint8 `json:"playerId"`
}

type WelcomePayload struct {
	PlayerInfo `json:"playerInfo"`
	GameInfo   `json:"gameInfo"`
}

func sendWelcomeMessage(playerId uint8, gameId string, playerCount int, gameKind string) []byte {
	jsonMsg, err := json.Marshal(GameMessage{Payload: WelcomePayload{
		PlayerInfo: PlayerInfo{
			PlayerId: playerId,
		},
		GameInfo: GameInfo{
			GameId:      gameId,
			GameKind:    gameKind,
			PlayerCount: playerCount,
		},
	}, MsgType: "welcome"})
	if err != nil {
		return []byte{}
	}
	return jsonMsg
}

func sendGameInfoUpdateMessage(gameId string, playerCount int, gameKind string) []byte {
	jsonMsg, err := json.Marshal(GameMessage{
		Payload: GameInfo{
			GameId:      gameId,
			PlayerCount: playerCount,
			GameKind:    gameKind,
		},
		MsgType: "gameInfoUpdate",
	})
	if err != nil {
		return []byte{}
	}
	return jsonMsg
}

type EndGamePayload struct {
	Winner         uint8           `json:"winner"`
	FinalGameState *game.GameState `json:"finalGameState"`
}

func sendEndGameMessage(state *game.GameState) []byte {
	jsonMsg, err := json.Marshal(GameMessage{
		Payload: EndGamePayload{Winner: state.CurrentPlayer, FinalGameState: state},
		MsgType: "endGame",
	})
	if err != nil {
		return []byte{}
	}
	return jsonMsg
}

func sendNewGameState(state *game.GameState) []byte {
	jsonMsg, err := json.Marshal(GameMessage{
		Payload: state,
		MsgType: "newGame",
	})
	if err != nil {
		return []byte{}
	}
	return jsonMsg
}

// Is the Ai player for singleplayer games
func (g *Game) AIRecieve(msg []byte) {
	time.Sleep(time.Second * 1)
	reply, err := g.AIHandleMessage(msg)
	if err != nil {
		log.Println("Error handling message in the Ai recieve")
		return
	}

	// we just going to short circut the hub here and broad cast the message directly to the client
	for client := range g.Clients {
		select {
		case client.send <- reply:
            log.Println("AiPlayer sent a message")
		default:
			close(client.send)
			delete(g.Clients, client)
		}
	}
}

func (g *Game) AIHandleMessage(msg []byte) ([]byte, error) {
	var decodedMsg GameMessage
	err := json.Unmarshal(msg, &decodedMsg)
	if err != nil {
		return []byte{}, err
	}

    // DO WE NEED DIS
	if len(g.Clients) < 2 && g.GameKind != "singleplayer" {
		return sendGameInfoUpdateMessage(g.Id, len(g.Clients), g.GameKind), nil
	}

    // If they played their turn we can reply with our AITurn 
    // we dont really need the payload I dont think
	result := g.State.AiPlayer(decodedMsg.MsgType, decodedMsg.Payload)

    // RESULT REALLY CAN ONLY BE WON_STATE_REACHED or SUCCESS
    if result != game.SUCCESS && result != game.WON_STATE_REACHED {
        log.Println("AiPlayer returned an error", result)
    }

	if result == game.WON_STATE_REACHED {
		g.State.Status = game.STATUS_WON
		return sendEndGameMessage(g.State), nil
	}
    
	return sendGameState(g.State), nil
}
