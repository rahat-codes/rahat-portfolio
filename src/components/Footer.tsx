"use client"

import { Github, Mail, Linkedin, ArrowRight } from "lucide-react"

const footerLinks = [
  {
    title: "Connect",
    links: [
      { label: "GitHub", href: "https://github.com/rahat-codes", external: true },
      { label: "Email", href: "mailto:mhr1760@gmail.com", external: false },
      { label: "LinkedIn", href: "https://linkedin.com/in/rahat-codes", external: true },
    ],
  },
  {
    title: "Navigate",
    links: [
      { label: "Home", href: "#home", external: false },
      { label: "Projects", href: "#projects", external: false },
      { label: "Experience", href: "#experience", external: false },
      { label: "Contact", href: "#contact", external: false },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-md">
      <div className="section-container">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent-500 flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">R<span className="text-primary">MH</span></span>
              </div>
              <span className="font-bold text-xl tracking-tight">Rahat<span className="text-primary">MH</span></span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              AI & Computer Engineering student building practical solutions that bridge research and real-world applications.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                      {link.external && <ArrowRight className="w-3 h-3 ml-1" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rahat Md Mahadi Hasan. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/rahat-codes"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="mailto:mhr1760@gmail.com"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/rahat-codes"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all opacity-50"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
