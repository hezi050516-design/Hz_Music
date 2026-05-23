package handlers

import (
	"fmt"
	"hz-music/server/db"
	"hz-music/server/models"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
)

var mimeTypes = map[string]string{
	".mp3":  "audio/mpeg",
	".flac": "audio/flac",
	".wav":  "audio/wav",
	".m4a":  "audio/mp4",
	".ogg":  "audio/ogg",
	".wma":  "audio/x-ms-wma",
}

func ListSongs(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}
	if limit > 100 {
		limit = 100
	}

	songs := db.GetSongs()

	if q != "" {
		qLower := strings.ToLower(q)
		var filtered []models.Song
		for _, s := range songs {
			if strings.Contains(strings.ToLower(s.Title), qLower) ||
				strings.Contains(strings.ToLower(s.Artist), qLower) ||
				strings.Contains(strings.ToLower(s.Album), qLower) {
				filtered = append(filtered, s)
			}
		}
		songs = filtered
	}

	start := (page - 1) * limit
	if start >= len(songs) {
		songs = nil
	} else {
		end := start + limit
		if end > len(songs) {
			end = len(songs)
		}
		songs = songs[start:end]
	}

	if songs == nil {
		jsonResponse(w, []models.Song{})
		return
	}
	jsonResponse(w, songs)
}

func GetSong(w http.ResponseWriter, r *http.Request) {
	id := extractID(r.URL.Path, "/api/songs/")
	song, ok := db.GetSong(id)
	if !ok {
		jsonError(w, "song not found", http.StatusNotFound)
		return
	}
	jsonResponse(w, song)
}

func StreamSong(w http.ResponseWriter, r *http.Request) {
	id := extractID(r.URL.Path, "/api/songs/")
	song, ok := db.GetSong(id)
	if !ok {
		jsonError(w, "song not found", http.StatusNotFound)
		return
	}

	file, err := os.Open(song.FilePath)
	if err != nil {
		jsonError(w, "file not found", http.StatusNotFound)
		return
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		jsonError(w, "could not read file info", http.StatusInternalServerError)
		return
	}

	dot := strings.LastIndex(song.FilePath, ".")
	if dot < 0 {
		dot = len(song.FilePath)
	}
	ext := strings.ToLower(song.FilePath[dot:])
	mimeType := mimeTypes[ext]
	if mimeType == "" {
		mimeType = "application/octet-stream"
	}

	w.Header().Set("Accept-Ranges", "bytes")

	rangeHeader := r.Header.Get("Range")
	if rangeHeader == "" {
		http.ServeContent(w, r, song.FilePath, stat.ModTime(), file)
		return
	}

	var start, end int64
	n, err := fmt.Sscanf(rangeHeader, "bytes=%d-%d", &start, &end)
	if err != nil || n < 1 {
		http.Error(w, "invalid range", http.StatusRequestedRangeNotSatisfiable)
		return
	}

	if end == 0 || end >= stat.Size() {
		end = stat.Size() - 1
	}

	if start > end || start >= stat.Size() {
		http.Error(w, "range not satisfiable", http.StatusRequestedRangeNotSatisfiable)
		return
	}

	w.Header().Set("Content-Type", mimeType)
	w.Header().Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, stat.Size()))
	w.WriteHeader(http.StatusPartialContent)

	file.Seek(start, io.SeekStart)
	io.CopyN(w, file, end-start+1)
}

func SongRouter(w http.ResponseWriter, r *http.Request) {
	if strings.HasSuffix(r.URL.Path, "/stream") {
		StreamSong(w, r)
		return
	}
	GetSong(w, r)
}
