import { useState, useRef, useEffect } from "react"
import { Search, X, Sun, Moon } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import "./TopBar.css"

export default function TopBar({ searchValue, onSearchChange }) {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

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
          onBlur={() => { if (!searchValue) { setOpen(false); onSearchChange("") } }}
          onKeyDown={e => { if (e.key === "Escape") { setOpen(false); onSearchChange("") } }}
          className="topbar-search-input"
        />
      </div>
    )
  }

  return (
    <div className="topbar">
      <div className="topbar-spacer" />
      <button onClick={toggleTheme} className="topbar-icon" title="切换主题">
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <button onClick={() => setOpen(true)} className="topbar-icon">
        <Search size={20} />
      </button>
    </div>
  )
}
