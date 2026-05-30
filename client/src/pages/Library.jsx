import { useState, useEffect, useRef, useCallback } from "react"
import { fetchSongs, getCachedSongs } from "../api/client"
import SongList from "../components/SongList"

export default function Library({ search }) {
  const [songs, setSongs] = useState(() => getCachedSongs() || [])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const pageRef = useRef(null)

  const loadSongs = useCallback(async (q) => {
    setLoading(true)
    try {
      const s = await fetchSongs(q || "")
      setSongs(s)
    } catch (e) {}
    setLoading(false)
  }, [])

  useEffect(() => { loadSongs(search) }, [search])

  useEffect(() => {
    const el = pageRef.current
    if (!el) return
    function onTouchStart(e) { startY.current = e.touches[0].clientY }
    function onTouchMove(e) {
      if (el.scrollTop > 0 || refreshing) return
      if (e.touches[0].clientY - startY.current > 60) {
        setRefreshing(true)
      }
    }
    function onTouchEnd() {
      if (refreshing) {
        loadSongs(search).finally(() => setRefreshing(false))
      }
    }
    el.addEventListener("touchstart", onTouchStart, { passive: true })
    el.addEventListener("touchmove", onTouchMove, { passive: true })
    el.addEventListener("touchend", onTouchEnd)
    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
    }
  }, [refreshing, search])

  const filtered = search ? songs.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.artist.toLowerCase().includes(search.toLowerCase())
  ) : songs

  return (
    <div className="page" ref={pageRef}>
      {refreshing && <p className="empty" style={{padding:"20px 0"}}>刷新中...</p>}
      <SongList songs={filtered} />
      {loading && !refreshing && <p className="empty">加载中...</p>}
    </div>
  )
}
