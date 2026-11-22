"use client"

import { useCallback, useState, type FormEvent } from "react"
import SectionHeader from "../SectionHeader"
import { GlobeWireframe } from "./GlobeWireframe"
import { personalInfo } from "../../data/personal"

interface ContactResponse {
  message?: string
  error?: string
  details?: Array<{ field?: string; message: string }>
}

const contactLinks = [
  { label: "Email", value: personalInfo.email, href: `mailto:${personalInfo.email}` },
  { label: "Phone", value: personalInfo.phone, href: `tel:${personalInfo.phone.replace(/[^\d+]/g, "")}` },
  { label: "GitHub", value: "rahat-codes", href: personalInfo.github, external: true },
]

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
    <section id="contact" className="section-container">
      <SectionHeader title="Contact" />
      <div className="grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <GlobeWireframe className="mx-auto mb-8 max-w-sm" />
          <ul className="space-y-5">
            {contactLinks.map((item) => (
              <li key={item.label}>
                <span className="block text-sm text-muted-foreground">{item.label}</span>
                <a
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="break-all text-foreground transition-colors hover:text-primary"
                >
                  {item.value}
                </a>
              </li>
            ))}
            <li>
              <span className="block text-sm text-muted-foreground">Location</span>
              <span>{personalInfo.location}</span>
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <label htmlFor="contact-name" className="mb-2 block text-sm">Name</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              className="w-full border-0 border-b border-input bg-transparent px-0 py-3 outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-0"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-2 block text-sm">Email</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              required
              maxLength={254}
              autoComplete="email"
              className="w-full border-0 border-b border-input bg-transparent px-0 py-3 outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-0"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-2 block text-sm">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              minLength={10}
              maxLength={2000}
              className="w-full resize-y border-0 border-b border-input bg-transparent px-0 py-3 outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-0"
              placeholder="Your message"
            />
          </div>
          {status !== "idle" && (
            <p
              role={status === "error" ? "alert" : "status"}
              aria-live={status === "error" ? "assertive" : "polite"}
              className={status === "error" ? "text-sm text-red-400" : "text-sm text-primary"}
            >
              {statusMessage}
            </p>
          )}
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  )
}
