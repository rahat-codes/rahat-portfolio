"use client"

import { useId, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import { ArrowUpRight, ChevronLeft, ChevronRight, Github } from "lucide-react"
import { projects } from "../data/projects"

export default function ProjectRail() {
  const [activeIndex, setActiveIndex] = useState(0)
  const instanceId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const railStyle: CSSProperties & { "--rail-caption-width": string } = {
    "--rail-caption-width": `${(12 / (12 + projects.length - 1)) * 100}cqw`,
  }

  const resetActiveCard = () => {
    if (!containerRef.current?.contains(document.activeElement)) {
      setActiveIndex(0)
    }
  }

  const selectProject = (index: number) => {
    setActiveIndex(index)

    if (window.matchMedia("(max-width: 1023px)").matches) {
      const rail = railRef.current
      const card = railRef.current?.children[index]
      if (rail && card instanceof HTMLElement) {
        const left = card.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft
        const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
        rail.scrollTo({ left, behavior })
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onPointerLeave={resetActiveCard}
    >
      <div className="project-rail-controls" aria-label="Project navigation">
        <button
          type="button"
          onClick={() => selectProject(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-controls={`${instanceId}-rail`}
        >
          <ChevronLeft aria-hidden="true" size={18} />
          Previous
        </button>
        <span aria-live="polite" aria-atomic="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => selectProject(activeIndex + 1)}
          disabled={activeIndex === projects.length - 1}
          aria-controls={`${instanceId}-rail`}
        >
          Next
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>

      <div
        ref={railRef}
        id={`${instanceId}-rail`}
        className="project-rail"
        style={railStyle}
      >
        {projects.map((project, index) => {
          const isActive = activeIndex === index
          const detailsId = `${instanceId}-project-details-${index}`

          return (
            <article
              key={project.title}
              className={`project-rail-card ${isActive ? "is-active" : ""}`}
              onPointerEnter={() => setActiveIndex(index)}
            >
              <div className="project-rail-card__image">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 82vw, 60vw"
                  className="object-cover"
                />
              </div>
              <span className="project-rail-card__number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="project-rail-card__rail-title" aria-hidden="true">
                {project.title}
              </span>
              <button
                type="button"
                className="project-rail-card__trigger"
                aria-label={`Show details for ${project.title}`}
                aria-expanded={isActive}
                aria-controls={detailsId}
                tabIndex={isActive ? -1 : 0}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              />

              <div id={detailsId} className="project-rail-card__caption">
                <p className="project-rail-card__eyebrow">
                  {String(index + 1).padStart(2, "0")} / {project.featured ? "Featured project" : "Project"}
                </p>
                <h3 className="project-rail-card__title">{project.title}</h3>
                <p className="project-rail-card__subtitle">{project.subtitle}</p>
                <p className="project-rail-card__description">{project.description}</p>

                <div className="project-rail-card__technologies" aria-label="Technologies">
                  {project.tech.slice(0, 4).map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>

                <div className="project-rail-card__links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    Source code
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                      Live project
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
