interface SectionHeaderProps {
  eyebrow: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className = "mb-12",
}: SectionHeaderProps) {
  return (
    <header className={`${className} ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      <span className="section-kicker">{eyebrow}</span>
      <h2 className="gradient-text">{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </header>
  )
}
