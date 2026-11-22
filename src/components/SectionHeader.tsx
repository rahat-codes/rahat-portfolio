interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
}

export default function SectionHeader({
  title,
  description,
  className = "mb-12",
}: SectionHeaderProps) {
  return (
    <header className={`${className} max-w-3xl`}>
      <h2 className="editorial-section-title">{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </header>
  )
}
