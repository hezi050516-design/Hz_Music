import { useNavigate, useLocation } from "react-router-dom"
import { usePlayer, MODE_LABELS } from "../context/PlayerContext"
import "./Player.css"

export default function Player({ onShowPlaylist }) {
  const { currentSong, playing, progress, duration, error, mode, cycleMode, togglePlay, seek, next, prev } = usePlayer()
  const nav = useNavigate()
  const loc = useLocation()

  const fmt = (t) => {
    if (!t || isNaN(t)) return "0:00"
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  function goToDetail() {
    if (loc.pathname === "/song") {
      nav(-1)
    } else if (currentSong) {
      nav(`/song?id=${currentSong.id}&title=${encodeURIComponent(currentSong.title)}&artist=${encodeURIComponent(currentSong.artist)}`)
    }
  }

  const modeChar = { "sequential": "\u2192", "loop-all": "\u21BA", "loop-one": "\u21BA1" }[mode]

  function handleVolume(e) {
    const v = Number(e.target.value)
    const audio = document.querySelector("audio")
    if (audio) audio.volume = v
  }

  const hasSong = !!currentSong
  const title = hasSong ? currentSong.title : "暂无播放"
  const artist = hasSong ? currentSong.artist : "点击选择歌曲"

  return (
    <div className="player">
      {error && <div className="player-error">{error}</div>}
      <div className="player-info" onClick={goToDetail}>
        <strong>{title}</strong>
        <span style={{fontSize:10,color:"#888"}}>{artist}</span>
      </div>
      <div className="player-controls">
        <button onClick={cycleMode} disabled={!hasSong} title={MODE_LABELS[mode]} style={{fontSize:14}}>{modeChar}</button>
        <button onClick={prev} disabled={!hasSong}>⏮</button>
        <button onClick={togglePlay} disabled={!hasSong}>{playing ? "⏸" : "▶"}</button>
        <button onClick={next} disabled={!hasSong}>⏭</button>
        <button onClick={onShowPlaylist} disabled={!hasSong} style={{fontSize:14}}>\u2630</button>
      </div>
      <div className="player-progress">
        <span className="time">{fmt(progress)}</span>
        <input type="range" min="0" max={duration || 1} value={progress} step="0.1"
          disabled={!hasSong}
          onInput={(e) => seek(Number(e.target.value))} />
        <span className="time">{fmt(duration)}</span>
        <input type="range" min="0" max="1" step="0.05" defaultValue="1"
          onInput={handleVolume} className="volume-slider" title="音量" />
      </div>
    </div>
  )
}
