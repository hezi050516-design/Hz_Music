import { usePlayer } from "../context/PlayerContext"
import { Play } from "lucide-react"

const COLORS = ["#1DB954","#E91E63","#9C27B0","#FF9800","#2196F3","#00BCD4","#4CAF50","#FF5722","#795548","#607D8B","#3F51B5","#009688"]

function getColor(key) { return COLORS[(key || 0) % COLORS.length] }

export default function SongList({ songs }) {
  const { play, currentSong } = usePlayer()
  if (!songs?.length) return <p className="empty">暂无歌曲</p>

  return (
    <div className="song-list">
      {songs.map((song) => {
        const active = currentSong?.id === song.id
        const initial = (song.title || "?")[0]
        return (
          <div key={song.id}
            className={`song-row${active ? " active" : ""}`}
            onClick={() => play(song, songs)}>
            <div className="song-cover" style={{background: getColor(song.id)}}>
              <span>{initial}</span>
            </div>
            <div className="song-meta">
              <strong>{song.title}</strong>
              <span>{song.artist}</span>
            </div>
            <span className="song-dur">{fmtDur(song.duration)}</span>
            {active && <Play size={14} color="var(--accent)" />}
          </div>
        )
      })}
    </div>
  )
}

function fmtDur(s) {
  if (!s) return ""
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, "0")}`
}
