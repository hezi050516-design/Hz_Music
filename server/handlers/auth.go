package handlers

import (
	"hz-music/server/db"
	"net/http"
	"strings"
)

func Register(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := jsonDecode(r, &body); err != nil {
		jsonError(w, "invalid request", 400)
		return
	}
	body.Username = strings.TrimSpace(body.Username)
	if body.Username == "" || body.Password == "" {
		jsonError(w, "username and password required", 400)
		return
	}
	user, err := db.Register(body.Username, body.Password)
	if err != nil {
		jsonError(w, "server error", 500)
		return
	}
	if user == nil {
		jsonError(w, "username taken", 409)
		return
	}
	jsonResponse(w, map[string]interface{}{"id": user.ID, "username": user.Username})
}

func Login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := jsonDecode(r, &body); err != nil {
		jsonError(w, "invalid request", 400)
		return
	}
	token, ok := db.Login(body.Username, body.Password)
	if !ok {
		jsonError(w, "wrong username or password", 401)
		return
	}
	jsonResponse(w, map[string]string{"token": token, "username": body.Username})
}

func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
		if token == "" {
			jsonError(w, "unauthorized", 401)
			return
		}
		username, ok := db.ValidateToken(token)
		if !ok {
			jsonError(w, "invalid token", 401)
			return
		}
		r.Header.Set("X-User", username)
		next(w, r)
	}
}
