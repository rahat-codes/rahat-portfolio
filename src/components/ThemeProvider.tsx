"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "dark",
  toggleTheme: () => {},
})

export function ThemeProvider({ children, defaultTheme = "system" }: { children: ReactNode; defaultTheme?: Theme }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    updateResolvedTheme()
  }, [])

  useEffect(() => {
    if (mounted) {
      updateResolvedTheme()
    }
  }, [theme])

  const updateResolvedTheme = () => {
    if (theme === "system") {
      const systemTheme =
        typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      setResolvedTheme(systemTheme)
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", systemTheme === "dark")
      }
    } else {
      setResolvedTheme(theme)
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", theme === "dark")
      }
    }
  }

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
      setTheme(stored)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
