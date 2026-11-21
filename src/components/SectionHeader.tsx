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
    <div className={`${className} ${align === "center" ? "text-center" : ""}`}>
      <span className="section-kicker">{eyebrow}</span>
      <h2 className="text-4xl font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
    </div>
  )
}
