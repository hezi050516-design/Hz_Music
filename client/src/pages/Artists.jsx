import { useState, useEffect } from "react"
import { api } from "../api/client"
import NavBar from "../components/NavBar"

export default function Artists() {
  const [artists, setArtists] = useState([])

  useEffect(() => {
    api("/api/artists").then(setArtists).catch(() => setArtists([]))
  }, [])

  return (
    <div className="page">
      <h2>艺术家</h2>
      <div className="grid">
        {artists.map((a, i) => (
          <div key={i} className="card">
            <h3>{a.name}</h3>
          </div>
        ))}
      </div>
      {!artists.length && <p className="empty">暂无艺术家</p>}
      <NavBar />
    </div>
  )
}
