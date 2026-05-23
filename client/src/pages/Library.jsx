import { useState, useEffect } from "react"
import { api } from "../api/client"
import NavBar from "../components/NavBar"
import SearchBar from "../components/SearchBar"
import SongList from "../components/SongList"

export default function Library() {
  const [songs, setSongs] = useState([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    const path = query
      ? `/api/songs?q=${encodeURIComponent(query)}`
      : "/api/songs"
    api(path).then(setSongs).catch(() => setSongs([]))
  }, [query])

  return (
    <div className="page">
      <SearchBar value={query} onChange={setQuery} />
      <SongList songs={songs} />
      <NavBar />
    </div>
  )
}
