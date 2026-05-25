package db

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"hz-music/server/models"
	"os"
	"strings"
	"sync"
)

var (
	mu sync.RWMutex
	DB *Store
)

type Store struct {
	Songs    []models.Song   `json:"songs"`
	Albums   []models.Album  `json:"albums"`
	Artists  []models.Artist `json:"artists"`
	Users    []models.User   `json:"users"`
	Tokens   map[string]string `json:"tokens"`
	nextID   int64
	filePath string
}

func Init(dbPath string) error {
	mu.Lock()
	defer mu.Unlock()
	DB = &Store{filePath: dbPath, Tokens: make(map[string]string)}
	data, err := os.ReadFile(dbPath)
	if err != nil {
		DB.nextID = 1
		return nil
	}
	if err := json.Unmarshal(data, DB); err != nil {
		DB.nextID = 1
		return nil
	}
	if DB.Tokens == nil {
		DB.Tokens = make(map[string]string)
	}
	DB.filePath = dbPath
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

func generateToken() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func Register(username, password string) (*models.User, error) {
	mu.Lock()
	defer mu.Unlock()
	for _, u := range DB.Users {
		if strings.EqualFold(u.Username, username) {
			return nil, nil
		}
	}
	user := models.User{
		ID:       int64(len(DB.Users) + 1),
		Username: username,
		Password: password,
	}
	DB.Users = append(DB.Users, user)
	if err := save(); err != nil {
		return nil, err
	}
	return &user, nil
}

func Login(username, password string) (string, bool) {
	mu.Lock()
	defer mu.Unlock()
	for _, u := range DB.Users {
		if strings.EqualFold(u.Username, username) && u.Password == password {
			token := generateToken()
			DB.Tokens[token] = username
			save()
			return token, true
		}
	}
	return "", false
}

func ValidateToken(token string) (string, bool) {
	mu.RLock()
	defer mu.RUnlock()
	username, ok := DB.Tokens[token]
	return username, ok
}
