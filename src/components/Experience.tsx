"use client"

import { Code2, Building, Briefcase, type LucideIcon } from "lucide-react"
import { experience } from "../data/experience"
import SpotlightCard from "./ui/SpotlightCard"
import SectionHeader from "./SectionHeader"

const iconMap: Record<string, LucideIcon> = {
  "Den of Builders (DOB)": Code2,
  부마톡담길비: Building,
  "Dong-A University BIC": Briefcase,
}

export default function Experience() {
  return (
    <section id="experience" className="section-container">
      <div className="flex flex-col lg:flex-row gap-8 lg:justify-between items-start mb-12">
        <SectionHeader
          eyebrow="04 / Experience"
          title="Experience"
          description="Professional & extracurricular journey"
          className="mb-0"
        />
      </div>

      <div className="relative">
        <div className="absolute bottom-8 left-5 top-8 w-px bg-border"></div>

        {experience.map((exp) => {
          const Icon = iconMap[exp.company] || Briefcase
          return (
            <SpotlightCard
              key={exp.company}
              className="group relative mb-5 rounded-xl border border-border bg-card/70 p-6 pl-16 transition-colors hover:border-primary/40 sm:p-7 sm:pl-[4.5rem]"
            >
              <div className="vui-icon-frame absolute left-[1.05rem] top-7 h-8 w-8 rounded-lg">
                <Icon className="h-4 w-4" />
              </div>

              <div className="mb-2 flex items-start gap-2 justify-between">
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-primary">{exp.type}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{exp.period}</span>
              </div>

              <h3 className="text-lg font-semibold tracking-tight text-foreground">{exp.company}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{exp.role}</p>
              <p className="mt-1 text-xs text-muted-foreground">{exp.location}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{exp.description}</p>

              <ul className="mt-4 space-y-2 list-disc list-inside text-sm text-muted-foreground">
                {exp.achievements.map((a, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">▹</span>
                    {a}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          )
        })}
      </div>
    </section>
  )
}
