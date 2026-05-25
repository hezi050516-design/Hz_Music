# Spotify 风格 UI 重设计 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将音乐 App 全部页面视觉重构为 Spotify Dark 风格，引入 Lucide 图标 + 底部 Tab 导航。

**Architecture:** 安装 lucide-react 图标库，新建 TopBar（顶部搜索）+ TabBar（底部导航）组件，删除 NavBar/SearchBar，重写所有页面和播放条样式为 Spotify 配色。

**Tech Stack:** React, lucide-react, CSS

---

### Task 1: 安装 lucide-react + 基础样式变量

**Files:**
- Modify: `client/package.json`
- Modify: `client/src/App.css`

- [ ] **Step 1: 安装 lucide-react**

Run: `cd client && npm install lucide-react`

- [ ] **Step 2: 重写 App.css 全局样式和 CSS 变量**

Write `client/src/App.css`:

```css
:root {
  --bg-primary: #121212;
  --bg-card: #181818;
  --bg-hover: #282828;
  --accent: #1DB954;
  --text-primary: #FFFFFF;
  --text-secondary: #B3B3B3;
  --text-dim: #727272;
  --player-height: 64px;
  --tab-height: 56px;
  --topbar-height: 48px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

.page {
  height: calc(100vh - var(--player-height) - var(--tab-height));
  overflow-y: auto;
  padding: 8px 16px 16px;
}

button {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: inherit;
}
button:disabled { opacity: 0.4; cursor: default; }

input[type="text"], input[type="search"] {
  background: var(--bg-hover);
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  width: 100%;
}
input[type="text"]::placeholder { color: var(--text-dim); }

.avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700;
  color: var(--text-primary);
  flex-shrink: 0;
}

.empty {
  color: var(--text-dim);
  text-align: center;
  padding: 60px 0;
  font-size: 14px;
}
```

- [ ] **Step 3: 构建验证**

Run: `cd client && npm run build`
Expected: BUILD OK

- [ ] **Step 4: 提交**

```bash
git add client/
git commit -m "feat: install lucide-react and Spotify color variables"
```

---

### Task 2: TopBar 组件（顶部栏 + 统一搜索）

**Files:**
- Create: `client/src/components/TopBar.jsx`
- Create: `client/src/components/TopBar.css`
- Delete: `client/src/components/SearchBar.jsx`

- [ ] **Step 1: 写 TopBar 组件**

```jsx
// client/src/components/TopBar.jsx
import { useState, useRef, useEffect } from "react"
import { Search, X, User } from "lucide-react"
import "./TopBar.css"

const AVATAR_COLORS = ["#1DB954","#E91E63","#9C27B0","#FF9800","#2196F3","#00BCD4","#4CAF50","#FF5722"]

export default function TopBar({ title, user, searchValue, onSearchChange }) {
  const [open, setOpen] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  function getAvatarColor(name) {
    if (!name) return AVATAR_COLORS[0]
    return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  }

  if (open) {
    return (
      <div className="topbar">
        <button onClick={() => { setOpen(false); onSearchChange("") }} className="topbar-back">
          <X size={20} />
        </button>
        <input ref={inputRef} type="text"
          placeholder="搜索歌曲或歌手..."
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          className="topbar-search-input"
          autoFocus
        />
      </div>
    )
  }

  const initial = user?.username?.charAt(0)?.toUpperCase() || "?"

  return (
    <div className="topbar">
      <div className="avatar" style={{background: getAvatarColor(user?.username), width:32, height:32}}>
        {initial}
      </div>
      <h1 className="topbar-title">{title}</h1>
      <button onClick={() => setOpen(true)} className="topbar-icon">
        <Search size={20} />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: 写 TopBar CSS**

```css
/* client/src/components/TopBar.css */
.topbar {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  background: var(--bg-primary);
  position: sticky;
  top: 0;
  z-index: 50;
}
.topbar-title {
  flex: 1;
  font-size: 20px;
  font-weight: 700;
}
.topbar-icon {
  padding: 4px;
  color: var(--text-primary);
}
.topbar-back {
  padding: 4px;
  color: var(--text-primary);
}
.topbar-search-input {
  flex: 1;
  font-size: 16px !important;
  padding: 8px 0 !important;
  background: transparent !important;
  border-radius: 0 !important;
}
```

- [ ] **Step 3: 删除 SearchBar**

```bash
rm client/src/components/SearchBar.jsx
```

- [ ] **Step 4: 构建验证**

Run: `cd client && npm run build`

- [ ] **Step 5: 提交**

```bash
git add client/
git commit -m "feat: TopBar with unified search"
```

---

### Task 3: TabBar 组件（底部导航）

**Files:**
- Create: `client/src/components/TabBar.jsx`
- Create: `client/src/components/TabBar.css`
- Delete: `client/src/components/NavBar.jsx`
- Delete: `client/src/components/NavBar.css`

- [ ] **Step 1: 写 TabBar 组件**

```jsx
// client/src/components/TabBar.jsx
import { useNavigate, useLocation } from "react-router-dom"
import { Music, Mic, Settings } from "lucide-react"
import "./TabBar.css"

