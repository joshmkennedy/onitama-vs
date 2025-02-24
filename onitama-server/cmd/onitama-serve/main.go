package main

import (
	"flag"
	"log"
	"net/http"
	"onitama-server/pkg/hub"
)

var addr = flag.String("addr", ":8080", "http service address")

func serveHome(w http.ResponseWriter, r *http.Request) {
	log.Println(r.URL)
	if r.URL.Path != "/" {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	http.ServeFile(w, r, "index.html")
}

func main() {
	flag.Parse()
	h := hub.NewHub()
	go h.Run()
    http.HandleFunc("/", serveHome)
    http.HandleFunc("/register", h.RegisterGame)
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
        log.Println("connecting...")
		hub.ServeWs(h, w, r)
	})
    err:=http.ListenAndServe(*addr, nil); if err != nil {
        log.Fatal("ListenAndServe: ",err)
    }
}
