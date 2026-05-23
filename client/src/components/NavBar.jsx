import { NavLink } from "react-router-dom"
import "./NavBar.css"

export default function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/">\u266B 音乐库</NavLink>
      <NavLink to="/albums">\uD83D\uDCBF 专辑</NavLink>
      <NavLink to="/artists">\uD83C\uDFA4 艺术家</NavLink>
      <NavLink to="/upload">\uD83D\uDCE4 上传</NavLink>
      <NavLink to="/settings">\u2699\uFE0F 设置</NavLink>
    </nav>
  )
}
