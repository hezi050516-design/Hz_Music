package handlers

import (
	"hz-music/server/scanner"
	"net/http"
)

func TriggerScan(w http.ResponseWriter, r *http.Request) {
	count, err := scanner.ScanMusicDir("music")
	if err != nil {
		jsonError(w, err.Error(), http.StatusInternalServerError)
		return
	}
	jsonResponse(w, map[string]interface{}{
		"scanned": count,
	})
}
