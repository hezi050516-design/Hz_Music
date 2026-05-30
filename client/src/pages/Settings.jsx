import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getServerUrl, setServerUrl } from "../api/client"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { LogOut, Upload as UploadIcon, Sun, Moon } from "lucide-react"

export default function Settings({ user }) {
  const [url, setUrl] = useState(getServerUrl())
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const nav = useNavigate()

  const [files, setFiles] = useState([])
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [uploading, setUploading] = useState(false)
  const [upResult, setUpResult] = useState(null)
  const [showDialog, setShowDialog] = useState(false)

  function handleSelect(e) {
    const fs = [...e.target.files]
    if (!fs.length) return
    setFiles(fs)
    const name = fs[0].name.replace(/\.[^.]+$/, "")
    if (name.includes("_")) {
      const parts = name.split("_")
      setTitle(parts[0]); setArtist(parts.slice(1).join("_"))
    } else { setTitle(name); setArtist("") }
    setShowDialog(true)
  }

  async function handleUpload() {
    if (!files.length) return
    setUploading(true); setUpResult(null); setShowDialog(false)
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
      setUpResult(`成功上传 ${files.length} 个文件`)
      localStorage.removeItem("music-app-cache-v4")
      setFiles([])
    } catch(e) { setUpResult(`上传失败: ${e.message}`) }
    setUploading(false)
  }

  return (
    <div className="page">
      <div className="setting-card">
        <label>账号</label>
        {user ? (
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8}}>
            <span>{user.username}</span>
            <button onClick={() => { logout(); window.location.reload() }} style={{display:"flex",alignItems:"center",gap:4,color:"#e74c3c",fontSize:13}}>
              <LogOut size={14} /> 退出
            </button>
          </div>
        ) : (
          <button onClick={() => nav("/login")} className="btn-primary">登录 / 注册</button>
        )}
      </div>

      <div className="setting-card" style={{marginTop:12}}>
        <label>主题</label>
        <button onClick={toggleTheme} style={{display:"flex",alignItems:"center",gap:8,marginTop:8,background:"var(--bg-hover)",color:"var(--text-primary)",padding:"8px 16px",borderRadius:6}}>
          {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
          {theme === "dark" ? "夜间模式" : "白天模式"}
        </button>
      </div>

      {user && (
        <div className="setting-card" style={{marginTop:12}}>
          <label>上传音乐</label>
          <label className="upload-zone" style={{marginTop:8,padding:"24px 16px"}}>
            <UploadIcon size={24} color="var(--text-dim)" />
            <p>点击选择音频文件</p>
            <input type="file" multiple accept="audio/*" onChange={handleSelect} hidden />
          </label>
          {upResult && <p style={{fontSize:13,marginTop:8}}>{upResult}</p>}
        </div>
      )}

      <div className="setting-card" style={{marginTop:12}}>
        <label>服务器地址</label>
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} />
        <button onClick={() => { setServerUrl(url); alert("已保存") }}
          style={{marginTop:8,background:"var(--accent)",color:"#000",padding:"8px 16px",borderRadius:6}}>保存</button>
      </div>

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
