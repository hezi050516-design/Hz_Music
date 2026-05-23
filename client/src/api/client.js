const CONFIG_KEY = "music-app-server-url"
const DEFAULT_URL = "http://192.168.1.100:8080"

export function getServerUrl() {
  return localStorage.getItem(CONFIG_KEY) || DEFAULT_URL
}

export function setServerUrl(url) {
  localStorage.setItem(CONFIG_KEY, url)
}

export async function api(path) {
  const res = await fetch(`${getServerUrl()}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function streamUrl(songId) {
  return `${getServerUrl()}/api/songs/${songId}/stream`
}

export async function uploadSong(file) {
  const form = new FormData()
  form.append("file", file)
  const res = await fetch(`${getServerUrl()}/api/upload`, {
    method: "POST",
    body: form,
  })
  if (!res.ok) throw new Error("Upload failed")
  return res.json()
}
