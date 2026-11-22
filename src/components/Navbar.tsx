"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"

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
  const [activeSection, setActiveSection] = useState("#home")
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScroll = useCallback(() => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    setScrollProgress(documentHeight > 0 ? Math.min(100, (window.scrollY / documentHeight) * 100) : 0)
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
      className="fixed z-50 w-full bg-[#131313]/95 px-6 py-4 sm:px-8 lg:px-12"
      aria-label="Primary navigation"
    >
      <div className="relative mx-auto flex max-w-7xl items-center justify-between">
        <span
          className="absolute -bottom-4 left-0 h-px w-full origin-left bg-primary/20"
          aria-hidden="true"
        />
        <span
          className="absolute -bottom-4 left-0 h-px w-full origin-left bg-primary"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
          aria-hidden="true"
        />
        <Link href="#home" className="text-lg font-semibold text-foreground" aria-label="Go to home">
          Rahat
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  activeSection === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                aria-current={activeSection === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-foreground lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-4 max-w-7xl overflow-hidden bg-[#131313] py-3 lg:hidden"
          >
            <div className="grid gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm transition-colors ${
                    activeSection === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
