import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("music-theme")
    if (saved === "light" || saved === "dark") return saved
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    document.body.className = theme === "dark" ? "theme-dark" : "theme-light"
    localStorage.setItem("music-theme", theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === "dark" ? "light" : "dark")
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
