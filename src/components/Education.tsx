"use client"

import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"
import { education } from "../data/education"

export default function Education() {
  return (
    <section id="education" className="section-container">
      <div className="mb-12">
        <h2 className="text-4xl font-bold tracking-tight">Education</h2>
        <p className="text-muted-foreground mt-2">Academic background</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {education.map((edu, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card p-8 mb-8 hover:border-primary/50 transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">{edu.institution}</h3>
                <p className="text-primary font-medium">{edu.degree}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-bold text-foreground">{edu.period}</p>
                <p className="text-xs text-muted-foreground">{edu.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="w-4 h-4 text-primary" />
              <span>{edu.details}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
