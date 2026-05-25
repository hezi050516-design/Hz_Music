import { usePlayer, MODE_LABELS } from "../context/PlayerContext"
import "./Playlist.css"

export default function Playlist({ visible, onClose }) {
  const { playlist, currentSong, play, clearPlaylist, mode, cycleMode } = usePlayer()
  if (!visible) return null

  return (
    <div className="playlist-overlay" onClick={onClose}>
      <div className="playlist-panel" onClick={e => e.stopPropagation()}>
        <div className="playlist-header">
          <span>播放列表 ({playlist.length})</span>
          <div>
            <button onClick={cycleMode} style={{fontSize:12,background:"#333",padding:"3px 8px",marginRight:6}}>
              {MODE_LABELS[mode]}
            </button>
            <button onClick={onClose} style={{fontSize:14,background:"none",padding:0,margin:0}}>✕</button>
          </div>
        </div>
        <div className="playlist-items">
          {playlist.map((s, i) => (
            <div
              key={s.id}
              className={`pl-item${currentSong?.id === s.id ? " active" : ""}`}
              onClick={() => { play(s); onClose() }}
            >
              <span className="pl-index">{i + 1}</span>
              <div className="pl-info">
                <strong>{s.title}</strong>
                <span>{s.artist}</span>
              </div>
              {currentSong?.id === s.id && <span className="pl-playing">▶</span>}
            </div>
          ))}
        </div>
        {playlist.length > 0 && (
          <button onClick={clearPlaylist} style={{width:"100%",background:"#333",marginTop:8}}>清空列表</button>
        )}
      </div>
    </div>
  )
}
