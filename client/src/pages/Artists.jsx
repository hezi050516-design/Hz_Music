import { useState, useEffect } from "react"
import { api } from "../api/client"
import SongList from "../components/SongList"
import NavBar from "../components/NavBar"
import SearchBar from "../components/SearchBar"

export default function Artists() {
  const [artists, setArtists] = useState([])
  const [selectedArtist, setSelectedArtist] = useState(null)
  const [songs, setSongs] = useState([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    api("/api/artists").then(setArtists).catch(() => setArtists([]))
  }, [])

  useEffect(() => {
    if (selectedArtist) {
      api(`/api/songs?q=${encodeURIComponent(selectedArtist)}`)
        .then(s => setSongs(s.filter(song => song.artist === selectedArtist)))
        .catch(() => setSongs([]))
    }
  }, [selectedArtist])

  if (selectedArtist) {
    const filtered = query
      ? songs.filter(s => s.title.toLowerCase().includes(query.toLowerCase()))
      : songs

    return (
      <div className="page">
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <button onClick={() => setSelectedArtist(null)} style={{background:"#333",padding:"6px 12px",fontSize:13,margin:0}}>← 返回</button>
          <h2 style={{margin:0,fontSize:16}}>{selectedArtist}</h2>
        </div>
        <SearchBar value={query} onChange={setQuery} />
        <SongList songs={filtered} />
        <NavBar />
      </div>
    )
  }

  const filteredArtists = query
    ? artists.filter(a => a.name.toLowerCase().includes(query.toLowerCase()))
    : artists

  return (
    <div className="page">
      <h2>歌手</h2>
      <SearchBar value={query} onChange={setQuery} placeholder="搜索歌手..." />
      <div className="grid">
        {filteredArtists.map((a, i) => (
          <div key={i} className="card" onClick={() => setSelectedArtist(a.name)}>
            <h3>{a.name}</h3>
          </div>
        ))}
      </div>
      {!filteredArtists.length && <p className="empty">暂无歌手</p>}
      <NavBar />
    </div>
  )
}
