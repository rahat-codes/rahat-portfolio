"use client"

import { feature } from "topojson-client"
import type { GeometryCollection, Topology } from "topojson-specification"
import {
  geoGraticule,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
} from "d3-geo"
import { useReducedMotion } from "framer-motion"
import worldAtlasData from "world-atlas/countries-110m.json"
import { useEffect, useId, useMemo, useRef, useState } from "react"

interface WorldAtlasTopology extends Topology {
  objects: {
    countries: GeometryCollection
  }
}

interface GlobeWireframeProps {
  className?: string
  decorative?: boolean
}

const worldAtlas = worldAtlasData as unknown as WorldAtlasTopology
const countryFeatures = feature(worldAtlas, worldAtlas.objects.countries).features

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
        setRotation(([longitude, latitude]) => [(longitude + 0.45) % 360, latitude])
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
    <div ref={globeRef} className={`relative aspect-square w-full max-w-[26rem] ${className}`}>
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
        className={`h-full w-full ${decorative ? "pointer-events-none" : "touch-none"} ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <defs>
          <clipPath id={`${globeId}-clip`}>
            <circle cx="180" cy="180" r="154" />
          </clipPath>
        </defs>
        <circle cx="180" cy="180" r="154" fill="#131313" />
        <g clipPath={`url(#${globeId}-clip)`}>
          <path d={paths.graticule} fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.7" />
          {paths.countries.map((countryPath, index) => (
            <path
              key={index}
              d={countryPath}
              fill="none"
              stroke="hsl(var(--primary) / 0.55)"
              strokeWidth="0.65"
              strokeLinejoin="round"
            />
          ))}
        </g>
        <path d={paths.sphere} fill="none" stroke="hsl(var(--primary) / 0.7)" strokeWidth="1.2" />
        <circle cx="180" cy="180" r="160" fill="none" stroke="hsl(var(--primary) / 0.2)" />
      </svg>
    </div>
  )
}
