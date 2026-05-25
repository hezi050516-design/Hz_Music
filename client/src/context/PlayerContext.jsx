import { createContext, useContext, useState, useRef, useCallback } from "react"
import { streamUrl } from "../api/client"

const PlayerContext = createContext()

const MODES = ["sequential", "loop-all", "loop-one"]
const MODE_LABELS = { "sequential": "顺序", "loop-all": "列表循环", "loop-one": "单曲循环" }

export { MODES, MODE_LABELS }

export function usePlayer() {
  return useContext(PlayerContext)
}

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [playlist, setPlaylist] = useState([])
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState("")
  const [mode, setMode] = useState("sequential")
  const audioRef = useRef(null)

  function handleTimeUpdate() {
    if (audioRef.current) setProgress(audioRef.current.currentTime)
  }
  function handleLoaded() {
    if (audioRef.current) setDuration(audioRef.current.duration)
  }

  function cycleMode() {
    setMode(m => MODES[(MODES.indexOf(m) + 1) % MODES.length])
  }

  function addToPlaylist(song) {
    setPlaylist(p => {
      if (p.find(s => s.id === song.id)) return p
      return [...p, song]
    })
  }

  function removeFromPlaylist(songId) {
    setPlaylist(p => p.filter(s => s.id !== songId))
  }

  function clearPlaylist() {
    setPlaylist([])
  }

  function play(song, list) {
    setError("")
    setCurrentSong(song)
    if (list && list.length) setPlaylist(list)
    else if (!playlist.find(s => s.id === song.id)) {
      setPlaylist(p => [...p, song])
    }
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.src = ""
      audio.src = streamUrl(song.id)
      audio.load()
      audio.play().then(() => setPlaying(true)).catch(e => setError(e.message))
    }
  }

  const onEnded = useCallback(() => {
    if (!currentSong || !playlist.length) return
    if (mode === "loop-one") {
      play(currentSong)
      return
    }
    const idx = playlist.findIndex(s => s.id === currentSong.id)
    if (idx < 0) {
      play(playlist[0])
      return
    }
    if (idx < playlist.length - 1) {
      play(playlist[idx + 1])
    } else if (mode === "loop-all") {
      play(playlist[0])
    } else {
      setPlaying(false)
    }
  }, [currentSong, playlist, mode])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(e => setError(e.message))
    }
  }

  function seek(time) {
    if (audioRef.current) audioRef.current.currentTime = time
    setProgress(time)
  }

  function next() {
    if (!currentSong || !playlist.length) return
    const idx = playlist.findIndex(s => s.id === currentSong.id)
    if (idx < playlist.length - 1) {
      play(playlist[idx + 1])
    } else {
      play(playlist[0])
    }
  }

  function prev() {
    if (!currentSong || !playlist.length) return
    const idx = playlist.findIndex(s => s.id === currentSong.id)
    if (idx > 0) {
      play(playlist[idx - 1])
    } else {
      play(playlist[playlist.length - 1])
    }
  }

  return (
    <PlayerContext.Provider value={{
      currentSong, playing, progress, duration, error,
      mode, cycleMode, playlist, addToPlaylist, removeFromPlaylist, clearPlaylist,
      play, togglePlay, seek, next, prev,
    }}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoaded}
        onDurationChange={handleLoaded}
        onEnded={onEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setError(audioRef.current?.error?.message || "")}
        preload="auto"
      />
      {children}
    </PlayerContext.Provider>
  )
}
