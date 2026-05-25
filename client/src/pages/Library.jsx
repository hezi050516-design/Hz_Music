import { useState, useEffect } from "react"
import { fetchSongs, getCachedSongs } from "../api/client"
import NavBar from "../components/NavBar"
import SearchBar from "../components/SearchBar"
import SongList from "../components/SongList"

export default function Library() {
  const [songs, setSongs] = useState(() => getCachedSongs() || [])
  const [query, setQuery] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fresh, setFresh] = useState(!!getCachedSongs())

  useEffect(() => {
    setLoading(true)
    setError("")
    fetchSongs(query)
      .then(s => {
        setSongs(s)
        setFresh(true)
      })
      .catch(e => {
        if (!getCachedSongs()) setError(`连接失败: ${e.message}`)
      })
      .finally(() => setLoading(false))
  }, [query])

  function handleRefresh() {
    setLoading(true)
    setError("")
    fetchSongs("")
      .then(s => { setSongs(s); setFresh(true) })
      .catch(e => setError(`刷新失败: ${e.message}`))
      .finally(() => setLoading(false))
  }

  return (
    <div className="page">
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
        <button onClick={handleRefresh} style={{padding:"4px 10px",fontSize:12,margin:0,background:"#333"}}>
          {loading ? "..." : "\u21BB"}
        </button>
      </div>
      <SearchBar value={query} onChange={setQuery} />
      {!fresh && !error && <p className="empty">离线模式 — 上次缓存</p>}
      {error && <p className="empty" style={{color:"#e74c3c"}}>{error}</p>}
      {!error && <SongList songs={songs} />}
      <NavBar />
    </div>
  )
}