const TABS = [
  { path: "/", label: "音乐库", Icon: Music },
  { path: "/artists", label: "歌手", Icon: Mic },
  { path: "/settings", label: "设置", Icon: Settings },
]

export default function TabBar() {
  const nav = useNavigate()
  const loc = useLocation()

  return (
    <nav className="tabbar">
      {TABS.map(({ path, label, Icon }) => {
        const active = loc.pathname === path
        return (
          <button key={path} onClick={() => nav(path)}
            className={`tabbar-btn${active ? " active" : ""}`}>
            <Icon size={20} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: 写 TabBar CSS**

```css
/* client/src/components/TabBar.css */
.tabbar {
  height: var(--tab-height);
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--bg-card);
  border-top: 1px solid var(--bg-hover);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
.tabbar-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-size: 10px;
  color: var(--text-dim);
  padding: 4px 12px;
  transition: color 0.15s;
}
.tabbar-btn.active {
  color: var(--accent);
}
```

- [ ] **Step 3: 删除 NavBar**

```bash
rm client/src/components/NavBar.jsx
rm client/src/components/NavBar.css
```

- [ ] **Step 4: 构建验证**

Run: `cd client && npm run build`

- [ ] **Step 5: 提交**

```bash
git add client/
git commit -m "feat: TabBar bottom navigation, remove NavBar"
```

---

### Task 4: Spotify 风格播放条

**Files:**
- Modify: `client/src/components/Player.jsx`
- Modify: `client/src/components/Player.css`

- [ ] **Step 1: 重写 Player 组件**

```jsx
// client/src/components/Player.jsx
import { useNavigate, useLocation } from "react-router-dom"
import { usePlayer, MODE_LABELS } from "../context/PlayerContext"
import { Repeat, Repeat1, ArrowRight, SkipBack, Play, Pause, SkipForward, ListMusic } from "lucide-react"
import "./Player.css"

export default function Player({ onShowPlaylist }) {
  const { currentSong, playing, progress, duration, error, mode, cycleMode, togglePlay, seek, next, prev } = usePlayer()
  const nav = useNavigate()
  const loc = useLocation()

  const hasSong = !!currentSong
  const title = hasSong ? currentSong.title : "暂无播放"
  const artist = hasSong ? currentSong.artist : ""

  const fmt = (t) => {
    if (!t || isNaN(t)) return "0:00"
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  function goToDetail() {
    if (!currentSong) return
    if (loc.pathname === "/song") {
      nav(-1)
    } else {
      nav(`/song?id=${currentSong.id}&title=${encodeURIComponent(currentSong.title)}&artist=${encodeURIComponent(currentSong.artist)}`)
    }
  }

  const ModeIcon = mode === "loop-one" ? Repeat1 : Repeat

  function handleVolume(e) {
    const v = Number(e.target.value)
    const audio = document.querySelector("audio")
    if (audio) audio.volume = v
  }

  return (
    <div className="player">
      {error && <div className="player-error-msg">{error}</div>}
      <div className="player-progress-bar" onClick={e => {
        if (!hasSong) return
        const rect = e.currentTarget.getBoundingClientRect()
        const pct = (e.clientX - rect.left) / rect.width
        seek(pct * (duration || 1))
      }}>
        <div className="player-progress-fill" style={{width: duration ? `${(progress/duration)*100}%` : "0%"}} />
      </div>
      <div className="player-main">
        <div className="player-info" onClick={goToDetail}>
          <strong>{title}</strong>
          {artist && <span>{artist}</span>}
        </div>
        <div className="player-ctrls">
          <button onClick={cycleMode} className={mode !== "sequential" ? "active-ctrl" : ""}>
            <ModeIcon size={16} />
          </button>
          <button onClick={prev} disabled={!hasSong}><SkipBack size={18} /></button>
          <button onClick={togglePlay} disabled={!hasSong} className="play-btn">
            {playing ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={next} disabled={!hasSong}><SkipForward size={18} /></button>
          <button onClick={onShowPlaylist} disabled={!hasSong}><ListMusic size={16} /></button>
        </div>
        <div className="player-right">
          <span className="player-time">{fmt(progress)} / {fmt(duration)}</span>
          <input type="range" min="0" max="1" step="0.05" defaultValue="1"
            onInput={handleVolume} className="volume-slider" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 重写 Player CSS**

```css
/* client/src/components/Player.css */
.player {
  position: fixed;
  bottom: var(--tab-height);
  left: 0; right: 0;
  height: var(--player-height);
  background: var(--bg-card);
  z-index: 99;
}
.player-progress-bar {
  height: 3px;
  background: var(--bg-hover);
  cursor: pointer;
}
.player-progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 0 2px 2px 0;
  transition: width 0.2s linear;
}
.player-progress-bar:hover .player-progress-fill {
  background: #1ed760;
}
.player-main {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  gap: 12px;
}
.player-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  cursor: pointer;
}
.player-info strong {
  display: block;
  font-size: 13px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.player-info span {
  font-size: 11px;
  color: var(--text-dim);
}
.player-ctrls {
  display: flex;
  align-items: center;
  gap: 12px;
}
.player-ctrls button {
  color: var(--text-secondary);
  padding: 2px;
}
.player-ctrls button:hover { color: var(--text-primary); }
.play-btn {
  background: var(--text-primary) !important;
  border-radius: 50% !important;
  width: 34px; height: 34px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  color: #000 !important;
}
.active-ctrl { color: var(--accent) !important; }
.player-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.player-time {
  font-size: 10px;
  color: var(--text-dim);
  white-space: nowrap;
}
.volume-slider {
  width: 60px;
  accent-color: var(--accent);
  height: 3px;
}
.player-error-msg {
  position: absolute;
  top: -22px;
  left: 0; right: 0;
  background: #e74c3c;
  color: #fff;
  font-size: 11px;
  padding: 2px 12px;
  text-align: center;
}
```

- [ ] **Step 3: 构建验证**

Run: `cd client && npm run build`

- [ ] **Step 4: 提交**

```bash
git add client/
git commit -m "feat: Spotify-style player with Lucide icons"
```

---

### Task 5: App.jsx 重构 + 各页面接入 TopBar/TabBar

**Files:**
- Modify: `client/src/App.jsx`
- Modify: `client/src/pages/Library.jsx`
- Modify: `client/src/pages/Artists.jsx`
- Modify: `client/src/pages/Upload.jsx`
- Modify: `client/src/pages/Settings.jsx`
- Modify: `client/src/pages/SongDetail.jsx`

- [ ] **Step 1: 重写 App.jsx**

```jsx
import { useState } from "react"
import { HashRouter, Routes, Route } from "react-router-dom"
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
      <TopBarProvider search={search} setSearch={setSearch} user={user}>
        <Routes>
          <Route path="/" element={<Library search={search} />} />
          <Route path="/artists" element={<Artists search={search} />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/song" element={<SongDetail />} />
          <Route path="/settings" element={<Settings user={user} />} />
        </Routes>
      </TopBarProvider>
      <Player onShowPlaylist={() => setShowPlaylist(true)} />
      <Playlist visible={showPlaylist} onClose={() => setShowPlaylist(false)} />
      <TabBar />
    </HashRouter>
  )
}

function TopBarProvider({ children, search, setSearch, user }) {
  const loc = useLocation()
  const title = TITLES[loc.pathname] || ""
  return (
    <>
      <TopBar title={title} user={user} searchValue={search} onSearchChange={setSearch} />
      {children}
    </>
  )
}
```

- [ ] **Step 2: 构建验证**

Run: `cd client && npm run build`

- [ ] **Step 3: 提交**

```bash
git add client/
git commit -m "feat: new app layout with TopBar + TabBar"
```

---

### Task 6: 重写各页面样式（音乐库/歌手/上传/设置）

**Files:**
- Modify: `client/src/pages/Library.jsx`
- Modify: `client/src/pages/Artists.jsx`
- Modify: `client/src/pages/Upload.jsx`
- Modify: `client/src/pages/Settings.jsx`
- Modify: `client/src/pages/SongDetail.jsx`
- Modify: `client/src/components/SongList.jsx`

每个页面移除 NavBar 引用，接收 search prop，使用 Spotify 配色。

- [ ] **Step 1: 重写音乐库页面**

Write `client/src/pages/Library.jsx`:

```jsx
import { useState, useEffect } from "react"
import { fetchSongs, getCachedSongs } from "../api/client"
import SongList from "../components/SongList"

export default function Library({ search }) {
  const [songs, setSongs] = useState(() => getCachedSongs() || [])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchSongs(search).then(s => { setSongs(s); setLoading(false) }).catch(() => setLoading(false))
  }, [search])

  const filtered = search ? songs.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.artist.toLowerCase().includes(search.toLowerCase())
  ) : songs

  return (
    <div className="page">
      <SongList songs={filtered} />
      {loading && <p className="empty">加载中...</p>}
    </div>
  )
}
```

- [ ] **Step 2: 重写 SongList 为 Spotify 样式**

Write `client/src/components/SongList.jsx`:

```jsx
import { usePlayer } from "../context/PlayerContext"
import { Play } from "lucide-react"

const COLORS = ["#1DB954","#E91E63","#9C27B0","#FF9800","#2196F3","#00BCD4","#4CAF50","#FF5722","#795548","#607D8B"]

function getColor(key) { return COLORS[(key || 0) % COLORS.length] }

export default function SongList({ songs }) {
  const { play, currentSong } = usePlayer()
  if (!songs?.length) return <p className="empty">暂无歌曲</p>

  return (
    <div className="song-list">
      {songs.map((song, i) => {
        const active = currentSong?.id === song.id
        const initial = (song.title || "?")[0]
        return (
          <div key={song.id}
            className={`song-row${active ? " active" : ""}`}
            onClick={() => play(song, songs)}>
            <div className="song-cover" style={{background: getColor(song.id)}}>
              <span>{initial}</span>
            </div>
            <div className="song-meta">
              <strong>{song.title}</strong>
              <span>{song.artist}</span>
            </div>
            <span className="song-dur">{fmtDur(song.duration)}</span>
            {active && <Play size={14} color="var(--accent)" />}
          </div>
        )
      })}
    </div>
  )
}

function fmtDur(s) {
  if (!s) return ""
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, "0")}`
}
```

