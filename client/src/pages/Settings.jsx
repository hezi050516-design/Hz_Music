import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getServerUrl, setServerUrl } from "../api/client"
import { MODE_LABELS, usePlayer } from "../context/PlayerContext"
import { LogOut } from "lucide-react"

export default function Settings({ user }) {
  const [url, setUrl] = useState(getServerUrl())
  const { mode, cycleMode } = usePlayer()
  const nav = useNavigate()

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
        <button onClick={() => { setServerUrl(url); alert("已保存") }}
          style={{marginTop:8,background:"var(--accent)",color:"#000",padding:"8px 16px",borderRadius:6}}>保存</button>
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
