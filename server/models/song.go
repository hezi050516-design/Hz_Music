package models

type Song struct {
	ID         int64   `json:"id"`
	Title      string  `json:"title"`
	Artist     string  `json:"artist"`
	Album      string  `json:"album"`
	Duration   float64 `json:"duration"`
	CoverPath  string  `json:"cover_path,omitempty"`
	FilePath   string  `json:"file_path"`
	FileSize   int64   `json:"file_size"`
	Format     string  `json:"format"`
	CreatedAt  string  `json:"created_at"`
	UploadedBy string  `json:"uploaded_by,omitempty"`
}
