"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Code, Layers, Award, Mail, Phone, MapPin } from "lucide-react"
import { personalInfo } from "../data/personal"

// Simple scramble text effect component
function ScrambleText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  const [display, setDisplay] = useState(text.split("").map(() => " "))
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const interval = setTimeout(() => {
      let iteration = 0
      const totalChars = text.length
      const maxIterations = totalChars * 4

      const scramble = setInterval(() => {
        const newDisplay = text.split("").map((char, i) => {
          if (i < iteration) return char
          const random = chars[Math.floor(Math.random() * chars.length)]
          return i === iteration ? random : display[i]
        })
        setDisplay(newDisplay)
        iteration++
        if (iteration > maxIterations) {
          clearInterval(scramble)
          setDisplay(text.split(""))
        }
      }, 30)

      return () => clearInterval(scramble)
    }, delay)
  }, [text, delay, display])

  return (
    <span ref={ref} className={className}>
      {display.join("")}
    </span>
  )
}

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-500/10 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
            <span className="text-xs font-medium text-accent-400">Available for opportunities</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Hi, I'm{" "}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-white">
              <ScrambleText text={personalInfo.name} className="text-inherit" delay={200} />
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed">
            {personalInfo.subtitle}
          </p>

          <div className="flex gap-4 pt-4">
            <a
              href="#projects"
              className="px-8 py-3 bg-accent-500 hover:bg-accent-400 text-white rounded-xl font-medium transition-colors shadow-lg shadow-accent-500/20"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-8 py-3 rounded-xl font-medium transition-colors border border-white/10 hover:bg-white/5 dark:bg-white/5 dark:text-white"
            >
              Contact Me
            </a>
          </div>

          <div className="flex items-center gap-4 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{personalInfo.location}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-accent-700/20 rounded-2xl blur-xl transition-all group-hover:scale-105 duration-500"></div>
            <div className="relative z-10 rounded-2xl border border-white/10 bg-dark-800/50 backdrop-blur-md p-1">
              <div className="rounded-xl overflow-hidden border border-white/5 bg-dark-900">
                <div className="p-6 md:p-8">
                  <div className="flex gap-4 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">Developer Profile</h3>
                      <p className="text-xs text-muted-foreground">AI & Computer Engineering</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <Layers className="w-5 h-5 text-accent-400" />
                      <div>
                        <p className="text-sm font-medium">Projects Built</p>
                        <p className="text-xs text-muted-foreground">Full-stack & ML applications</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <Award className="w-5 h-5 text-accent-400" />
                      <div>
                        <p className="text-sm font-medium">Academic Honors</p>
                        <p className="text-xs text-muted-foreground">Dean's List ×4, Best Paper</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
