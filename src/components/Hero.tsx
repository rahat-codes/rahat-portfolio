"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Code, Mail, MapPin, ArrowRight } from "lucide-react"
import { personalInfo } from "../data/personal"
import AnimatedLink from "./ui/AnimatedLink"

// Simple scramble text effect component
function ScrambleText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  const [display, setDisplay] = useState(text.split(""))

  useEffect(() => {
    let scramble: ReturnType<typeof setInterval> | undefined
    const timeout = setTimeout(() => {
      let iteration = 0
      const totalChars = text.length
      const maxIterations = totalChars

      scramble = setInterval(() => {
        const newDisplay = text.split("").map((char, i) => {
          if (i < iteration) return char
          const random = chars[Math.floor(Math.random() * chars.length)]
          return random
        })
        setDisplay(newDisplay)
        iteration++
        if (iteration >= maxIterations) {
          clearInterval(scramble)
          setDisplay(text.split(""))
        }
      }, 30)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (scramble) clearInterval(scramble)
    }
  }, [text, delay])

  return <span className={className}>{display.join("")}</span>
}

const statItems = [
  { label: "Projects built", value: "9+" },
  { label: "Academic honors", value: "Dean's List ×4" },
  { label: "Certifications", value: "13+" },
]

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-[92vh] items-center overflow-hidden pb-16 pt-28">
      <div className="pointer-events-none absolute -right-36 top-1/4 h-96 w-96 rounded-full bg-primary/[0.07] blur-[120px]" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-7"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card/70 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Available for opportunities
          </div>

          <div className="space-y-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
              AI &amp; Computer Engineering · Busan, KR
            </p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.06] tracking-[-0.06em] md:text-7xl">
              Hi, I&apos;m
              <span className="mt-2 block gradient-text">
              <ScrambleText text={personalInfo.name} className="text-inherit" delay={100} />
              </span>
            </h1>
          </div>

          <div className="max-w-xl border-l border-primary/50 pl-5">
            <p className="font-mono text-sm leading-7 text-muted-foreground sm:text-base">
              {personalInfo.subtitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground/80">
              Building practical solutions across machine learning, full-stack development, and embedded systems.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <AnimatedLink
              href="#projects"
              className="gap-2"
            >
              View Work <ArrowRight className="h-4 w-4" />
            </AnimatedLink>
            <AnimatedLink
              href="#contact"
              variant="outline"
            >
              Get in Touch
            </AnimatedLink>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-5 border-t border-border pt-7">
            {statItems.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="min-w-0"
              >
                <p className="font-mono text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{stat.value}</p>
                <p className="mt-1 text-[10px] uppercase leading-4 tracking-wider text-muted-foreground sm:text-xs">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 font-mono text-xs text-muted-foreground">
            <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-2 transition-colors hover:text-primary">
              <Mail className="h-3.5 w-3.5" /> {personalInfo.email}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" /> {personalInfo.location}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25 }}
            className="group overflow-hidden rounded-2xl border border-border bg-card/90 shadow-2xl shadow-black/20"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400/80" />
                <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
                <span className="h-2 w-2 rounded-full bg-primary/80" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                profile / 001
              </span>
              <Code className="h-4 w-4 text-primary" />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-5 border-b border-border pb-7">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/[0.08] font-mono text-2xl font-semibold tracking-tight text-primary shadow-[0_0_40px_hsl(var(--primary-glow))]">
                  RMH
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">Engineer &amp; builder</p>
                  <h2 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-foreground">
                    {personalInfo.name}
                  </h2>
                </div>
              </div>

              <div className="divide-y divide-border">
                {[
                  { label: "Focus", value: "AI · Full-stack · Embedded" },
                  { label: "Education", value: "Tongmyong University" },
                  { label: "Based in", value: "Busan, South Korea" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.1 }}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{item.label}</span>
                    <span className="text-right text-sm font-medium text-foreground">{item.value}</span>
                  </motion.div>
                ))}
              </div>

              <AnimatedLink
                href={personalInfo.github}
                external
                variant="outline"
                className="mt-2 w-full justify-between px-4 py-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary"
              >
                <span className="inline-flex items-center gap-2"><Code className="h-4 w-4" /> github.com/rahat-codes</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </AnimatedLink>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
