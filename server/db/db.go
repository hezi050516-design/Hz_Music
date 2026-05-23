package db

import (
	"encoding/json"
	"hz-music/server/models"
	"os"
	"sync"
)

var (
	mu       sync.RWMutex
	DB       *Store
)

type Store struct {
	Songs   []models.Song   `json:"songs"`
	Albums  []models.Album  `json:"albums"`
	Artists []models.Artist `json:"artists"`
	nextID  int64
	filePath string
}

func Init(dbPath string) error {
	mu.Lock()
	defer mu.Unlock()
	DB = &Store{filePath: dbPath}
	data, err := os.ReadFile(dbPath)
	if err != nil {
		DB.nextID = 1
		return nil
	}
	if err := json.Unmarshal(data, DB); err != nil {
		DB.nextID = 1
		return nil
	}
	DB.filePath = dbPath
	// Recalculate nextID from existing data
	for _, s := range DB.Songs {
		if s.ID >= DB.nextID {
			DB.nextID = s.ID + 1
		}
	}
	return nil
}

func Close() error {
	mu.Lock()
	defer mu.Unlock()
	return save()
}

func save() error {
	if DB == nil || DB.filePath == "" {
		return nil
	}
	data, err := json.MarshalIndent(DB, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(DB.filePath, data, 0644)
}

func AddSong(song models.Song) (models.Song, error) {
	mu.Lock()
	defer mu.Unlock()
	song.ID = DB.nextID
	DB.nextID++
	DB.Songs = append(DB.Songs, song)
	if err := save(); err != nil {
		return models.Song{}, err
	}
	return song, nil
}

func GetSongs() []models.Song {
	mu.RLock()
	defer mu.RUnlock()
	result := make([]models.Song, len(DB.Songs))
	copy(result, DB.Songs)
	return result
}

func GetSong(id int64) (models.Song, bool) {
	mu.RLock()
	defer mu.RUnlock()
	for _, s := range DB.Songs {
		if s.ID == id {
			return s, true
		}
	}
	return models.Song{}, false
}

func GetAlbums() []models.Album {
	mu.RLock()
	defer mu.RUnlock()
	result := make([]models.Album, len(DB.Albums))
	copy(result, DB.Albums)
	return result
}

func GetArtists() []models.Artist {
	mu.RLock()
	defer mu.RUnlock()
	result := make([]models.Artist, len(DB.Artists))
	copy(result, DB.Artists)
	return result
}

func SongExists(filePath string) bool {
	mu.RLock()
	defer mu.RUnlock()
	for _, s := range DB.Songs {
		if s.FilePath == filePath {
			return true
		}
	}
	return false
}
