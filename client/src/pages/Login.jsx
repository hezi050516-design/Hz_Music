import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")
  const { login, register, user } = useAuth()
  const nav = useNavigate()

  if (user) {
    return (
      <div className="page" style={{textAlign:"center",paddingTop:80}}>
        <p>已登录: {user.username}</p>
        <button onClick={() => nav("/")}>进入音乐库</button>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    try {
      if (isRegister) {
        await register(username, password)
        setError("注册成功，请登录")
        setIsRegister(false)
      } else {
        await login(username, password)
        nav("/")
      }
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="page" style={{maxWidth:320,margin:"60px auto 0"}}>
      <h2>{isRegister ? "注册" : "登录"}</h2>
      {error && <p style={{color:"#e74c3c",fontSize:13,marginBottom:8}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input className="search-bar" placeholder="用户名" value={username}
          onChange={e => setUsername(e.target.value)} />
        <input className="search-bar" type="password" placeholder="密码" value={password}
          onChange={e => setPassword(e.target.value)} />
        <button type="submit" style={{width:"100%",marginBottom:0}}>{isRegister ? "注册" : "登录"}</button>
      </form>
      <button onClick={() => { setIsRegister(!isRegister); setError("") }}
        style={{width:"100%",background:"#333",marginTop:8}}>
        {isRegister ? "已有账号？登录" : "没有账号？注册"}
      </button>
    </div>
  )
}
