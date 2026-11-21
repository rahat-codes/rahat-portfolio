"use client"

import { motion } from "framer-motion"
import { GraduationCap, Building2, Github, Clock, Mail, Phone, MapPin, type LucideIcon } from "lucide-react"
import { personalInfo } from "../data/personal"
import { education } from "../data/education"
import SectionHeader from "./SectionHeader"

const contactItems: { label: string; value: string; icon: LucideIcon; href: string | null }[] = [
  { label: "Email", value: personalInfo.email, icon: Mail, href: `mailto:${personalInfo.email}` },
  { label: "Phone", value: personalInfo.phone, icon: Phone, href: `tel:${personalInfo.phone}` },
  { label: "Location", value: personalInfo.location, icon: MapPin, href: null },
  { label: "GitHub", value: "rahat-codes", icon: Github, href: personalInfo.github },
]

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
            <SectionHeader
              eyebrow="03 / Profile"
              title="About Me"
              description="Personal background"
              className="mb-0"
            />

            <p className="text-lg text-muted-foreground leading-relaxed">
              {personalInfo.bio}
            </p>

            {/* Quick facts grid */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="group p-6 rounded-2xl glass-card">
                <div className="flex items-center gap-3 mb-4">
                  <span className="vui-icon-frame h-9 w-9 rounded-xl">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <span className="font-semibold text-foreground">Education</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {education[0].institution} — {education[0].degree}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {education[0].period}
                </p>
              </div>

              <div className="group p-6 rounded-2xl glass-card">
                <div className="flex items-center gap-3 mb-4">
                  <span className="vui-icon-frame h-9 w-9 rounded-xl">
                    <Building2 className="h-4 w-4" />
                  </span>
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
                        className="h-full bg-hero-gradient"
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
                  <div className="relative flex size-16 items-center justify-center rounded-full border border-primary/25 bg-hero-gradient shadow-[0_12px_32px_hsl(var(--primary)/0.22)] ring-4 ring-primary/5">
                    <span className="text-xl font-black tracking-[-0.06em] text-primary-foreground">
                      R<span className="text-primary-foreground/75">MH</span>
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{personalInfo.name}</div>
                    <div className="text-primary font-medium">{personalInfo.title}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ...contactItems,
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                    <a
                      key={item.label}
                      href={item.href ?? undefined}
                      target={item.href && item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary hover:text-primary-foreground transition-colors ${
                        item.href ? "" : "cursor-default"
                      }`}
                    >
                      <span className="vui-icon-frame h-9 w-9 rounded-lg">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
                        <div className="text-sm font-medium text-foreground">{item.value}</div>
                      </div>
                    </a>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Since badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group rounded-2xl glass-card p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="vui-icon-frame h-9 w-9 rounded-xl">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">Building since</div>
                  <div className="text-lg font-bold text-foreground">2024</div>
                </div>
              </div>
              <div className="vui-icon-frame h-12 w-12 rounded-full">
                <Github className="w-6 h-6 text-primary" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