- [ ] **Step 3: 重写歌手页为 2 列网格**

Write `client/src/pages/Artists.jsx`:

```jsx
import { useState, useEffect } from "react"
import { api } from "../api/client"
import SongList from "../components/SongList"
import { ArrowLeft } from "lucide-react"

const COLORS = ["#1DB954","#E91E63","#9C27B0","#FF9800","#2196F3","#00BCD4","#4CAF50","#FF5722"]
function getColor(key) { return COLORS[(key?.charCodeAt(0) || 0) % COLORS.length] }

export default function Artists({ search }) {
  const [artists, setArtists] = useState([])
  const [selected, setSelected] = useState(null)
  const [songs, setSongs] = useState([])

  useEffect(() => { api("/api/artists").then(setArtists).catch(() => setArtists([])) }, [])
  useEffect(() => {
    if (selected) api("/api/songs").then(s => setSongs(s.filter(sg => sg.artist === selected))).catch(() => setSongs([]))
  }, [selected])

  const filtered = artists.filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()))

  if (selected) {
    return (
      <div className="page">
        <button onClick={() => setSelected(null)} style={{display:"flex",alignItems:"center",gap:4,marginBottom:12,color:"var(--text-primary)",fontSize:16,fontWeight:600}}>
          <ArrowLeft size={20} /> {selected}
        </button>
        <SongList songs={songs} />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="artist-grid">
        {filtered.map(a => (
          <div key={a.name} className="artist-card" style={{background:getColor(a.name)}}
            onClick={() => setSelected(a.name)}>
            <strong>{a.name}</strong>
            <span>歌手</span>
          </div>
        ))}
      </div>
      {!filtered.length && <p className="empty">暂无歌手</p>}
    </div>
  )
}
```

