"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface AnimatedLinkProps {
  href: string
  children: ReactNode
  className?: string
  variant?: "primary" | "outline"
  external?: boolean
}

export default function AnimatedLink({
  href,
  children,
  className = "",
  variant = "primary",
  external = false,
}: AnimatedLinkProps) {
  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${variant === "primary" ? "btn-primary" : "btn-outline"} ${className}`}
    >
      {children}
    </motion.a>
  )
}
