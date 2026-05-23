package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

func jsonResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func jsonError(w http.ResponseWriter, msg string, code int) {
	w.WriteHeader(code)
	jsonResponse(w, map[string]string{"error": msg})
}

func extractID(path, prefix string) int64 {
	idStr := strings.TrimPrefix(path, prefix)
	idStr = strings.Split(idStr, "/")[0]
	id, _ := strconv.ParseInt(idStr, 10, 64)
	return id
}
