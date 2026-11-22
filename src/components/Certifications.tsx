import { certifications } from "../data/certifications"
import SectionHeader from "./SectionHeader"
import ImageFanCarousel from "./ui/image-fan-carousel"

export default function Certifications() {
  return (
    <section id="certifications" className="section-container">
      <SectionHeader title="Certifications & honors" description="Academic achievements and professional certifications." />
      <ImageFanCarousel items={certifications} />
    </section>
  )
}
