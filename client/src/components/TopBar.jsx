import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
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
