"use client"

import { useState, type CSSProperties } from "react"

export type OrbitingSkillIcon = "html" | "css" | "javascript" | "react" | "node" | "tailwind"

export interface OrbitingSkillItem {
  label: string
  level: number
  icon: OrbitingSkillIcon
  orbit: "inner" | "outer"
  phaseShift: number
  glowColor: "cyan" | "sky"
}

interface OrbitingSkillsProps {
  items: OrbitingSkillItem[]
}

type OrbitStyle = CSSProperties & {
  "--orbit-color": string
  "--orbit-direction": "normal" | "reverse"
  "--orbit-duration": string
}

type CounterStyle = CSSProperties & {
  "--counter-direction": "normal" | "reverse"
  "--orbit-duration": string
}

const glowColors = {
  cyan: "hsl(184 92% 52%)",
  sky: "hsl(198 88% 62%)",
}

function SkillLogo({ type }: { type: OrbitingSkillIcon }) {
  switch (type) {
    case "html":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
          <path
            fill="#E34F26"
            d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"
          />
        </svg>
      )
    case "css":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
          <path
            fill="#1572B6"
            d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.751L12 19.351l5.379-1.443.744-8.157z"
          />
        </svg>
      )
    case "javascript":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
          <rect width="24" height="24" rx="3" fill="#F7DF1E" />
          <path
            fill="#323330"
            d="M22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9l1.755-1.125c-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65zM13.05 11.03h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"
          />
        </svg>
      )
    case "react":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none">
          <g stroke="#61DAFB" strokeWidth="1.25">
            <circle cx="12" cy="12" r="2" fill="#61DAFB" />
            <ellipse cx="12" cy="12" rx="10.5" ry="4" />
            <ellipse cx="12" cy="12" rx="10.5" ry="4" transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10.5" ry="4" transform="rotate(120 12 12)" />
          </g>
        </svg>
      )
    case "node":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
          <path fill="#339933" d="m12 1.5 9.1 5.25v10.5L12 22.5l-9.1-5.25V6.75L12 1.5z" />
          <text x="12" y="14.8" fill="white" fontSize="7" fontWeight="700" textAnchor="middle">
            JS
          </text>
        </svg>
      )
    case "tailwind":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
          <path
            fill="#06B6D4"
            d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"
          />
        </svg>
      )
  }
}

export default function OrbitingSkills({ items }: OrbitingSkillsProps) {
  const [activeSkill, setActiveSkill] = useState<OrbitingSkillItem | null>(null)
  const orbits = [
    { id: "inner", diameter: 48, duration: "34s", direction: "normal" as const, items: items.filter(item => item.orbit === "inner") },
    { id: "outer", diameter: 80, duration: "48s", direction: "reverse" as const, items: items.filter(item => item.orbit === "outer") },
  ]

  return (
    <div className="w-full">
      <div
        className="orbiting-skills-stage relative mx-auto aspect-square w-full max-w-[28rem]"
        data-paused={activeSkill ? "true" : "false"}
        role="group"
        aria-label="Interactive orbit of core technical skills"
      >
        <div className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.12),hsl(198_88%_62%/0.04)_45%,transparent_72%)] blur-xl" />

        {orbits.map(orbit => {
          const orbitStyle: OrbitStyle = {
            width: `${orbit.diameter}%`,
            aspectRatio: "1",
            "--orbit-color": orbit.id === "inner" ? glowColors.cyan : glowColors.sky,
            "--orbit-direction": orbit.direction,
            "--orbit-duration": orbit.duration,
          }

          return (
            <div
              key={orbit.id}
              className="pointer-events-none absolute inset-0 grid place-items-center"
            >
              <div className="orbiting-skills-orbit relative rounded-full border" style={orbitStyle}>
                {orbit.items.map(item => {
                  const angle = (item.phaseShift * Math.PI) / 180
                  const itemStyle: CSSProperties = {
                    left: `${50 + Math.cos(angle) * 50}%`,
                    top: `${50 + Math.sin(angle) * 50}%`,
                    translate: "-50% -50%",
                  }
                  const counterStyle: CounterStyle = {
                    "--orbit-duration": orbit.duration,
                    "--counter-direction": orbit.direction === "normal" ? "reverse" : "normal",
                  }

                  return (
                    <div key={item.label} className="absolute z-10" style={itemStyle}>
                      <button
                        type="button"
                        className="orbiting-skill-node group pointer-events-auto relative grid size-12 place-items-center rounded-full"
                        style={{ "--skill-color": glowColors[item.glowColor] } as CSSProperties}
                        aria-label={`${item.label}, ${item.level}% proficiency`}
                        onPointerEnter={event => {
                          if (event.pointerType === "mouse" || event.pointerType === "pen") setActiveSkill(item)
                        }}
                        onPointerLeave={event => {
                          if (event.pointerType === "mouse" || event.pointerType === "pen") setActiveSkill(null)
                        }}
                        onFocus={() => setActiveSkill(item)}
                        onBlur={() => setActiveSkill(null)}
                        onClick={() => setActiveSkill(item)}
                      >
                        <span className="orbiting-skills-counter grid size-full place-items-center rounded-full" style={counterStyle}>
                          <SkillLogo type={item.icon} />
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        <div className="absolute left-1/2 top-1/2 grid size-[4.5rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-primary/30 bg-card/90 text-primary shadow-[0_0_38px_hsl(var(--primary)/0.2),inset_0_1px_hsl(var(--foreground)/0.08)] backdrop-blur">
          <span className="absolute inset-0 rounded-full bg-primary/10 blur-lg" />
          <svg aria-hidden="true" viewBox="0 0 24 24" className="relative size-8" fill="none" stroke="url(#skills-code-gradient)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <linearGradient id="skills-code-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
      </div>

      <div className="mt-1 flex min-h-8 items-center justify-center" role="status" aria-live="polite" aria-atomic="true">
        {activeSkill && (
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-foreground">
            {activeSkill.label}
            <span className="text-primary">{activeSkill.level}%</span>
          </span>
        )}
      </div>
    </div>
  )
}