- [ ] **Step 4: 重写上传页**

Write `client/src/pages/Upload.jsx`:

```jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getServerUrl } from "../api/client"
import { useAuth } from "../context/AuthContext"
import { Upload as UploadIcon } from "lucide-react"

export default function Upload() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [files, setFiles] = useState([])
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [showDialog, setShowDialog] = useState(false)

  if (!user) {
    return (
      <div className="page" style={{textAlign:"center",paddingTop:80}}>
        <p style={{color:"var(--text-dim)",marginBottom:16}}>请先登录后使用上传功能</p>
        <button onClick={() => nav("/settings")} style={{background:"var(--accent)",color:"#000",padding:"12px 32px",borderRadius:24,fontWeight:600}}>去设置页登录</button>
      </div>
    )
  }

  function handleSelect(e) {
    const fs = [...e.target.files]
    if (!fs.length) return
    setFiles(fs)
    const name = fs[0].name.replace(/\.[^.]+$/, "")
    if (name.includes("_")) {
      const parts = name.split("_")
      setTitle(parts[0])
      setArtist(parts.slice(1).join("_"))
    } else { setTitle(name); setArtist("") }
    setShowDialog(true)
  }

  async function handleUpload() {
    if (!files.length) return
    setUploading(true); setResult(null); setShowDialog(false)
    try {
      const base = getServerUrl().replace(/\/+$/, "")
      const token = localStorage.getItem("music-token")
      for (const file of files) {
        const form = new FormData()
        form.append("file", file)
        form.append("title", title)
        form.append("artist", artist)
        await fetch(`${base}/api/upload`, { method:"POST", headers:{ Authorization:`Bearer ${token}` }, body:form })
      }
      setResult(`成功上传 ${files.length} 个文件`)
      setFiles([])
    } catch(e) { setResult(`上传失败: ${e.message}`) }
    setUploading(false)
  }

  return (
    <div className="page">
      <label className="upload-zone">
        <UploadIcon size={32} color="var(--text-dim)" />
        <p>点击选择音频文件</p>
        <input type="file" multiple accept="audio/*" onChange={handleSelect} hidden />
      </label>
      {files.length > 0 && <p style={{fontSize:12,color:"var(--text-dim)",marginTop:8}}>{files.map(f => f.name).join(", ")}</p>}
      {result && <p style={{fontSize:13,marginTop:8}}>{result}</p>}

      {showDialog && (
        <div className="overlay" onClick={() => setShowDialog(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h3>歌曲信息</h3>
            <label>歌名</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
            <label>歌手</label>
            <input type="text" value={artist} onChange={e => setArtist(e.target.value)} />
            <p style={{fontSize:11,color:"var(--text-dim)",margin:"8px 0"}}>保存为: {title}{artist ? `_${artist}` : ""}.mp3</p>
            <button onClick={handleUpload} disabled={uploading || !title} className="btn-primary">
              {uploading ? "上传中..." : "确认上传"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: 重写设置页**

Write `client/src/pages/Settings.jsx`:

```jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getServerUrl, setServerUrl } from "../api/client"
import { MODES, MODE_LABELS, usePlayer } from "../context/PlayerContext"
import { LogOut } from "lucide-react"

