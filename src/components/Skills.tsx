"use client"

import { motion } from "framer-motion"
import { skills } from "../data/skills"

export default function Skills() {
  return (
    <section id="skills" className="section-container">
      <div className="mb-12">
        <span className="section-kicker">06 / Toolkit</span>
        <h2 className="text-4xl font-bold tracking-tight">Technical Skills</h2>
        <p className="text-muted-foreground mt-2">Technologies and tools I work with</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {skills.map((category, i) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-border bg-card/75 p-6 transition-colors hover:border-primary/35"
          >
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              {category.category}
            </h3>
            <div className="space-y-4">
              {category.items.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent-500 transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
