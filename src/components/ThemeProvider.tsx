"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, defaultTheme = "system" }: { children: ReactNode; defaultTheme?: Theme }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches,
  )
  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (systemDark ? "dark" : "light") : theme

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => setSystemDark(media.matches)
    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
  }, [resolvedTheme])

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", newTheme)
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored) {
      queueMicrotask(() => setTheme(stored))
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    // Fail-safe default for SSR or if Provider is missing
    return { theme: "system", setTheme: () => {}, resolvedTheme: "dark", toggleTheme: () => {} }
  }
  return context
}
