import { personalInfo } from "../data/personal"

const links = [
  { label: "GitHub", href: personalInfo.github },
  { label: "Email", href: `mailto:${personalInfo.email}` },
  { label: "LinkedIn", href: "https://linkedin.com/in/rahat-codes" },
]

export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} {personalInfo.name}
      </p>
      <nav aria-label="Social links" className="flex flex-wrap gap-x-6 gap-y-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  )
}
