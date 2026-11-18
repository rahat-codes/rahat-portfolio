"use client"

import { motion } from "framer-motion"
import { skills } from "../data/skills"

export default function Skills() {
  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Skills</h2>
          <p className="text-muted-foreground mt-2">Technologies and tools I work with</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((category, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
            >
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-500"></span>
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill, j) => (
                  <span
                    key={j}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 hover:border-accent-400/50 hover:text-accent-400 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
