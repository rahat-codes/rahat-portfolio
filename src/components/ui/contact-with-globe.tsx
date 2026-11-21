"use client"

import { feature } from "topojson-client"
import type { GeometryCollection, Topology } from "topojson-specification"
import {
  geoGraticule,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
} from "d3-geo"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  Github,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"
import worldAtlasData from "world-atlas/countries-110m.json"
import {
  type FormEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import SectionHeader from "../SectionHeader"
import { personalInfo } from "../../data/personal"

interface WorldAtlasTopology extends Topology {
  objects: {
    countries: GeometryCollection
  }
}

interface ContactResponse {
  message?: string
  error?: string
  details?: Array<{ field?: string; message: string }>
}

const worldAtlas = worldAtlasData as unknown as WorldAtlasTopology
const countryFeatures = feature(
  worldAtlas,
  worldAtlas.objects.countries,
).features

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: personalInfo.phone,
    href: `tel:${personalInfo.phone.replace(/[^\d+]/g, "")}`,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "rahat-codes",
    href: personalInfo.github,
    external: true,
  },
]

interface GlobeWireframeProps {
  className?: string
  decorative?: boolean
}

export function GlobeWireframe({
  className = "",
  decorative = false,
}: GlobeWireframeProps) {
  const globeRef = useRef<HTMLDivElement>(null)
  const dragPosition = useRef({ x: 0, y: 0 })
  const globeId = useId().replace(/:/g, "")
  const [rotation, setRotation] = useState<[number, number]>([0, 0])
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = globeRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible || isDragging || prefersReducedMotion) return

    let frameId = 0
    let lastUpdate = 0

    const rotate = (time: number) => {
      if (time - lastUpdate >= 33) {
        setRotation(([longitude, latitude]) => [
          (longitude + 0.45) % 360,
          latitude,
        ])
        lastUpdate = time
      }
      frameId = requestAnimationFrame(rotate)
    }

    frameId = requestAnimationFrame(rotate)
    return () => cancelAnimationFrame(frameId)
  }, [isDragging, isVisible, prefersReducedMotion])

  const paths = useMemo(() => {
    const projection = geoOrthographic()
      .scale(154)
      .translate([180, 180])
      .rotate(rotation)
      .clipAngle(90)
    const path = geoPath(projection)
    const asPath = (geometry: GeoPermissibleObjects) => path(geometry) ?? ""

    return {
      sphere: asPath({ type: "Sphere" }),
      graticule: asPath(geoGraticule()()),
      countries: countryFeatures.map(asPath),
    }
  }, [rotation])

  const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(true)
    dragPosition.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging) return

    const deltaX = event.clientX - dragPosition.current.x
    const deltaY = event.clientY - dragPosition.current.y
    dragPosition.current = { x: event.clientX, y: event.clientY }
    setRotation(([longitude, latitude]) => [
      longitude + deltaX * 0.45,
      Math.max(-85, Math.min(85, latitude - deltaY * 0.45)),
    ])
  }

  const handlePointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    const directions: Record<string, [number, number]> = {
      ArrowLeft: [-8, 0],
      ArrowRight: [8, 0],
      ArrowUp: [0, 8],
      ArrowDown: [0, -8],
    }
    const direction = directions[event.key]
    if (!direction) return

    event.preventDefault()
    setRotation(([longitude, latitude]) => [
      longitude + direction[0],
      Math.max(-85, Math.min(85, latitude + direction[1])),
    ])
  }

  return (
    <div
      ref={globeRef}
      className={`relative aspect-square w-full max-w-[26rem] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.2),hsl(198_88%_62%/0.08)_48%,transparent_72%)] blur-3xl"
      />
      <svg
        viewBox="0 0 360 360"
        aria-hidden={decorative || undefined}
        role={decorative ? undefined : "img"}
        aria-label={decorative ? undefined : "Interactive globe. Drag or use the arrow keys to rotate."}
        aria-keyshortcuts={decorative ? undefined : "ArrowLeft ArrowRight ArrowUp ArrowDown"}
        tabIndex={decorative ? undefined : 0}
        onKeyDown={decorative ? undefined : handleKeyDown}
        onPointerDown={decorative ? undefined : handlePointerDown}
        onPointerMove={decorative ? undefined : handlePointerMove}
        onPointerUp={decorative ? undefined : handlePointerUp}
        onPointerCancel={decorative ? undefined : handlePointerUp}
        className={`relative h-full w-full outline-none ${
          decorative ? "pointer-events-none" : "touch-none"
        } focus-visible:drop-shadow-[0_0_8px_hsl(var(--primary)/0.65)] ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <defs>
          <radialGradient id={`${globeId}-fill`} cx="38%" cy="35%" r="70%">
            <stop offset="0%" stopColor="hsl(184 92% 52% / 0.14)" />
            <stop offset="72%" stopColor="hsl(198 88% 62% / 0.04)" />
            <stop offset="100%" stopColor="hsl(225 12% 4% / 0.01)" />
          </radialGradient>
          <clipPath id={`${globeId}-clip`}>
            <circle cx="180" cy="180" r="154" />
          </clipPath>
        </defs>
        <circle cx="180" cy="180" r="154" fill={`url(#${globeId}-fill)`} />
        <g clipPath={`url(#${globeId}-clip)`}>
          <path
            d={paths.graticule}
            fill="none"
            stroke="hsl(var(--primary) / 0.16)"
            strokeWidth="0.7"
          />
          {paths.countries.map((countryPath, index) => (
            <path
              key={index}
              d={countryPath}
              fill="hsl(var(--primary) / 0.035)"
              stroke="hsl(var(--primary) / 0.5)"
              strokeWidth="0.65"
              strokeLinejoin="round"
            />
          ))}
        </g>
        <path
          d={paths.sphere}
          fill="none"
          stroke="hsl(var(--primary) / 0.65)"
          strokeWidth="1.2"
        />
        <circle
          cx="180"
          cy="180"
          r="160"
          fill="none"
          stroke="hsl(var(--primary) / 0.12)"
        />
        <circle cx="280" cy="103" r="3" fill="hsl(198 88% 62%)" />
        <circle
          cx="280"
          cy="103"
          r="8"
          fill="none"
          stroke="hsl(var(--primary) / 0.35)"
        />
      </svg>
    </div>
  )
}

