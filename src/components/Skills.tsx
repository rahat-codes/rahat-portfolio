"use client"

import { skills } from "../data/skills"
import SectionHeader from "./SectionHeader"
import SpotlightCard from "./ui/SpotlightCard"

export default function Skills() {
  return (
    <section id="skills" className="section-container">
      <SectionHeader
        eyebrow="05 / Toolkit"
        title="Technical Skills"
        description="Technologies and tools I work with"
      />

      <div className="grid md:grid-cols-2 gap-8">
        {skills.map((category, i) => (
          <SpotlightCard
            key={category.category}
            delay={i * 0.1}
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
                      className="h-full bg-hero-gradient transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  )
}
