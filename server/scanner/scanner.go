package scanner

import (
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"hz-music/server/db"
	"hz-music/server/models"
)

var MusicDir = "music"

var audioExts = map[string]bool{
	".mp3":  true,
	".flac": true,
	".wav":  true,
	".m4a":  true,
	".ogg":  true,
	".wma":  true,
}

func ScanMusicDir(dir string) (int, error) {
	count := 0
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		ext := strings.ToLower(filepath.Ext(path))
		if !audioExts[ext] {
			return nil
		}
		if db.SongExists(path) {
			return nil
		}
		name := strings.TrimSuffix(filepath.Base(path), ext)
		title := name
		artist := ""
		if idx := strings.Index(name, "_"); idx != -1 {
			title = strings.TrimSpace(name[:idx])
			artist = strings.TrimSpace(name[idx+1:])
		}
		song := models.Song{
			Title:     title,
			Artist:    artist,
			FilePath:  path,
			FileSize:  info.Size(),
			Format:    strings.TrimPrefix(ext, "."),
			CreatedAt: info.ModTime().Format(time.RFC3339),
		}
		if _, err := db.AddSong(song); err != nil {
			log.Printf("Error adding song %s: %v", path, err)
			return nil
		}
		count++
		return nil
	})
	return count, err
}
