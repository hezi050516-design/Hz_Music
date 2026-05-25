import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getServerUrl } from "../api/client"
import { useAuth } from "../context/AuthContext"
import NavBar from "../components/NavBar"

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
        <h2>上传音乐</h2>
        <p style={{color:"#888",margin:"16px 0"}}>请先登录后使用上传功能</p>
        <button onClick={() => nav("/login")}>去登录</button>
        <NavBar />
      </div>
    )
  }

  function handleFileSelect(e) {
    const fs = [...e.target.files]
    if (!fs.length) return
    setFiles(fs)
    const name = fs[0].name.replace(/\.[^.]+$/, "")
    if (name.includes("_")) {
      const parts = name.split("_")
      setTitle(parts[0])
      setArtist(parts.slice(1).join("_"))
    } else {
      setTitle(name)
      setArtist("")
    }
    setShowDialog(true)
  }

  async function handleUpload() {
    if (!files.length) return
    setUploading(true)
    setResult(null)
    setShowDialog(false)
    try {
      const base = getServerUrl().replace(/\/+$/, "")
      const token = localStorage.getItem("music-token")
      for (const file of files) {
        const form = new FormData()
        form.append("file", file)
        form.append("title", title)
        form.append("artist", artist)
        await fetch(`${base}/api/upload`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: form,
        })
      }
      setResult(`成功上传 ${files.length} 个文件`)
      setFiles([])
    } catch (e) {
      setResult(`上传失败: ${e.message}`)
    }
    setUploading(false)
  }

  return (
    <div className="page">
      <h2>上传音乐</h2>
      <p style={{fontSize:12,color:"#888",marginBottom:12}}>登录用户: {user.username}</p>
      <input type="file" multiple accept="audio/*"
        onChange={handleFileSelect} />
      {files.length > 0 && <p style={{fontSize:12,color:"#888",marginTop:4}}>已选: {files.map(f => f.name).join(", ")}</p>}
      <NavBar />

      {showDialog && (
        <div className="playlist-overlay" onClick={() => setShowDialog(false)}>
          <div className="playlist-panel" onClick={e => e.stopPropagation()} style={{maxHeight:"auto",padding:"16px"}}>
            <h3 style={{marginBottom:12}}>歌曲信息</h3>
            <label style={{fontSize:13,color:"#888"}}>歌名</label>
            <input className="search-bar" value={title}
              onChange={e => setTitle(e.target.value)} />
            <label style={{fontSize:13,color:"#888"}}>歌手</label>
            <input className="search-bar" value={artist}
              onChange={e => setArtist(e.target.value)} />
            <p style={{fontSize:11,color:"#555",marginBottom:12}}>
              文件将保存为: {title}{artist ? `_${artist}` : ""}{files[0]?.name.replace(/^.*\./, ".") || ".mp3"}
            </p>
            <button onClick={handleUpload} disabled={uploading || !title}
              style={{width:"100%"}}>
              {uploading ? "上传中..." : "确认上传"}
            </button>
          </div>
        </div>
      )}

      {result && !showDialog && <p className="result">{result}</p>}
    </div>
  )
}
