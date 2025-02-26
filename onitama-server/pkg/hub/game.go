package hub

import (
	"encoding/json"
	"onitama-server/pkg/game"
)

type Game struct {
	Id      string
	Clients map[*Client]bool
	State   *game.GameState
}

func (g *Game) HandleMessage(message *Message) (uint8, []byte, error) {
	var decodedMsg GameMessage
	err := json.Unmarshal(message.Contents, &decodedMsg)
	if err != nil {
		return 0, []byte{}, err
	}

	if len(g.Clients) < 2 {
		return message.From, sendMessage("Waiting for other player to join"), nil
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
	jsonState, err := json.Marshal(GameMessage{Payload: state, MsgType: "gameState"})
	if err != nil {
		return []byte{}
	}
	return jsonState
}

type WelcomePayload struct {
	PlayerId uint8  `json:"playerId"`
	GameId   string `json:"gameId"`
}

func sendWelcomeMessage(playerId uint8, gameId string) []byte {
	jsonMsg, err := json.Marshal(GameMessage{Payload: WelcomePayload{
		PlayerId: playerId,
		GameId:   gameId,
	}, MsgType: "welcome"})
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
