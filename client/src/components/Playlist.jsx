import { usePlayer } from "../context/PlayerContext"
import { Trash2 } from "lucide-react"
import "./Playlist.css"

export default function Playlist({ visible, onClose }) {
  const { playlist, currentSong, play, clearPlaylist } = usePlayer()
  if (!visible) return null

  return (
    <div className="overlay" onClick={onClose} style={{justifyContent:"flex-end"}}>
      <div className="pl-panel" onClick={e => e.stopPropagation()}>
        <div className="pl-header">
          <span>播放列表 ({playlist.length})</span>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {playlist.length > 0 && (
              <button onClick={clearPlaylist} title="清空列表" style={{color:"var(--text-dim)"}}>
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
        {playlist.length === 0 ? (
          <div className="pl-empty">
            <p>播放列表为空</p>
            <span>在歌曲旁点击 + 即可加入</span>
          </div>
        ) : (
          <div className="pl-items">
            {playlist.map((s, i) => {
              const active = currentSong?.id === s.id
              return (
                <div key={s.id}
                  className={`pl-item${active ? " active" : ""}`}
                  onClick={() => play(s)}>
                  <span className="pl-idx">{i + 1}</span>
                  <div className="pl-meta">
                    <strong>{s.title}</strong>
                    <span>{s.artist}</span>
                  </div>
                  {active && <span style={{color:"var(--accent)",fontSize:11}}>播放中</span>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
