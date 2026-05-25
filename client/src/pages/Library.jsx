import { useState, useEffect } from "react"
import { fetchSongs, getCachedSongs } from "../api/client"
import SongList from "../components/SongList"

export default function Library({ search }) {
  const [songs, setSongs] = useState(() => getCachedSongs() || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchSongs(search).then(s => { setSongs(s); setLoading(false) }).catch(() => setLoading(false))
  }, [search])

  const filtered = search ? songs.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.artist.toLowerCase().includes(search.toLowerCase())
  ) : songs

  return (
    <div className="page">
      <SongList songs={filtered} />
      {loading && <p className="empty">加载中...</p>}
    </div>
  )
}
