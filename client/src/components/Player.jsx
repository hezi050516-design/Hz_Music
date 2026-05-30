import { useNavigate, useLocation } from "react-router-dom"
import { usePlayer } from "../context/PlayerContext"
import { Repeat, Repeat1, SkipBack, Play, Pause, SkipForward, ListMusic } from "lucide-react"
import "./Player.css"

export default function Player({ onShowPlaylist }) {
  const { currentSong, playing, progress, duration, error, toast, mode, cycleMode, togglePlay, seek, next, prev } = usePlayer()
  const nav = useNavigate()
  const loc = useLocation()

  const hasSong = !!currentSong
  const title = hasSong ? currentSong.title : "暂无播放"
  const artist = hasSong ? currentSong.artist : ""

  const fmt = (t) => {
    if (!t || isNaN(t)) return "0:00"
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  function goToDetail() {
    if (!currentSong) return
    if (loc.pathname === "/song") nav(-1)
    else nav(`/song?id=${currentSong.id}&title=${encodeURIComponent(currentSong.title)}&artist=${encodeURIComponent(currentSong.artist)}`)
  }

  const ModeIcon = mode === "loop-one" ? Repeat1 : Repeat

  function handleVolume(e) {
    const v = Number(e.target.value)
    const audio = document.querySelector("audio")
    if (audio) audio.volume = v
  }

  return (
    <div className="player">
      {error && <div className="player-error-msg">{error}</div>}
      <div className="player-progress-bar" onClick={e => {
        if (!hasSong) return
        const rect = e.currentTarget.getBoundingClientRect()
        seek((e.clientX - rect.left) / rect.width * (duration || 1))
      }}>
        <div className="player-progress-fill" style={{width: duration ? `${(progress/duration)*100}%` : "0%"}} />
      </div>
      <div className="player-main">
        <div className="player-info" onClick={goToDetail}>
          <strong>{title}</strong>
          {artist && <span>{artist}</span>}
        </div>
        <div className="player-ctrls">
          <button onClick={cycleMode} className={mode !== "sequential" ? "active-ctrl" : ""}>
            <ModeIcon size={16} />
          </button>
          <button onClick={prev} disabled={!hasSong}><SkipBack size={18} /></button>
          <button onClick={togglePlay} disabled={!hasSong} className="play-btn">
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={next} disabled={!hasSong}><SkipForward size={18} /></button>
          <button onClick={onShowPlaylist} disabled={!hasSong}><ListMusic size={16} /></button>
        </div>
        <div className="player-right">
          <span className="player-time">{fmt(progress)} / {fmt(duration)}</span>
          <input type="range" min="0" max="1" step="0.05" defaultValue="1"
            onInput={handleVolume} className="volume-slider" />
        </div>
      </div>
      {toast && <div className="toast" key={toast}>{toast}</div>}
    </div>
  )
}
