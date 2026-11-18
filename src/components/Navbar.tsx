"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Github, Mail, Linkedin, Phone, MapPin, Code, GraduationCap, Award, Layers } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#certifications", label: "Certifications" },
    { href: "#education", label: "Education" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-300 ${scrolled ? "bg-dark-900/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="#home" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">R<span className="text-accent-400">MH</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-accent-400 dark:text-white dark:hover:text-accent-400"
              >
                {link.label}
              </Link>
            ))}
            <a href="https://github.com/rahat-codes" target="_blank" rel="noopener noreferrer" className="text-sm font-medium transition-colors hover:text-accent-400 dark:text-white">
              <Github className="w-4 h-4 mr-1 inline" /> GitHub
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white hover:text-accent-400"
              aria-label="Open menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-dark-900 border-b border-white/5">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-sm font-medium transition-colors hover:text-accent-400 dark:text-white"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/rahat-codes"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 text-sm font-medium transition-colors hover:text-accent-400 dark:text-white flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
