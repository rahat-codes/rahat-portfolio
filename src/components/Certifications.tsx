"use client"

import { motion } from "framer-motion"
import { Award, FileText, Medal, type LucideIcon } from "lucide-react"
import { certifications } from "../data/certifications"
import SectionHeader from "./SectionHeader"
import SpotlightCard from "./ui/SpotlightCard"

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  certificate: FileText,
}

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  award: {
    label: "Award",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  certificate: {
    label: "Certification",
    color: "text-accent-400",
    bg: "bg-accent-500/10",
  },
}

export default function Certifications() {
  return (
    <section id="certifications" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:justify-between items-start mb-12">
        <SectionHeader
          eyebrow="06 / Recognition"
          title="Certifications & Honors"
          description="Academic achievements and professional certifications"
          className="mb-0"
        />
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {certifications.map((cert, i) => {
          const Icon = iconMap[cert.type] || Medal
          const config = typeConfig[cert.type] || typeConfig.award
          return (
            <SpotlightCard
              key={i}
              delay={i * 0.08}
              className="rounded-2xl border border-border bg-card/75 p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/10"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                <span className={`text-xs font-semibold uppercase tracking-wider ${config.color}`}>
                  {config.label}
                </span>
              </div>
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${config.bg}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-1">{cert.name}</h3>
              <p className="text-sm text-primary font-medium mb-1">{cert.issuer}</p>
              <p className="text-xs text-muted-foreground mb-3">{cert.date}</p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{cert.description}</p>
            </SpotlightCard>
          )
        })}
      </div>
        </motion.div>
    </section>
  )
}
