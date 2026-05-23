package handlers

import (
	"hz-music/server/db"
	"hz-music/server/models"
	"net/http"
)

func ListArtists(w http.ResponseWriter, r *http.Request) {
	artistMap := make(map[string]models.Artist)
	for _, s := range db.GetSongs() {
		if s.Artist == "" {
			continue
		}
		if _, exists := artistMap[s.Artist]; !exists {
			artistMap[s.Artist] = models.Artist{Name: s.Artist}
		}
	}

	artists := make([]models.Artist, 0, len(artistMap))
	for _, a := range artistMap {
		artists = append(artists, a)
	}
	jsonResponse(w, artists)
}

func GetArtistSongs(w http.ResponseWriter, r *http.Request) {
	artistName := r.URL.Query().Get("name")
	if artistName == "" {
		jsonResponse(w, []models.Song{})
		return
	}

	var songs []models.Song
	for _, s := range db.GetSongs() {
		if s.Artist == artistName {
			songs = append(songs, s)
		}
	}
	if songs == nil {
		songs = []models.Song{}
	}
	jsonResponse(w, songs)
}
