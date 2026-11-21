"use client"

import { useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import { ArrowUpRight, Github } from "lucide-react"
import { projects } from "../data/projects"

export default function ProjectRail() {
  const [activeIndex, setActiveIndex] = useState(0)
  const railRef = useRef<HTMLDivElement>(null)
  const railStyle: CSSProperties & { "--rail-caption-width": string } = {
    "--rail-caption-width": `${(12 / (12 + projects.length - 1)) * 100}cqw`,
  }

  const resetActiveCard = () => {
    if (!railRef.current?.contains(document.activeElement)) {
      setActiveIndex(0)
    }
  }

  return (
    <div
      ref={railRef}
      className="project-rail"
      style={railStyle}
      onPointerLeave={resetActiveCard}
    >
      {projects.map((project, index) => {
        const isActive = activeIndex === index
        const detailsId = `project-details-${index}`

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

            <div
              id={detailsId}
              className="project-rail-card__caption"
            >
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
  )
}
