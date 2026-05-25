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
	username := r.Header.Get("X-User")

	if err := r.ParseMultipartForm(100 << 20); err != nil {
		jsonError(w, "file too large", 400)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		jsonError(w, "no file provided", 400)
		return
	}
	defer file.Close()

	title := strings.TrimSpace(r.FormValue("title"))
	artist := strings.TrimSpace(r.FormValue("artist"))

	origName := header.Filename
	if title == "" {
		name := strings.TrimSuffix(origName, filepath.Ext(origName))
		if idx := strings.Index(name, "_"); idx != -1 {
			title = strings.TrimSpace(name[:idx])
			if artist == "" {
				artist = strings.TrimSpace(name[idx+1:])
			}
		} else {
			title = name
		}
	}

	ext := filepath.Ext(origName)
	safeTitle := strings.ReplaceAll(title, "/", "_")
	safeTitle = strings.ReplaceAll(safeTitle, "\\", "_")
	safeArtist := strings.ReplaceAll(artist, "/", "_")
	safeArtist = strings.ReplaceAll(safeArtist, "\\", "_")

	var destPath string
	if safeArtist != "" {
		destPath = filepath.Join("music", safeTitle+"_"+safeArtist+ext)
	} else {
		destPath = filepath.Join("music", safeTitle+ext)
	}

	dst, err := os.Create(destPath)
	if err != nil {
		jsonError(w, "failed to save file", 500)
		return
	}
	defer dst.Close()

	written, err := io.Copy(dst, file)
	if err != nil {
		jsonError(w, "failed to write file", 500)
		return
	}

	song, err := db.AddSong(models.Song{
		Title:      title,
		Artist:     artist,
		FilePath:   destPath,
		FileSize:   written,
		Format:     strings.TrimPrefix(strings.ToLower(ext), "."),
		CreatedAt:  time.Now().Format(time.RFC3339),
		UploadedBy: username,
	})
	if err != nil {
		jsonError(w, "failed to save song", 500)
		return
	}

	jsonResponse(w, map[string]interface{}{
		"id":       song.ID,
		"path":     destPath,
		"size":     written,
		"filename": filepath.Base(destPath),
	})
}
