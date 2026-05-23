package main

import (
	"log"
	"net/http"
	"os"

	"hz-music/server/db"
	"hz-music/server/scanner"
)

var (
	musicDir  = "music"
	coverDir  = "covers"
	dbPath    = "music.json"
)

func main() {
	if err := os.MkdirAll(musicDir, 0755); err != nil {
		log.Fatal(err)
	}
	if err := os.MkdirAll(coverDir, 0755); err != nil {
		log.Fatal(err)
	}

	if err := db.Init(dbPath); err != nil {
		log.Fatal(err)
	}

	if n, err := scanner.ScanMusicDir(musicDir); err != nil {
		log.Printf("Error scanning music directory: %v", err)
	} else {
		log.Printf("Added %d new songs", n)
	}

	mux := http.NewServeMux()
	addr := ":8080"
	log.Printf("Server starting on %s", addr)
	log.Fatal(http.ListenAndServe(addr, withCORS(mux)))
}

func withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			return
		}
		next.ServeHTTP(w, r)
	})
}
