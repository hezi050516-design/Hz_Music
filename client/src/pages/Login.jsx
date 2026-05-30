import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getServerUrl } from "../api/client"
import { useAuth } from "../context/AuthContext"
import "./Login.css"

export default function Login() {
  const { refreshUser } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [passwordAgain, setPasswordAgain] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [captchaId, setCaptchaId] = useState("")
  const [captchaQuestion, setCaptchaQuestion] = useState("")
  const [captchaAnswer, setCaptchaAnswer] = useState("")
  const nav = useNavigate()

  async function refreshCaptcha() {
    try {
      const base = getServerUrl().replace(/\/+$/, "")
      const res = await fetch(`${base}/api/captcha`)
      const data = await res.json()
      setCaptchaId(data.id)
      setCaptchaQuestion(data.question)
    } catch (e) {}
  }

  useEffect(() => { refreshCaptcha() }, [])

  function validate() {
    if (isRegister && password !== passwordAgain) {
      setError("两次密码不一致"); return false
    }
    if (!captchaAnswer.trim()) {
      setError("请输入验证码"); return false
    }
    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(""); setSuccess("")
    if (!validate()) return
    try {
      const base = getServerUrl().replace(/\/+$/, "")
      if (isRegister) {
        const res = await fetch(`${base}/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, password_again: passwordAgain, captcha_id: captchaId, captcha_answer: captchaAnswer }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) { setError(data.error || "注册失败"); refreshCaptcha(); return }
        setSuccess("注册成功，请登录")
        setIsRegister(false)
        setPasswordAgain("")
      } else {
        const res = await fetch(`${base}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, captcha_id: captchaId, captcha_answer: captchaAnswer }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) { setError(data.error || "登录失败"); refreshCaptcha(); return }
        localStorage.setItem("music-user", data.username)
        localStorage.setItem("music-token", data.token)
        refreshUser()
        setSuccess("登录成功")
        setTimeout(() => nav("/"), 600)
      }
    } catch (e) {
      setError("网络错误"); refreshCaptcha()
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">{isRegister ? "创建账号" : "登录"}</h1>
        <p className="login-sub">{isRegister ? "注册后即可上传音乐" : "欢迎回来"}</p>

        <form onSubmit={handleSubmit}>
          <label>用户名</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)}
            placeholder="输入用户名" required autoComplete="username" style={{background:"var(--bg-hover)",border:"1px solid var(--bg-hover)",borderRadius:8,padding:"10px 14px",color:"var(--text-primary)",fontSize:14,outline:"none",width:"100%"}} />

          <label>密码</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="输入密码" required autoComplete={isRegister ? "new-password" : "current-password"}
            style={{background:"var(--bg-hover)",border:"1px solid var(--bg-hover)",borderRadius:8,padding:"10px 14px",color:"var(--text-primary)",fontSize:14,outline:"none",width:"100%"}} />

          {isRegister && (
            <>
              <label>确认密码</label>
              <div className="field-row">
                <input type="password" value={passwordAgain} onChange={e => setPasswordAgain(e.target.value)}
                  placeholder="再次输入密码" required autoComplete="new-password" />
                {passwordAgain && password !== passwordAgain && <span className="field-error">不一致</span>}
              </div>
            </>
          )}

          <label>验证码</label>
          <div className="captcha-row">
            <div className="captcha-box" onClick={refreshCaptcha}>
              {captchaQuestion || "加载中..."}
            </div>
            <input type="text" value={captchaAnswer} onChange={e => setCaptchaAnswer(e.target.value)}
              placeholder="输入答案" required style={{flex:1}} />
          </div>

          {error && <p className="field-error" style={{marginTop:12,textAlign:"center"}}>{error}</p>}
          {success && <p className="field-success" style={{marginTop:12,textAlign:"center"}}>{success}</p>}

          <button type="submit" className="login-btn">{isRegister ? "注册" : "登录"}</button>
        </form>

        <button onClick={() => { setIsRegister(!isRegister); setError(""); setSuccess(""); refreshCaptcha() }}
          className="login-toggle">
          {isRegister ? "已有账号？点此登录" : "没有账号？点此注册"}
        </button>
      </div>
    </div>
  )
}
