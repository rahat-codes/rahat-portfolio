"use client"

import { skills } from "../data/skills"
import SectionHeader from "./SectionHeader"
import OrbitingSkills, { type OrbitingSkillItem } from "./ui/orbiting-skills"

const orbitDefinitions = [
  { label: "HTML5", icon: "html", orbit: "inner", phaseShift: 0, glowColor: "cyan" },
  { label: "CSS3", icon: "css", orbit: "inner", phaseShift: 120, glowColor: "cyan" },
  { label: "JavaScript", icon: "javascript", orbit: "inner", phaseShift: 240, glowColor: "cyan" },
  { label: "React", icon: "react", orbit: "outer", phaseShift: 0, glowColor: "sky" },
  { label: "Node.js", icon: "node", orbit: "outer", phaseShift: 120, glowColor: "sky" },
  { label: "Tailwind CSS", icon: "tailwind", orbit: "outer", phaseShift: 240, glowColor: "sky" },
] satisfies Omit<OrbitingSkillItem, "level">[]

const allSkills = skills.flatMap((category) => category.items)
const orbitingSkills: OrbitingSkillItem[] = orbitDefinitions.map((definition) => {
  const skill = allSkills.find((item) => item.name === definition.label)
  if (!skill) {
    throw new Error(`Orbiting skill "${definition.label}" is missing from the technical skills data.`)
  }

  return { ...definition, level: skill.level }
})

export default function Skills() {
  return (
    <section id="skills" className="section-container">
      <SectionHeader title="Technical skills" />
      <div className="grid items-center gap-12 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative mx-auto w-full max-w-[32rem] py-4">
          <p className="mb-2 text-center text-sm text-muted-foreground">
            Hover, focus, or tap an icon to pause its orbit and see proficiency.
          </p>
          <OrbitingSkills items={orbitingSkills} />
        </div>
        <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {skills.map((category) => (
            <div key={category.category}>
              <h3 className="text-lg font-semibold text-foreground">{category.category}</h3>
              <ul className="mt-3 space-y-1 text-muted-foreground">
                {category.items.map((skill) => (
                  <li key={skill.name}>{skill.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