export default function Settings({ user }) {
  const [url, setUrl] = useState(getServerUrl())
  const { mode, cycleMode } = usePlayer()
  const nav = useNavigate()

  function handleSave() {
    setServerUrl(url)
    alert("已保存")
  }

  function handleLogout() {
    localStorage.removeItem("music-user")
    localStorage.removeItem("music-token")
    window.location.hash = "/"
    window.location.reload()
  }

  return (
    <div className="page">
      <div className="setting-card">
        <label>服务器地址</label>
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} />
        <button onClick={handleSave} style={{marginTop:8,background:"var(--accent)",color:"#000",padding:"8px 16px",borderRadius:6}}>保存</button>
      </div>

      <div className="setting-card" style={{marginTop:12}}>
        <label>播放模式</label>
        <button onClick={cycleMode} style={{marginTop:8,background:"var(--bg-hover)",color:"var(--text-primary)",padding:"8px 16px",borderRadius:6}}>
          {MODE_LABELS[mode]}
        </button>
      </div>

      <div className="setting-card" style={{marginTop:12}}>
        <label>账号</label>
        {user ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
            <span>{user.username}</span>
            <button onClick={handleLogout} style={{display:"flex",alignItems:"center",gap:4,color:"#e74c3c",fontSize:13}}>
              <LogOut size={14} /> 退出
            </button>
          </div>
        ) : (
          <button onClick={() => nav("/login")} className="btn-primary">登录 / 注册</button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: 添加新 CSS 样式到 App.css**

Write additional CSS to `client/src/App.css` (追加):

```css
.song-list { margin: 4px 0; }
.song-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.song-row:hover { background: var(--bg-hover); }
.song-row.active { border-left: 3px solid var(--accent); }
.song-cover {
  width: 44px; height: 44px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700;
  flex-shrink: 0;
}
.song-meta { flex: 1; min-width: 0; }
.song-meta strong { display: block; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.song-meta span { font-size: 12px; color: var(--text-dim); }
.song-dur { font-size: 12px; color: var(--text-dim); }

.artist-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.artist-card {
  aspect-ratio: 1;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  cursor: pointer;
  transition: filter 0.15s;
}
.artist-card:hover { filter: brightness(1.1); }
.artist-card strong { font-size: 16px; }
.artist-card span { font-size: 12px; opacity: 0.8; margin-top: 4px; }

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 2px dashed var(--bg-hover);
  border-radius: 12px;
  padding: 48px 16px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.upload-zone:hover { border-color: var(--text-dim); }
.upload-zone p { color: var(--text-dim); font-size: 14px; }

.overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 200;
  display: flex; align-items: center; justify-content: center;
}
.dialog {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 340px;
}
.dialog h3 { margin-bottom: 12px; }
.dialog label { font-size: 12px; color: var(--text-dim); display: block; margin: 8px 0 4px; }
.dialog input { margin-bottom: 4px; }

.btn-primary {
  background: var(--accent) !important;
  color: #000 !important;
  padding: 10px 24px;
  border-radius: 24px;
  font-weight: 600;
  width: 100%;
  margin-top: 8px;
}

.setting-card {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 16px;
}
.setting-card label { font-size: 12px; color: var(--text-dim); display: block; margin-bottom: 4px; }
```

- [ ] **Step 7: 重写详情页样式**

Modify `client/src/pages/SongDetail.css`:

```css
.song-detail-page {
  padding: 0;
  height: calc(100vh - var(--player-height) - var(--tab-height));
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.song-detail-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
}
.song-detail-meta {
  text-align: center;
  padding: 8px 16px 16px;
}
.song-detail-meta h2 { font-size: 22px; font-weight: 700; margin-bottom: 2px; }
.song-detail-meta p { font-size: 14px; color: var(--text-dim); }
.lyrics-container { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.lyrics-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 35vh 0;
  scrollbar-width: none;
}
.lyrics-scroll::-webkit-scrollbar { width: 0; }
.lyric-line {
  padding: 8px 16px;
  font-size: 16px;
  color: var(--text-dim);
  line-height: 1.6;
  cursor: pointer;
  text-align: center;
  transition: color 0.2s, font-size 0.2s;
}
.lyric-line.active {
  color: var(--accent);
  font-weight: 600;
  font-size: 18px;
}
```

- [ ] **Step 8: 更新详情页 JSX**

Modify `client/src/pages/SongDetail.jsx` header area:

```jsx
import { ArrowLeft } from "lucide-react"
```

Replace the return block:

```jsx
  return (
    <div className="page song-detail-page">
      <div className="song-detail-header">
        <button onClick={() => nav(-1)}><ArrowLeft size={22} color="var(--text-primary)" /></button>
      </div>
      <div className="song-detail-meta">
        <h2>{title}</h2>
        {artist && <p>{artist}</p>}
      </div>
      {loading && <p className="empty">加载中...</p>}
      {!loading && !lyrics.length && <p className="empty">暂无歌词</p>}
      {!loading && lyrics.length > 0 && (
        <div className="lyrics-container">
          <div className="lyrics-scroll" ref={listRef}>
            {lyrics.map((line, i) => (
              <p key={i} className={`lyric-line${i === activeIdx ? " active" : ""}`}
                onClick={() => {
                  const audio = document.querySelector("audio")
                  if (audio) audio.currentTime = line.start
                }}>
                {line.text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
```

- [ ] **Step 9: 构建验证**

Run: `cd client && npm run build`

- [ ] **Step 10: 提交**

```bash
git add client/
git commit -m "feat: Spotify-style pages (library/artists/upload/settings/detail)"
```
