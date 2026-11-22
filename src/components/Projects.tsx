import SectionHeader from "./SectionHeader"
import ProjectRail from "./ProjectRail"

export default function Projects() {
  return (
    <section id="projects" className="section-container">
      <SectionHeader title="Projects" description="Selected work from coursework, research, and personal builds." />
      <ProjectRail />
    </section>
  )
}
