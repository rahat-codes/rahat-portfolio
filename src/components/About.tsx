import { motion } from "framer-motion"
import { personalInfo } from "../data/personal"
import SectionHeader from "./SectionHeader"

export default function About() {
  return (
    <section id="about" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-48px" }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeader title="About" />
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {personalInfo.bio}
        </p>
      </motion.div>
    </section>
  )
}
