import { skills } from "../data/skills"
import SectionHeader from "./SectionHeader"

export default function Skills() {
  return (
    <section id="skills" className="section-container">
      <SectionHeader title="Technical skills" />
      <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>
  )
}
