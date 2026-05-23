import { useState } from "react"
import { getServerUrl, setServerUrl } from "../api/client"
import NavBar from "../components/NavBar"

export default function Settings() {
  const [url, setUrl] = useState(getServerUrl())

  function handleSave() {
    setServerUrl(url)
    alert("已保存")
  }

  return (
    <div className="page">
      <h2>设置</h2>
      <div className="setting-row">
        <label>服务器地址</label>
        <input type="text" value={url}
          onChange={(e) => setUrl(e.target.value)} />
        <button onClick={handleSave}>保存</button>
      </div>
      <NavBar />
    </div>
  )
}
