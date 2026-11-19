"use client"

import { motion } from "framer-motion"
import { GraduationCap, Building2, Mail, Phone, MapPin, Github, Clock } from "lucide-react"
import { personalInfo } from "../data/personal"
import { education } from "../data/education"

export default function About() {
  return (
    <section id="about" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: Content */}
          <div className="lg:col-span-7 space-y-10">
            <div className="flex flex-col space-y-3">
              <h2 className="text-4xl font-bold tracking-tight">About Me</h2>
              <p className="text-primary">Personal Background</p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {personalInfo.bio}
            </p>

            {/* Quick facts grid */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="p-6 rounded-2xl glass-card">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Education</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {education[0].institution} — {education[0].degree}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {education[0].period}
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-card">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Location</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {personalInfo.location}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {personalInfo.nationality} national
                </p>
              </div>
            </div>

            {/* Languages */}
            <div className="mt-10">
              <h3 className="font-semibold text-lg mb-6">Languages</h3>
              <div className="flex flex-wrap gap-4">
                {personalInfo.languages.map((lang) => (
                  <div key={lang.name} className="flex flex-col w-full max-w-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{lang.name}</span>
                      <span className="text-xs text-muted-foreground">{lang.level}</span>
                    </div>
                    <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent-500"
                        style={{ width: lang.level === "Upper" ? "85%" : "65%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Profile card + contact chips */}
          <div className="lg:col-span-5">
            {/* Profile card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="rounded-2xl glass-card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent-500 flex items-center justify-center shadow-lg shadow-primary/30">
                    <span className="text-2xl font-bold text-white">R<span className="text-primary">MH</span></span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{personalInfo.name}</div>
                    <div className="text-primary font-medium">{personalInfo.title}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Email", value: personalInfo.email, icon: "✉", href: `mailto:${personalInfo.email}` },
                    { label: "Phone", value: personalInfo.phone, icon: "📞", href: `tel:${personalInfo.phone}` },
                    { label: "Location", value: personalInfo.location, icon: "📍", href: null },
                    { label: "GitHub", value: "rahat-codes", icon: "🐙", href: personalInfo.github },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href ?? undefined}
                      target={item.href && item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary hover:text-primary-foreground transition-colors ${
                        item.href ? "" : "cursor-default"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
                        <div className="text-sm font-medium text-foreground">{item.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Since badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl glass-card p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">Building since</div>
                  <div className="text-lg font-bold text-foreground">2024</div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Github className="w-6 h-6 text-primary" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
