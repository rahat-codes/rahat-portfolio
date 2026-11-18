"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Code, Layers, Award, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { personalInfo } from "@/data/personal"

// Simple scramble text effect component
function ScrambleText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  const [display, setDisplay] = useState(text.split("").map(() => " "))

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

  return <span ref={undefined as any} className={className}>{display.join("")}</span>
}

const statItems = [
  { label: "Projects Built", value: "9+", icon: Layers, color: "text-primary" },
  { label: "Academic Honors", value: "Dean's List ×4", icon: Award, color: "text-accent-400" },
  { label: "Certifications", value: "13+", icon: Code, color: "text-accent-500" },
]

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-medium text-primary">Available for opportunities</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Hi, I'm{" "}
            <span className="block gradient-text">
              <ScrambleText text={personalInfo.name} className="text-inherit" delay={100} />
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed">
            {personalInfo.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="#projects"
              className="btn-primary"
            >
              View Work <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a
              href="#contact"
              className="btn-outline"
            >
              Get in Touch
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/50">
            {statItems.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="p-4 rounded-xl bg-secondary border border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className="w-4 h-4 {stat.color}" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          {/* Contact quick links */}
          <div className="flex items-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${personalInfo.email}`} className="hover:text-primary transition-colors">
                {personalInfo.email}
              </a>
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

        {/* Right: Visual profile card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center relative"
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent-500/20 rounded-2xl blur-xl transition-all group-hover:scale-105 duration-700"></div>
            
            <div className="relative z-10 rounded-2xl border border-border bg-card backdrop-blur-md p-1 shadow-2xl">
              <div className="rounded-xl overflow-hidden border border-border/50 bg-background">
                <div className="p-6 md:p-8">
                  <div className="flex gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-500 flex items-center justify-center shadow-lg shadow-primary/30">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Developer Profile</h3>
                      <p className="text-xs text-muted-foreground">AI & Computer Engineering</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {statItems.map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <stat.icon className="w-4 h-4 {stat.color}" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{stat.label}</p>
                          <p className="text-xs text-muted-foreground">{stat.value}</p>
                        </div>
                      </motion.div>
                    ))}
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
