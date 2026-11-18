"use client"

import { motion } from "framer-motion"
import { GraduationCap, Briefcase, Building2 } from "lucide-react"
import { personalInfo } from "../data/personal"
import { education } from "../data/education"

export default function About() {
  return (
    <section id="about" className="py-20 dark:bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">About Me</h2>
              <p className="text-accent-400 font-semibold text-sm uppercase tracking-wider">Personal Background</p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {personalInfo.bio}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 rounded-xl border border-white/5 bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-5 h-5 text-accent-400" />
                  <span className="font-semibold">Education</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {education[0].institution} — {education[0].degree}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{education[0].period}</p>
              </div>

              <div className="p-6 rounded-xl border border-white/5 bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-5 h-5 text-accent-400" />
                  <span className="font-semibold">Location</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {personalInfo.location}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{personalInfo.nationality} national</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-4">Languages</h3>
              <div className="flex gap-4">
                {personalInfo.languages.map((lang) => (
                  <div key={lang.name} className="flex flex-col">
                    <span className="text-sm font-medium">{lang.name}</span>
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-accent-500"
                        style={{ width: lang.level === "Upper" ? "85%" : "65%" }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4">
                <div className="text-2xl font-bold text-accent-400">{personalInfo.name}</div>
                <div className="text-sm text-muted-foreground">{personalInfo.title}</div>
              </div>
              <div className="rounded-xl border border-white/5 bg-dark-900/50 p-4 flex items-center justify-between">
                <div className="text-sm font-medium">Since</div>
                <div className="text-sm font-bold text-right">2024</div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Email", value: personalInfo.email, icon: "✉" },
                { label: "Phone", value: personalInfo.phone, icon: "📞" },
                { label: "Location", value: personalInfo.location, icon: "📍" },
                { label: "GitHub", value: "rahat-codes", icon: "🐙" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/5">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
