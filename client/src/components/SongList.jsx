import { usePlayer } from "../context/PlayerContext"
import { Play, Plus } from "lucide-react"

export default function SongList({ songs }) {
  const { play, addToPlaylist, currentSong } = usePlayer()
  if (!songs?.length) return <p className="empty">暂无歌曲</p>

  return (
    <div className="song-list">
      {songs.map((song) => {
        const active = currentSong?.id === song.id
        return (
          <div key={song.id}
            className={`song-row${active ? " active" : ""}`}>
            <div className="song-meta" onClick={() => play(song)}>
              <strong>{song.title}</strong>
              <span>{song.artist}</span>
            </div>
              <span className="song-dur">{fmtDur(song.duration)}</span>
            {!active && (
              <button className="song-add-btn" onClick={e => { e.stopPropagation(); addToPlaylist(song) }}
                title="加入播放列表">
                <Plus size={18} />
              </button>
            )}
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
