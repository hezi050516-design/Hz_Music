import { createContext, useContext, useRef, useState } from "react"
import { streamUrl } from "../api/client"

const PlayerContext = createContext()

export function usePlayer() {
  return useContext(PlayerContext)
}

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [songList, setSongList] = useState([])
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef(null)

  function getAudio() {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.ontimeupdate = () => setProgress(audioRef.current.currentTime)
      audioRef.current.onloadedmetadata = () => setDuration(audioRef.current.duration)
      audioRef.current.onended = () => setPlaying(false)
    }
    return audioRef.current
  }

  function play(song, list) {
    const audio = getAudio()
    if (list) setSongList(list)
    if (currentSong?.id !== song?.id) {
      setCurrentSong(song)
      audio.src = streamUrl(song.id)
      audio.load()
    }
    audio.play().then(() => setPlaying(true)).catch(() => {})
  }

  function togglePlay() {
    const audio = getAudio()
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  function seek(time) {
    getAudio().currentTime = time
    setProgress(time)
  }

  function next() {
    if (!currentSong || !songList.length) return
    const idx = songList.findIndex((s) => s.id === currentSong.id)
    const ns = songList[(idx + 1) % songList.length]
    play(ns, songList)
  }

  function prev() {
    if (!currentSong || !songList.length) return
    const idx = songList.findIndex((s) => s.id === currentSong.id)
    const ps = songList[(idx - 1 + songList.length) % songList.length]
    play(ps, songList)
  }

  return (
    <PlayerContext.Provider value={{ currentSong, playing, progress, duration, play, togglePlay, seek, next, prev }}>
      {children}
    </PlayerContext.Provider>
  )
}
