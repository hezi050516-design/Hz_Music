import { usePlayer } from "../context/PlayerContext"

export default function SongList({ songs }) {
  const { play, currentSong } = usePlayer()

  if (!songs?.length) return <p className="empty">暂无歌曲</p>

  return (
    <div className="song-list">
      {songs.map((song, idx) => (
        <div key={song.id} className={`song-item${currentSong?.id === song.id ? " active" : ""}`}
          onClick={() => play(song, songs)}>
          <span className="song-index">{idx + 1}</span>
          <div className="song-info">
            <strong>{song.title}</strong>
            <span>{song.artist}</span>
          </div>
          <span className="song-duration">{fmtDuration(song.duration)}</span>
        </div>
      ))}
    </div>
  )
}

function fmtDuration(s) {
  if (!s) return ""
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, "0")}`
}
