"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Menu,
  X,
  Github,
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
  const [activeSection, setActiveSection] = useState("#home")
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const y = window.scrollY
    setScrolled(y > 20)
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    setScrollProgress(documentHeight > 0 ? Math.min(100, (y / documentHeight) * 100) : 0)

    let current = "#home"
    for (const link of navLinks) {
      const section = document.querySelector(link.href)
      if (section && section.getBoundingClientRect().top <= 160) {
        current = link.href
      }
    }
    setActiveSection(current)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    const frame = window.requestAnimationFrame(handleScroll)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <nav
      className="fixed z-50 w-full px-3 pt-3 transition-all duration-300 sm:px-5 sm:pt-4"
      aria-label="Primary navigation"
    >
      <div
        className={`relative mx-auto max-w-7xl overflow-hidden rounded-2xl border transition-all duration-300 ${
          scrolled
            ? "border-white/30 bg-[#131313]/95"
            : "border-white/15 bg-[#131313]/80"
        }`}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-primary transition-transform duration-100"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
          aria-hidden="true"
        />
        <div className="flex h-14 items-center justify-between px-3 sm:h-[4.25rem] sm:px-4 lg:px-5">
          {/* Brand */}
          <Link href="#home" className="group flex items-center gap-2.5" aria-label="Go to home">
            <div className="flex size-9 items-center justify-center rounded-lg border border-primary bg-primary text-black transition-colors group-hover:bg-[#3860be] group-hover:text-white">
              <Code className="size-4" />
            </div>
            <span className="text-lg font-black uppercase tracking-[0.12em] sm:text-xl">
              RAHAT<span className="text-primary">/MH</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${
                  activeSection === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-[#3860be]"
                }`}
                aria-current={activeSection === link.href ? "page" : undefined}
              >
                {link.label}
                <span
                  className={`absolute inset-x-3 -bottom-[0.85rem] mx-auto h-0.5 rounded-full bg-primary transition-all duration-300 ${
                    activeSection === link.href ? "w-[calc(100%-1.5rem)] opacity-100" : "w-0 opacity-0"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ))}
            <Link href="#contact" className="btn-primary ml-3 h-10 rounded-full px-5 text-xs uppercase tracking-[0.12em]">
              Let&apos;s talk <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:border-primary/40 hover:text-primary lg:hidden"
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
        <div
          id="mobile-navigation"
          className="mx-auto mt-2 max-w-7xl rounded-[20px] border border-white/30 bg-[#131313] p-3 lg:hidden"
        >
          <div className="grid gap-1">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 font-mono text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
                  activeSection === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span>{link.label}</span>
                <span className="text-[10px] tabular-nums text-muted-foreground/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-[1fr_auto] gap-2 border-t border-border pt-3">
              <Link
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="btn-primary h-11 text-sm"
              >
                Let&apos;s talk <ArrowUpRight className="ml-1 size-4" />
              </Link>
              <Link
                href="https://github.com/rahat-codes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-11 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
