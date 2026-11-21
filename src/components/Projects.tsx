import { Github } from "lucide-react"
import AnimatedLink from "./ui/AnimatedLink"
import SectionHeader from "./SectionHeader"
import ProjectRail from "./ProjectRail"

export default function Projects() {
  return (
    <section id="projects" className="section-container">
      <div className="mb-12 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeader
          eyebrow="02 / Selected work"
          title="Projects"
          description="Selected work from coursework, research, and personal builds"
          className="mb-0"
        />
        <AnimatedLink
          href="https://github.com/rahat-codes"
          external
          variant="outline"
          className="shrink-0 gap-2 text-sm"
        >
          <Github className="w-4 h-4" /> View All on GitHub
        </AnimatedLink>
      </div>
      <ProjectRail />
    </section>
  )
}
