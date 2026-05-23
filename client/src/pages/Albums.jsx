import { useState, useEffect } from "react"
import { api } from "../api/client"
import NavBar from "../components/NavBar"

export default function Albums() {
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    api("/api/albums").then(setAlbums).catch(() => setAlbums([]))
  }, [])

  return (
    <div className="page">
      <h2>专辑</h2>
      <div className="grid">
        {albums.map((a, i) => (
          <div key={i} className="card">
            <h3>{a.name}</h3>
            <p>{a.artist}</p>
          </div>
        ))}
      </div>
      {!albums.length && <p className="empty">暂无专辑</p>}
      <NavBar />
    </div>
  )
}
