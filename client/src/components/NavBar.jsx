import { NavLink } from "react-router-dom"
import "./NavBar.css"

export default function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/">音乐库</NavLink>
      <NavLink to="/artists">歌手</NavLink>
      <NavLink to="/upload">上传</NavLink>
      <NavLink to="/settings">设置</NavLink>
    </nav>
  )
}
