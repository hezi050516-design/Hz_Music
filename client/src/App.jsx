import { useState } from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
import { PlayerProvider } from "./context/PlayerContext"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Player from "./components/Player"
import Playlist from "./components/Playlist"
import Library from "./pages/Library"
import Artists from "./pages/Artists"
import Upload from "./pages/Upload"
import Login from "./pages/Login"
import SongDetail from "./pages/SongDetail"
import Settings from "./pages/Settings"
import "./App.css"

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
  const { user, logout } = useAuth()

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/login" element={<Login />} />
        <Route path="/song" element={<SongDetail />} />
        <Route path="/settings" element={<Settings user={user} onLogout={logout} />} />
      </Routes>
      <Player onShowPlaylist={() => setShowPlaylist(true)} />
      <Playlist visible={showPlaylist} onClose={() => setShowPlaylist(false)} />
    </HashRouter>
  )
}
