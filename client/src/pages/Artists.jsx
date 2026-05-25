import { useState, useEffect } from "react"
import { api } from "../api/client"
import SongList from "../components/SongList"
import { ArrowLeft } from "lucide-react"

const COLORS = ["#1DB954","#E91E63","#9C27B0","#FF9800","#2196F3","#00BCD4","#4CAF50","#FF5722"]
function getColor(key) { return COLORS[(key?.charCodeAt(0) || 0) % COLORS.length] }

export default function Artists({ search }) {
  const [artists, setArtists] = useState([])
  const [selected, setSelected] = useState(null)
  const [songs, setSongs] = useState([])

  useEffect(() => { api("/api/artists").then(setArtists).catch(() => setArtists([])) }, [])
  useEffect(() => {
    if (selected) api("/api/songs").then(s => setSongs(s.filter(sg => sg.artist === selected))).catch(() => setSongs([]))
  }, [selected])

  const filtered = artists.filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()))

  if (selected) {
    return (
      <div className="page">
        <button onClick={() => setSelected(null)} style={{display:"flex",alignItems:"center",gap:4,marginBottom:12,color:"var(--text-primary)",fontSize:16,fontWeight:600}}>
          <ArrowLeft size={20} /> {selected}
        </button>
        <SongList songs={songs} />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="artist-grid">
        {filtered.map(a => (
          <div key={a.name} className="artist-card" style={{background:getColor(a.name)}}
            onClick={() => setSelected(a.name)}>
            <strong>{a.name}</strong>
            <span>歌手</span>
          </div>
        ))}
      </div>
      {!filtered.length && <p className="empty">暂无歌手</p>}
    </div>
  )
}
