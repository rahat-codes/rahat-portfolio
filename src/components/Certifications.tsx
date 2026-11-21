"use client"

import { certifications } from "../data/certifications"
import SectionHeader from "./SectionHeader"
import ImageFanCarousel from "./ui/image-fan-carousel"

export default function Certifications() {
  return (
    <section id="certifications" className="section-container">
      <div>
        <SectionHeader
          eyebrow="06 / Recognition"
          title="Certifications & Honors"
          description="Academic achievements and professional certifications"
        />
        <ImageFanCarousel items={certifications} />
      </div>
    </section>
  )
}
