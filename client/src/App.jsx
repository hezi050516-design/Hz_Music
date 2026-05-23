import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PlayerProvider } from "./context/PlayerContext"
import Player from "./components/Player"
import Library from "./pages/Library"
import Albums from "./pages/Albums"
import Artists from "./pages/Artists"
import Upload from "./pages/Upload"
import Settings from "./pages/Settings"
import "./App.css"

export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <Player />
      </BrowserRouter>
    </PlayerProvider>
  )
}