export default function ContactWithGlobe() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    setIsSubmitting(true)
    setStatus("idle")
    setStatusMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      })
      const data = (await response.json()) as ContactResponse

      if (!response.ok) {
        setStatus("error")
        setStatusMessage(
          data.details?.[0]?.message ??
            data.error ??
            "Unable to send your message. Please try again.",
        )
        return
      }

      setStatus("success")
      setStatusMessage(data.message ?? "Message received successfully.")
      form.reset()
    } catch {
      setStatus("error")
      setStatusMessage("Network error. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return (
    <section id="contact" className="section-container relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-20 size-[28rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative z-10">
        <SectionHeader
          eyebrow="07 / Contact"
          title="Get In Touch"
          description="Open to collaborations, internships, and interesting projects. Let's build something great together."
          align="center"
          className="mx-auto mb-12 max-w-3xl sm:mb-16 [&_h2]:text-3xl sm:[&_h2]:text-4xl lg:[&_h2]:text-5xl"
        />

        <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65 }}
            className="space-y-6"
          >
            <div className="rounded-2xl glass-card p-6 sm:p-8">
              <h3 className="text-xl font-bold text-foreground">Contact Information</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Reach out directly or send a message using the form.
              </p>
              <div className="mt-6 space-y-3">
                {contactLinks.map(({ icon: Icon, label, value, href, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-xl border border-border p-3 transition-colors hover:border-primary/50 hover:bg-secondary sm:p-4"
                  >
                    <span className="vui-icon-frame size-10 shrink-0 rounded-xl">
                      <Icon aria-hidden="true" className="size-4 text-primary" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                        {label}
                      </span>
                      <span className="block break-all text-sm font-medium text-foreground">
                        {value}
                      </span>
                    </span>
                  </a>
                ))}
                <div className="flex items-center gap-4 rounded-xl border border-border p-3 sm:p-4">
                  <span className="vui-icon-frame size-10 shrink-0 rounded-xl">
                    <MapPin aria-hidden="true" className="size-4 text-primary" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                      Location
                    </span>
                    <span className="block text-sm font-medium text-foreground">
                      {personalInfo.location}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="rounded-2xl glass-card p-6 sm:p-8"
          >
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground">Send a Message</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill out the form and I&apos;ll get back to you.
              </p>
            </div>

            {status !== "idle" && (
              <p
                role={status === "error" ? "alert" : "status"}
                aria-live={status === "error" ? "assertive" : "polite"}
                className={`mb-5 rounded-xl border p-4 text-sm ${
                  status === "success"
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "border-red-500/20 bg-red-500/10 text-red-500"
                }`}
              >
                {statusMessage}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div
                aria-hidden="true"
                className="absolute -left-[10000px] h-px w-px overflow-hidden"
              >
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="contact-name" className="mb-2 block text-sm font-medium">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  className="w-full rounded-xl border border-border bg-transparent px-4 py-3 outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-2 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  className="w-full rounded-xl border border-border bg-transparent px-4 py-3 outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  minLength={10}
                  maxLength={2000}
                  className="w-full resize-y rounded-xl border border-border bg-transparent px-4 py-3 outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    Sending...
                    <LoaderCircle aria-hidden="true" className="ml-2 size-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight aria-hidden="true" className="ml-2 size-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
