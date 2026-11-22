"use client"

import { motion } from "framer-motion"
import { education } from "../data/education"
import SectionHeader from "./SectionHeader"

export default function Education() {
  return (
    <section id="education" className="section-container">
      <SectionHeader title="Education" />
      <div className="max-w-3xl space-y-8">
        {education.map((item, index) => (
          <motion.article
            key={item.institution}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
          >
            <h3 className="text-xl font-semibold text-foreground">{item.institution}</h3>
            <p className="mt-1 text-muted-foreground">{item.degree}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.period} · {item.location}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
