"use client"

import { skills } from "../data/skills"
import SectionHeader from "./SectionHeader"
import SpotlightCard from "./ui/SpotlightCard"
import OrbitingSkills, { type OrbitingSkillItem } from "./ui/orbiting-skills"

const orbitDefinitions = [
  { label: "HTML5", icon: "html", orbit: "inner", phaseShift: 0, glowColor: "cyan" },
  { label: "CSS3", icon: "css", orbit: "inner", phaseShift: 120, glowColor: "cyan" },
  { label: "JavaScript", icon: "javascript", orbit: "inner", phaseShift: 240, glowColor: "cyan" },
  { label: "React", icon: "react", orbit: "outer", phaseShift: 0, glowColor: "sky" },
  { label: "Node.js", icon: "node", orbit: "outer", phaseShift: 120, glowColor: "sky" },
  { label: "Tailwind CSS", icon: "tailwind", orbit: "outer", phaseShift: 240, glowColor: "sky" },
] satisfies Omit<OrbitingSkillItem, "level">[]

const allSkills = skills.flatMap(category => category.items)
const orbitingSkills: OrbitingSkillItem[] = orbitDefinitions.map(definition => {
  const skill = allSkills.find(item => item.name === definition.label)
  if (!skill) {
    throw new Error(`Orbiting skill "${definition.label}" is missing from the technical skills data.`)
  }

  return { ...definition, level: skill.level }
})

export default function Skills() {
  return (
    <section id="skills" className="section-container">
      <SectionHeader
        eyebrow="05 / Toolkit"
        title="Technical Skills"
        description="Explore my core web stack and the wider toolkit I use to build."
      />

      <div className="grid items-center gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative mx-auto w-full max-w-[32rem] py-4">
          <div className="mb-2 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Core web stack</p>
            <p className="mt-2 text-sm text-muted-foreground">Hover, focus, or tap an icon to pause its orbit and see proficiency.</p>
          </div>
          <OrbitingSkills items={orbitingSkills} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {skills.map((category, i) => (
            <SpotlightCard
              key={category.category}
              delay={i * 0.1}
              className="rounded-[20px] border border-white bg-[#131313] p-6 transition-colors hover:border-primary"
            >
              <h3 className="mb-6 flex items-center gap-2 text-lg font-bold">
                <span className="size-2 rounded-full bg-primary" />
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.items.map(skill => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
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
      </div>
    </section>
  )
}
