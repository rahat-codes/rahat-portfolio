"use client"

import { motion } from "framer-motion"
import { GraduationCap, Building2 } from "lucide-react"
import { education } from "../data/education"

export default function Education() {
  return (
    <section id="education" className="py-20 dark:bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Education</h2>
          <p className="text-muted-foreground mt-2">Academic background</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-xl border border-white/10 bg-white/5 p-8 mb-8 hover:bg-white/10 transition-colors group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold">{edu.institution}</h3>
                  <p className="text-accent-400 font-medium">{edu.degree}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-bold">{edu.period}</p>
                  <p className="text-xs text-muted-foreground">{edu.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GraduationCap className="w-4 h-4 text-accent-400" />
                <span>{edu.details}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
