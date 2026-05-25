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
