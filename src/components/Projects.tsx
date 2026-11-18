"use client"

import { motion } from "framer-motion"
import { Layers, Github, ExternalLink, Code, Smartphone, Microscope, Cpu } from "lucide-react"
import { projects } from "../data/projects"

const techIconMap: Record<string, any> = {
  React: Code,
  Flutter: Smartphone,
  Python: Microscope,
  "C++": Cpu,
  Docker: Layers,
  "FastAPI": Code,
}

export default function Projects() {
  return (
    <section id="projects" className="py-20 dark:bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Projects</h2>
            <p className="text-muted-foreground mt-2">Selected works from coursework, research, and personal builds</p>
          </div>
          <a
            href="https://github.com/rahat-codes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
          >
            <Github className="w-4 h-4" /> View All on GitHub
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 rounded text-xs font-medium bg-white/5 text-accent-400 border border-accent-400/20">
                  {project.featured ? "Featured" : "Project"}
                </span>
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:text-accent-300">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-sm text-accent-400 font-medium mb-3">{project.subtitle}</p>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.slice(0, 6).map((t) => (
                  <span key={t} className="px-2 py-1 rounded bg-white/5 text-xs border border-white/5 text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-white hover:text-accent-400 transition-colors"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
