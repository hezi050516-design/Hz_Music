package models

type Album struct {
	ID        int64  `json:"id"`
	Name      string `json:"name"`
	Artist    string `json:"artist"`
	CoverPath string `json:"cover_path,omitempty"`
}
