const CONFIG_KEY = "music-app-server-url"
const CACHE_KEY = "music-app-cache-v4"
const CACHE_TIME_KEY = "music-app-cache-time-v4"
const CACHE_TTL = 5 * 60 * 1000

const DEFAULT_URL = "http://192.168.1.100:8080"

export function getServerUrl() {
  return localStorage.getItem(CONFIG_KEY) || DEFAULT_URL
}

export function setServerUrl(url) {
  localStorage.setItem(CONFIG_KEY, url.replace(/\/+$/, ""))
}

export function getCachedSongs() {
  try {
    const data = localStorage.getItem(CACHE_KEY)
    const time = localStorage.getItem(CACHE_TIME_KEY)
    if (data && time && Date.now() - Number(time) < CACHE_TTL) {
      return JSON.parse(data)
    }
  } catch (e) {}
  return null
}

function setCachedSongs(songs) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(songs))
    localStorage.setItem(CACHE_TIME_KEY, String(Date.now()))
  } catch (e) {}
}

export async function api(path) {
  const base = getServerUrl().replace(/\/+$/, "")
  const res = await fetch(`${base}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchSongs(query) {
  const path = query
    ? `/api/songs?q=${encodeURIComponent(query)}`
    : "/api/songs"
  const songs = await api(path)
  if (!query) setCachedSongs(songs)
  return songs
}

export function streamUrl(songId) {
  const base = getServerUrl().replace(/\/+$/, "")
  return `${base}/api/songs/${songId}/stream?_=${Date.now()}`
}

export async function uploadSong(file) {
  const base = getServerUrl().replace(/\/+$/, "")
  const body = new FormData()
  body.append("file", file)
  const res = await fetch(`${base}/api/upload`, { method: "POST", body })
  if (!res.ok) throw new Error("Upload failed")
  return res.json()
}
