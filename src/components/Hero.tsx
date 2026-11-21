import { personalInfo } from "../data/personal"
import Nexa, { type NexaCharacter, type NexaStat, type NexaTheme } from "./ui/nexa-canvas-hero"
import type { CSSProperties } from "react"

const nameParts = personalInfo.name.split(" ")
const heroTitle = `${nameParts.slice(0, 2).join(" ")}\n${nameParts.slice(2).join(" ")}`

const accentThemes: NexaTheme[] = [
  {
    id: "cyan",
    label: "Cyan",
    accent: "hsl(184 92% 52%)",
    ink: "hsl(225 12% 4%)",
  },
  {
    id: "sky",
    label: "Sky",
    accent: "hsl(198 88% 62%)",
    ink: "hsl(225 12% 4%)",
  },
]

const stats: NexaStat[] = [
  {
    id: "projects",
    label: "Projects built",
    value: "9+",
    caption: "Across AI, web, and embedded systems",
    icon: "folder",
  },
  {
    id: "honors",
    label: "Academic honors",
    value: "4×",
    caption: "Dean's List",
    icon: "calendar",
  },
  {
    id: "certifications",
    label: "Certifications",
    value: "13+",
    caption: "Professional credentials",
    icon: "globe",
  },
]

const character: NexaCharacter = {
  src: "/images/hero/nexa-character-hq.webp",
  width: 1164,
  height: 1351,
  alt: "",
}

const heroStyle: CSSProperties & { "--nx-nav": string } = {
  // The site navbar overlays the canvas, so reserve its height without rendering another navbar.
  paddingTop: "4rem",
  "--nx-nav": "4rem",
}

export default function Hero() {
  return (
    <Nexa
      id="home"
      title={heroTitle}
      description={`${personalInfo.title} at Tongmyong University in ${personalInfo.location}, building practical solutions across machine learning, full-stack development, and embedded systems.`}
      craftLabel="Role ·"
      disciplines={personalInfo.subtitle.split(" · ")}
      character={character}
      greeting={`Hi, ${nameParts[0]}!`}
      primaryAction={{ label: "View Work", href: "#projects" }}
      secondaryAction={{ label: "Get in Touch", href: "#contact" }}
      stats={stats}
      themes={accentThemes}
      defaultThemeId="cyan"
      displayFontFamily="var(--font-sans)"
      bodyFontFamily="var(--font-sans)"
      showToolbar={false}
      keyboardShortcuts={false}
      style={heroStyle}
      viewportHeight="100dvh"
    />
  )
}
