package handlers

import (
	"hz-music/server/db"
	"hz-music/server/models"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func UploadSong(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(100 << 20); err != nil {
		jsonError(w, "file too large", http.StatusBadRequest)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		jsonError(w, "no file provided", http.StatusBadRequest)
		return
	}
	defer file.Close()

	filename := header.Filename
	name := strings.TrimSuffix(filename, filepath.Ext(filename))
	title := name
	artist := ""
	if idx := strings.Index(name, " - "); idx != -1 {
		artist = strings.TrimSpace(name[:idx])
		title = strings.TrimSpace(name[idx+3:])
	}

	ext := filepath.Ext(filename)
	destPath := filepath.Join("music", filename)

	dst, err := os.Create(destPath)
	if err != nil {
		jsonError(w, "failed to save file", http.StatusInternalServerError)
		return
	}
	defer dst.Close()

	written, err := io.Copy(dst, file)
	if err != nil {
		jsonError(w, "failed to write file", http.StatusInternalServerError)
		return
	}

	song, err := db.AddSong(models.Song{
		Title:     title,
		Artist:    artist,
		FilePath:  destPath,
		FileSize:  written,
		Format:    strings.TrimPrefix(strings.ToLower(ext), "."),
		CreatedAt: time.Now().Format(time.RFC3339),
		Duration:  0,
	})
	if err != nil {
		jsonError(w, "failed to save song", http.StatusInternalServerError)
		return
	}

	jsonResponse(w, map[string]interface{}{
		"id":       song.ID,
		"path":     destPath,
		"size":     written,
		"filename": filename,
	})
}
