import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react"
import { personalInfo } from "../data/personal"
import { GlobeWireframe } from "./ui/contact-with-globe"

const footerGroups = [
  {
    title: "Connect",
    links: [
      { label: "GitHub", href: personalInfo.github, external: true },
      { label: "Email", href: `mailto:${personalInfo.email}` },
      { label: "LinkedIn", href: "https://linkedin.com/in/rahat-codes", external: true },
    ],
  },
  {
    title: "Navigate",
    links: [
      { label: "Home", href: "#home" },
      { label: "Projects", href: "#projects" },
      { label: "Experience", href: "#experience" },
      { label: "Contact", href: "#contact" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative isolate min-h-[26rem] overflow-hidden border-t border-border/70 bg-background/45 backdrop-blur-md">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_48%,hsl(var(--primary)/0.11),transparent_44%),radial-gradient(ellipse_at_10%_100%,hsl(198_88%_62%/0.045),transparent_48%)]" />
        <div className="absolute -right-36 top-1/2 w-[28rem] -translate-y-1/2 opacity-25 sm:-right-20 sm:w-[34rem] lg:right-[5%] lg:w-[38rem]">
          <GlobeWireframe decorative className="!max-w-none" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/40 to-background/15" />
      </div>
      <div className="section-container relative z-10">
        <div className="mb-12 grid gap-10 md:grid-cols-4 md:gap-12">
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-xl bg-hero-gradient">
                <span className="text-[10px] font-bold text-white">
                  R<span className="text-primary">MH</span>
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Rahat<span className="text-primary">MH</span>
              </span>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              {personalInfo.title} building practical solutions that bridge research and real-world applications.
            </p>
          </div>

          {footerGroups.map(group => (
            <div key={group.title}>
              <h3 className="mb-6 font-bold">{group.title}</h3>
              <ul className="space-y-3">
                {group.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                      {link.external && (
                        <ArrowUpRight aria-hidden="true" className="ml-1 size-3" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="vui-icon-frame size-10 rounded-xl"
              aria-label="GitHub"
            >
              <Github aria-hidden="true" className="size-4" />
            </a>
            <a
              href={`mailto:${personalInfo.email}`}
              className="vui-icon-frame size-10 rounded-xl"
              aria-label="Email"
            >
              <Mail aria-hidden="true" className="size-4" />
            </a>
            <a
              href="https://linkedin.com/in/rahat-codes"
              target="_blank"
              rel="noopener noreferrer"
              className="vui-icon-frame size-10 rounded-xl"
              aria-label="LinkedIn"
            >
              <Linkedin aria-hidden="true" className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
