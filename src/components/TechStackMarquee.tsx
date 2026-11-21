"use client"

import { motion } from "framer-motion"
import { skills } from "../data/skills"

const stack = skills.flatMap((category) => category.items.map((skill) => skill.name)).slice(0, 18)

export default function TechStackMarquee() {
  return (
    <motion.section
      aria-label="Technology stack"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-[2] overflow-hidden border-y border-border/80 py-6"
    >
      <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Tools I use to bring ideas to life
      </p>
      <div className="stack-marquee">
        <div className="stack-marquee-track">
          {[0, 1].map((copy) => (
            <div className="stack-marquee-group" key={copy} aria-hidden={copy === 1}>
              {stack.map((name) => (
                <span key={name} className="stack-marquee-item">
                  <span className="mr-3 text-primary">✳</span>{name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
