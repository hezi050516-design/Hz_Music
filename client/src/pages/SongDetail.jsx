import { useState, useEffect, useRef } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { LyricalClient } from "timestamped-lyrics"
import { ArrowLeft } from "lucide-react"
import "./SongDetail.css"

const client = new LyricalClient()
const lyricsCache = new Map()
const CACHE_TTL = 30 * 60 * 1000

function getCacheKey(title, artist) { return `${title}|||${artist}` }

export default function SongDetail() {
  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const [lyrics, setLyrics] = useState([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [activeIdx, setActiveIdx] = useState(-1)
  const listRef = useRef(null)

  const title = searchParams.get("title") || ""
  const artist = searchParams.get("artist") || ""

  useEffect(() => {
    const timer = setInterval(() => {
      const audio = document.querySelector("audio")
      if (audio) setProgress(audio.currentTime)
    }, 200)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!title) return
    const key = getCacheKey(title, artist)
    const cached = lyricsCache.get(key)
    if (cached && Date.now() - cached.time < CACHE_TTL) {
      setLyrics(cached.data); setLoading(false); return
    }
    setLoading(true)
    client.getLyricLines(title, artist)
      .then(lines => {
        const data = lines || []
        lyricsCache.set(key, { data, time: Date.now() })
        setLyrics(data); setLoading(false)
      })
      .catch(() => { setLyrics([]); setLoading(false) })
  }, [title, artist])

  useEffect(() => {
    const idx = lyrics.findIndex((l, i) => {
      const next = lyrics[i + 1]
      return progress >= l.start && (!next || progress < next.start)
    })
    setActiveIdx(idx)
  }, [progress, lyrics])

  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return
    const el = listRef.current.children[activeIdx]
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [activeIdx])

  return (
    <div className="page song-detail-page">
      <div className="song-detail-header">
        <button onClick={() => nav(-1)}><ArrowLeft size={22} color="var(--text-primary)" /></button>
      </div>
      <div className="song-detail-meta">
        <h2>{title}</h2>
        {artist && <p>{artist}</p>}
      </div>
      {loading && <p className="empty">加载中...</p>}
      {!loading && !lyrics.length && <p className="empty">暂无歌词</p>}
      {!loading && lyrics.length > 0 && (
        <div className="lyrics-container">
          <div className="lyrics-scroll" ref={listRef}>
            {lyrics.map((line, i) => (
              <p key={i} className={`lyric-line${i === activeIdx ? " active" : ""}`}
                onClick={() => {
                  const audio = document.querySelector("audio")
                  if (audio) audio.currentTime = line.start
                }}>
                {line.text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
