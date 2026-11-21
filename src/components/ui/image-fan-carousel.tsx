"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Award, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

export interface CredentialCarouselItem {
  name: string
  issuer: string
  date: string
  description: string
  type: string
}

interface ImageFanCarouselProps {
  items: CredentialCarouselItem[]
}

const AUTOPLAY_INTERVAL_MS = 3200
const RADIUS_MIN = 104
const RADIUS_MAX = 320
const RADIUS_WIDTH_RATIO = 0.42
const PERSPECTIVE_MULTIPLIER = 2.4
const RING_TILT_DEG = 34

const springTransition = {
  type: "spring",
  stiffness: 60,
  damping: 16,
  mass: 0.7,
} as const

function CredentialIcon({ type, className }: { type: string; className?: string }) {
  const Icon = type === "award" ? Award : FileText
  return <Icon aria-hidden="true" className={className} />
}

function CredentialThumbnail({ item }: { item: CredentialCarouselItem }) {
  const isAward = item.type === "award"

  return (
    <div className="flex h-[4.5rem] w-16 flex-col rounded-lg border border-primary/25 bg-card/85 p-1.5 shadow-lg backdrop-blur sm:h-[5.5rem] sm:w-[4.5rem] sm:p-2 md:h-[6.5rem] md:w-[5.5rem]">
      <div className="flex items-center justify-between">
        <CredentialIcon type={item.type} className={`size-3 ${isAward ? "text-primary" : "text-sky-400"}`} />
        <span className="text-[6px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[7px]">
          {isAward ? "Honor" : "Cert"}
        </span>
      </div>
      <div className="mt-2 h-px bg-primary/25" />
      <p className="mt-1 line-clamp-2 text-[7px] font-semibold leading-tight text-foreground sm:text-[8px] md:text-[9px]">
        {item.name}
      </p>
      <div className="mt-auto space-y-1">
        <div className="h-px w-3/4 bg-muted-foreground/30" />
        <p className="truncate text-[6px] text-muted-foreground sm:text-[7px]">{item.issuer}</p>
      </div>
    </div>
  )
}

function FeaturedCredential({ item }: { item: CredentialCarouselItem }) {
  const isAward = item.type === "award"

  return (
    <article className="relative w-60 overflow-hidden rounded-2xl border border-primary/30 bg-card/95 p-6 text-left shadow-[0_18px_55px_hsl(var(--background)/0.55),0_0_32px_hsl(var(--primary)/0.12)] backdrop-blur-xl sm:w-72 sm:p-7 md:w-80">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,hsl(var(--primary)/0.15),transparent_58%)]" />
      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className={`grid size-11 shrink-0 place-items-center rounded-xl border ${isAward ? "border-primary/25 bg-primary/10 text-primary" : "border-sky-400/25 bg-sky-400/10 text-sky-300"}`}>
            <CredentialIcon type={item.type} className="size-5" />
          </div>
          <span className="rounded-full border border-border/80 bg-background/50 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {isAward ? "Honor" : "Certification"}
          </span>
        </div>

        <h3 className="text-lg font-semibold leading-snug text-foreground sm:text-xl">{item.name}</h3>
        <p className="mt-2 text-sm font-medium text-primary">{item.issuer}</p>
        <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
        <div className="my-4 h-px bg-gradient-to-r from-primary/45 via-border to-transparent" />
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.description}</p>
      </div>
    </article>
  )
}

export default function ImageFanCarousel({ items }: ImageFanCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState(0)
  const [radius, setRadius] = useState(220)
  const [isPaused, setIsPaused] = useState(false)
  const reducedMotion = useReducedMotion()
  const angleStep = 360 / Math.max(items.length, 1)
  const steps = Math.round(rotation / angleStep)
  const centerIndex = items.length ? ((-steps % items.length) + items.length) % items.length : 0
  const centerItem = items[centerIndex]

  useEffect(() => {
    const updateRadius = () => {
      const width = containerRef.current?.offsetWidth
      if (!width) return
      setRadius(Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, width * RADIUS_WIDTH_RATIO)))
    }

    updateRadius()
    window.addEventListener("resize", updateRadius)
    return () => window.removeEventListener("resize", updateRadius)
  }, [])

  useEffect(() => {
    if (isPaused || reducedMotion || items.length < 2) return

    const interval = window.setInterval(() => {
      setRotation(previous => previous - angleStep)
    }, AUTOPLAY_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [angleStep, isPaused, items.length, reducedMotion])

  const rotateCarousel = useCallback((direction: "previous" | "next") => {
    setRotation(previous => previous + (direction === "previous" ? angleStep : -angleStep))
  }, [angleStep])

  if (!centerItem) return null

  return (
    <div
      role="region"
      aria-label="Certifications and honors carousel"
      className="relative flex w-full flex-col items-center py-4 sm:py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        ref={containerRef}
        className="relative flex h-96 w-[94%] max-w-[56rem] items-center justify-center sm:h-[32rem]"
      >
        <div
          className="relative h-full w-full"
          style={{ perspective: radius * PERSPECTIVE_MULTIPLIER }}
        >
          {items.map((item, index) => {
            const targetAngle = rotation + angleStep * index

            return (
              <motion.div
                key={`${item.name}-${item.date}-${index}`}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: targetAngle }}
                transition={reducedMotion ? { duration: 0 } : springTransition}
              >
                <motion.div
                  className="relative"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{
                    rotateY: -targetAngle,
                    rotateX: RING_TILT_DEG,
                    z: radius,
                  }}
                  transition={reducedMotion ? { duration: 0 } : springTransition}
                >
                  <CredentialThumbnail item={item} />
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={centerIndex}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <FeaturedCredential item={centerItem} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="z-20 mt-2 flex items-center gap-4">
        <button
          type="button"
          aria-label="Previous recognition"
          onClick={() => rotateCarousel("previous")}
          className="vui-icon-frame size-11 rounded-full"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </button>
        <span className="min-w-16 text-center font-mono text-xs tracking-wider text-muted-foreground">
          {String(centerIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          aria-label="Next recognition"
          onClick={() => rotateCarousel("next")}
          className="vui-icon-frame size-11 rounded-full"
        >
          <ChevronRight aria-hidden="true" className="size-5" />
        </button>
      </div>
    </div>
  )
}
