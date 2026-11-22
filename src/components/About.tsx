import { personalInfo } from "../data/personal"
import SectionHeader from "./SectionHeader"

export default function About() {
  return (
    <section id="about" className="section-container">
      <SectionHeader title="About" />
      <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
        {personalInfo.bio}
      </p>
    </section>
  )
}
