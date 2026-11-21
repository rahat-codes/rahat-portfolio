"use client"

import { useEffect, useRef } from "react"

export default function NoirMeshBackground() {
  const meshRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mesh = meshRef.current
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)")

    if (!mesh || !supportsHover.matches) {
      return
    }

    let frame = 0
    let pointerX = 0
    let pointerY = 0

    const hideMesh = () => {
      if (frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }

      mesh.dataset.active = "false"
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return
      }

      pointerX = event.clientX
      pointerY = event.clientY

      if (frame) {
        return
      }

      frame = window.requestAnimationFrame(() => {
        mesh.style.setProperty("--noir-x", `${pointerX}px`)
        mesh.style.setProperty("--noir-y", `${pointerY}px`)
        mesh.dataset.active = "true"
        frame = 0
      })
    }

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        hideMesh()
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerout", handlePointerOut)
    window.addEventListener("blur", hideMesh)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerout", handlePointerOut)
      window.removeEventListener("blur", hideMesh)
      hideMesh()
    }
  }, [])

  return <div ref={meshRef} className="noir-mesh-background" aria-hidden="true" data-active="false" />
}
