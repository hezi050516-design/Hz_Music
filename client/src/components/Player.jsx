import { usePlayer } from "../context/PlayerContext"
import "./Player.css"

export default function Player() {
  const { currentSong, playing, progress, duration, togglePlay, seek, next, prev } = usePlayer()

  if (!currentSong) return null

  const fmt = (t) => {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div className="player">
      <div className="player-info">
        <strong>{currentSong.title}</strong>
        <span>{currentSong.artist}</span>
      </div>
      <div className="player-controls">
        <button onClick={prev}>⏮</button>
        <button onClick={togglePlay}>{playing ? "⏸" : "▶"}</button>
        <button onClick={next}>⏭</button>
      </div>
      <div className="player-progress">
        <span className="time">{fmt(progress)}</span>
        <input type="range" min="0" max={duration || 0} value={progress}
          onChange={(e) => seek(Number(e.target.value))} />
        <span className="time">{fmt(duration)}</span>
      </div>
    </div>
  )
}
