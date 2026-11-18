"use client"

import { motion } from "framer-motion"
import { Award, Certificate, GraduationCap, Medal } from "lucide-react"
import { certifications } from "../data/certifications"

const iconMap: Record<string, any> = {
  award: Award,
  certificate: Certificate,
}

export default function Certifications() {
  return (
    <section id="certifications" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Certifications & Honors</h2>
            <p className="text-muted-foreground mt-2">Academic achievements and professional certifications</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {certifications.map((cert, i) => {
            const Icon = iconMap[cert.type] || Medal
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-accent-400" />
                </div>
                <h3 className="font-bold text-lg mb-1">{cert.name}</h3>
                <p className="text-sm text-accent-400 font-medium mb-1">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground mb-3">{cert.date}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{cert.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
