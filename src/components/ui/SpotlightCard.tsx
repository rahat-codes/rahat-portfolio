"use client"

import type { PointerEvent, PropsWithChildren } from "react"
import { motion } from "framer-motion"

interface SpotlightCardProps extends PropsWithChildren {
  className?: string
  delay?: number
}

export default function SpotlightCard({
  children,
  className = "",
  delay = 0,
}: SpotlightCardProps) {
  const updateSpotlight = (event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      onPointerMove={updateSpotlight}
      className={`spotlight-card ${className}`}
    >
      {children}
    </motion.article>
  )
}
