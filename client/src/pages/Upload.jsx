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
      setTitle(parts[0]); setArtist(parts.slice(1).join("_"))
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
