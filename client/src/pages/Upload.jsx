import { useState } from "react"
import { uploadSong } from "../api/client"
import NavBar from "../components/NavBar"

export default function Upload() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleUpload() {
    if (!files.length) return
    setUploading(true)
    setResult(null)
    try {
      for (const file of files) {
        await uploadSong(file)
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
      <input type="file" multiple accept="audio/*"
        onChange={(e) => setFiles([...e.target.files])} />
      <button onClick={handleUpload} disabled={uploading || !files.length}>
        {uploading ? "上传中..." : "上传"}
      </button>
      {result && <p className="result">{result}</p>}
      <NavBar />
    </div>
  )
}
