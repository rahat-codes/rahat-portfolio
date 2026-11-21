"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useTheme } from "./ThemeProvider"
import {
  Menu,
  X,
  Github,
  Sun,
  Moon,
  Code,
  ArrowUpRight,
} from "lucide-react"

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#certifications", label: "Certifications" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { resolvedTheme, toggleTheme } = useTheme()

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  return (
    <nav
      className={`fixed z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-border bg-background/90 backdrop-blur-xl"
          : "border-border/60 bg-background/70 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link href="#home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg border border-primary/30 bg-primary/10 flex items-center justify-center">
              <Code className="w-4 h-4 text-primary" />
            </div>
            <span className="font-black text-xl tracking-[-0.04em]">
              R<span className="text-primary">MH</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="https://github.com/rahat-codes"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-all hover:border-primary/50 hover:bg-secondary"
            >
              <Github className="w-4 h-4" /> GitHub
            </Link>
            <Link href="#contact" className="btn-primary ml-2 px-4 py-2 text-sm">
              Let&apos;s talk <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
            <button
              onClick={toggleTheme}
              className="ml-1 rounded-lg border border-border p-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
              aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-border p-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground lg:hidden"
              aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg border border-border p-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground lg:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div id="mobile-navigation" className="border-b border-border bg-background/95 backdrop-blur-xl lg:hidden">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 px-4 rounded-xl text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <Link
                href="https://github.com/rahat-codes"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-3 px-4 rounded-xl text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground flex items-center gap-2"
              >
                <Github className="w-4 h-4" /> GitHub
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
