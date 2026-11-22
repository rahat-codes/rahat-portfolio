import { certifications } from "../data/certifications"
import SectionHeader from "./SectionHeader"

export default function Certifications() {
  return (
    <section id="certifications" className="section-container">
      <SectionHeader title="Certifications & honors" description="Academic achievements and professional certifications." />
      <ul className="max-w-3xl space-y-6">
        {certifications.map((item, index) => (
          <li key={`${item.name}-${item.date}-${index}`}>
            <h3 className="font-semibold text-foreground">{item.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.issuer} · {item.date}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
