import { projects } from "../data/projects"
import SectionHeader from "./SectionHeader"

export default function Projects() {
  return (
    <section id="projects" className="section-container">
      <SectionHeader title="Projects" description="Selected work from coursework, research, and personal builds." />
      <div className="space-y-12">
        {projects.map((project) => (
          <article key={project.title} className="max-w-3xl">
            <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
            <p className="mt-1 text-muted-foreground">{project.subtitle}</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a className="text-primary transition-colors hover:text-foreground" href={project.github} target="_blank" rel="noopener noreferrer">
                Source code
              </a>
              {project.live && (
                <a className="text-primary transition-colors hover:text-foreground" href={project.live} target="_blank" rel="noopener noreferrer">
                  Live project
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
