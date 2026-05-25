import { useState } from "react"
import { HashRouter, Routes, Route, useLocation } from "react-router-dom"
import { PlayerProvider } from "./context/PlayerContext"
import { AuthProvider, useAuth } from "./context/AuthContext"
import TopBar from "./components/TopBar"
import Player from "./components/Player"
import Playlist from "./components/Playlist"
import TabBar from "./components/TabBar"
import Library from "./pages/Library"
import Artists from "./pages/Artists"
import Upload from "./pages/Upload"
import Login from "./pages/Login"
import SongDetail from "./pages/SongDetail"
import Settings from "./pages/Settings"
import "./App.css"

const TITLES = { "/": "音乐库", "/artists": "歌手", "/upload": "上传", "/settings": "设置" }

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <AppShell />
      </PlayerProvider>
    </AuthProvider>
  )
}

function AppShell() {
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [search, setSearch] = useState("")
  const { user } = useAuth()

  return (
    <HashRouter>
      <Frame search={search} setSearch={setSearch} user={user}>
        <Routes>
          <Route path="/" element={<Library search={search} />} />
          <Route path="/artists" element={<Artists search={search} />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/song" element={<SongDetail />} />
          <Route path="/settings" element={<Settings user={user} />} />
        </Routes>
      </Frame>
      <Player onShowPlaylist={() => setShowPlaylist(true)} />
      <Playlist visible={showPlaylist} onClose={() => setShowPlaylist(false)} />
      <TabBar />
    </HashRouter>
  )
}

function Frame({ children, search, setSearch, user }) {
  const loc = useLocation()
  const title = TITLES[loc.pathname] || ""
  if (loc.pathname === "/song" || loc.pathname === "/login") return children
  return (
    <>
      <TopBar title={title} user={user} searchValue={search} onSearchChange={setSearch} />
      {children}
    </>
  )
}
