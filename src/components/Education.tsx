"use client"

import { GraduationCap } from "lucide-react"
import { education } from "../data/education"
import SectionHeader from "./SectionHeader"
import SpotlightCard from "./ui/SpotlightCard"

export default function Education() {
  return (
    <section id="education" className="section-container">
      <SectionHeader eyebrow="07 / Education" title="Education" description="Academic background" />

      <div className="max-w-3xl mx-auto">
        {education.map((edu, i) => (
          <SpotlightCard
            key={i}
            delay={i * 0.1}
            className="group mb-8 rounded-2xl border border-border bg-card/75 p-8 transition-all hover:border-primary/40"
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
          </SpotlightCard>
        ))}
      </div>
    </section>
  )
}
