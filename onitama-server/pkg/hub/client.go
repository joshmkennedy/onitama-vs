package hub

import (
	"bytes"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
    CheckOrigin: func(r *http.Request) bool {
        return r.Header.Get("Origin") == getAllowedOrigin()
    },
}

func ServeWs(h *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

    gameKind := r.URL.Query().Get("kind")
    if gameKind == "" {
        gameKind = "multiplayer"
    }

    gameId := r.URL.Query().Get("gameId")
    if gameId == "" {
        gameId,err = h.newGame(gameKind)
        if err != nil {
            log.Println("No Game Id given attempted to create new game but got error\n",err)
        }
    }

	client := &Client{
		conn:   conn,
		hub:    h,
		send:   make(chan []byte),
		gameId: gameId,
        gameKind: gameKind,
	}

	h.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}

type Client struct {
	hub *Hub

	// the websocket connection
	conn *websocket.Conn

	// Buffered Channel of outbound messages
	send chan []byte

	gameId string

    PlayerId uint8

    gameKind string
}

// When a user makes a move or communicates 
// to the server in some way
func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, contents, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		contents = bytes.TrimSpace(bytes.ReplaceAll(contents, newline, space))

		c.hub.broadcast <- &Message{
            From: c.PlayerId,
			GameId:   c.gameId,
			Contents: contents,
		}
	}
}

// Sends the message to the user
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)

	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// hub closed connection
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-c.send)
			}
			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}


func getAllowedOrigin() string {
    possibleOrigin := os.Getenv("FRONTEND_URL")
    if possibleOrigin == "" {
        // I dont care to set envs in dev 
        return "http://localhost:3000"
    }
    return possibleOrigin
}
