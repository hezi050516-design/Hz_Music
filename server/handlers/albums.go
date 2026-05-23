package handlers

import (
	"hz-music/server/db"
	"hz-music/server/models"
	"net/http"
)

func ListAlbums(w http.ResponseWriter, r *http.Request) {
	albumMap := make(map[string]models.Album)
	for _, s := range db.GetSongs() {
		if s.Album == "" {
			continue
		}
		if _, exists := albumMap[s.Album]; !exists {
			albumMap[s.Album] = models.Album{
				Name:      s.Album,
				Artist:    s.Artist,
				CoverPath: s.CoverPath,
			}
		}
	}

	albums := make([]models.Album, 0, len(albumMap))
	for _, a := range albumMap {
		albums = append(albums, a)
	}
	jsonResponse(w, albums)
}

func GetAlbumSongs(w http.ResponseWriter, r *http.Request) {
	albumName := r.URL.Query().Get("name")
	if albumName == "" {
		jsonResponse(w, []models.Song{})
		return
	}

	var songs []models.Song
	for _, s := range db.GetSongs() {
		if s.Album == albumName {
			songs = append(songs, s)
		}
	}
	if songs == nil {
		songs = []models.Song{}
	}
	jsonResponse(w, songs)
}
