import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getServerUrl, setServerUrl } from "../api/client"
import NavBar from "../components/NavBar"

export default function Settings({ user, onLogout }) {
  const [url, setUrl] = useState(getServerUrl())
  const nav = useNavigate()

  function handleSave() {
    setServerUrl(url)
    alert("已保存")
  }

  return (
    <div className="page">
      <h2>设置</h2>
      <div className="setting-row" style={{marginBottom:16}}>
        <label>服务器地址</label>
        <input type="text" value={url}
          onChange={(e) => setUrl(e.target.value)} />
        <button onClick={handleSave} style={{marginTop:4}}>保存</button>
      </div>
      <div className="setting-row">
        <label>账号</label>
        {user ? (
          <>
            <p style={{fontSize:12,color:"#888"}}>当前: {user.username}</p>
            <button onClick={() => { onLogout(); nav("/") }} style={{background:"#333"}}>退出登录</button>
          </>
        ) : (
          <button onClick={() => nav("/login")}>登录 / 注册</button>
        )}
      </div>
      <NavBar />
    </div>
  )
}
