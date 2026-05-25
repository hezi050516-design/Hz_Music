import { createContext, useContext, useState } from "react"
import { getServerUrl } from "../api/client"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("music-user")
      const t = localStorage.getItem("music-token")
      return u && t ? { username: u, token: t } : null
    } catch (e) { return null }
  })

  async function register(username, password) {
    const base = getServerUrl().replace(/\/+$/, "")
    const res = await fetch(`${base}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || "注册失败")
    }
    return res.json()
  }

  async function login(username, password) {
    const base = getServerUrl().replace(/\/+$/, "")
    const res = await fetch(`${base}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || "登录失败")
    }
    const data = await res.json()
    localStorage.setItem("music-user", data.username)
    localStorage.setItem("music-token", data.token)
    setUser({ username: data.username, token: data.token })
    return data
  }

  function logout() {
    localStorage.removeItem("music-user")
    localStorage.removeItem("music-token")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
