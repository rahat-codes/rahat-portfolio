"use client"

import { motion } from "framer-motion"
import { Code2, Building, Briefcase } from "lucide-react"
import { experience } from "../data/experience"

const iconMap: Record<string, any> = {
  "Den of Builders (DOB)": Code2,
  부마톡담길비: Building,
  "Dong-A University BIC": Briefcase,
}

export default function Experience() {
  return (
    <section id="experience" className="section-container">
      <div className="flex flex-col lg:flex-row gap-8 lg:justify-between items-start mb-12">
        <div>
          <h2 className="text-4xl font-bold tracking-tight">Experience</h2>
          <p className="text-muted-foreground mt-2">Professional & extracurricular journey</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-border"></div>

        {experience.map((exp, i) => {
          const Icon = iconMap[exp.company] || Briefcase
          const isOdd = i % 2 === 0
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isOdd ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative mb-16 pl-14 ${isOdd ? "text-right" : ""}`}
            >
              {/* Timeline dot */}
              <div className={`absolute left-[-8px] top-3 w-4 h-4 rounded-full bg-primary ring-8 ring-primary/20 ${isOdd ? "right-[calc(100%+11px)]" : ""}`}></div>

              <div className="mb-2 flex items-start gap-2 justify-between">
                <div className="flex items-center gap-1">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">{exp.type}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{exp.period}</span>
              </div>

              <h3 className="text-xl font-bold text-foreground">{exp.company}</h3>
              <p className="text-sm font-medium text-primary">{exp.role}</p>
              <p className="text-sm text-muted-foreground">{exp.location}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{exp.description}</p>

              <ul className="mt-4 space-y-2 list-disc list-inside text-sm text-muted-foreground">
                {exp.achievements.map((a, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">▹</span>
                    {a}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
