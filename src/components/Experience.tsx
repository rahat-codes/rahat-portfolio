"use client"

import { motion } from "framer-motion"
import { Briefcase, Clock, Building, Code2 } from "lucide-react"
import { experience } from "../data/experience"

const iconMap: Record<string, any> = {
  "Den of Builders (DOB)": Code2,
  부마톡담길비: Building,
  "Dong-A University BIC": Briefcase,
}

export default function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Experience</h2>
            <p className="text-muted-foreground mt-2">Professional & extracurricular journey</p>
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-white/10 dark:bg-white/10"></div>

          {experience.map((exp, i) => {
            const Icon = iconMap[exp.company] || Briefcase
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative mb-16 pl-14"
              >
                {/* Timeline dot */}
                <div className="absolute left-[-8px] top-3 w-4 h-4 rounded-full bg-accent-500 ring-8 ring-accent-500/20"></div>

                <div className="mb-2 flex items-start gap-2">
                  <div className="flex items-center gap-1">
                    <Icon className="w-4 h-4 text-accent-400 mt-0.5" />
                    <span className="text-xs font-medium text-accent-400 uppercase tracking-wider">{exp.type}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold">{exp.company}</h3>
                <p className="text-sm font-medium text-accent-400">{exp.role}</p>
                <p className="text-sm text-muted-foreground">{exp.period} · {exp.location}</p>
                <p className="mt-3 text-muted-foreground leading-relaxed">{exp.description}</p>

                <ul className="mt-4 space-y-2 list-disc list-inside text-sm text-muted-foreground">
                  {exp.achievements.map((a, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-accent-400 mt-0.5">▹</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
