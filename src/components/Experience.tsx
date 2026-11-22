import { experience } from "../data/experience"
import SectionHeader from "./SectionHeader"

export default function Experience() {
  return (
    <section id="experience" className="section-container">
      <SectionHeader title="Experience" description="Professional and extracurricular experience." />
      <div className="max-w-3xl space-y-10">
        {experience.map((item) => (
          <article key={item.company}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="text-xl font-semibold text-foreground">{item.company}</h3>
              <p className="text-sm text-muted-foreground">{item.period}</p>
            </div>
            <p className="mt-1 text-primary">{item.role}</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
