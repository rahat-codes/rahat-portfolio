"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ExternalLink, Code, Smartphone, Microscope, Cpu, Layers, Github, type LucideIcon } from "lucide-react"
import { projects } from "../data/projects"
import SpotlightCard from "./ui/SpotlightCard"
import AnimatedLink from "./ui/AnimatedLink"
import SectionHeader from "./SectionHeader"

const techIconMap: Record<string, LucideIcon> = {
  React: Code,
  Flutter: Smartphone,
  Python: Microscope,
  "C++": Cpu,
  Docker: Layers,
  FastAPI: Code,
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col lg:flex-row gap-8 lg:justify-between items-start mb-12">
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
          className="gap-2 text-sm"
        >
          <Github className="w-4 h-4" /> View All on GitHub
        </AnimatedLink>
      </div>

      {/* Featured projects - larger layout */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {featured.map((project, i) => (
          <SpotlightCard
            key={i}
            delay={i * 0.1}
            className="group relative rounded-2xl border border-border bg-card/80 transition-colors hover:border-primary/35"
          >
            {/* Image with hover effect */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-background text-foreground font-medium shadow-lg hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  Featured
                </span>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="w-4 h-4 mr-1" /> GitHub
                </a>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
              <p className="text-primary font-medium text-sm mb-3">{project.subtitle}</p>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tech.slice(0, 6).map((t) => {
                  const Icon = techIconMap[t]
                  return (
                    <span
                      key={t}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-secondary hover:border-primary hover:text-primary transition-all"
                    >
                      {Icon ? <Icon className="w-3 h-3 mr-1.5" /> : null}
                      {t}
                    </span>
                  )
                })}
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>

      {/* Other projects - compact grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {others.map((project, i) => (
          <SpotlightCard
            key={project.title}
            delay={0.2 + i * 0.08}
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl"
          >
            <div className="relative mb-4 h-32 overflow-hidden rounded-xl border border-border">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>

            <div className="flex justify-between items-start mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                Project
              </span>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-3 h-3 mr-1" />
              </a>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-1">{project.title}</h3>
            <p className="text-primary font-medium text-xs mb-3">{project.subtitle}</p>
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{project.description}</p>

            <div className="flex flex-wrap gap-1.5">
              {project.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 rounded text-[10px] font-medium border border-border bg-muted/50 text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </SpotlightCard>
        ))}
      </div>
        </motion.div>
    </section>
  )
}
