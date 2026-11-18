"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Github } from "lucide-react"
import { personalInfo } from "../data/personal"
import { sanitizeHtml } from "../lib/security"

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus("idle")

    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string
    const honeypot = formData.get("website") // honeypot field

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitizeHtml(name),
          email: sanitizeHtml(email),
          message: sanitizeHtml(message),
          website: honeypot, // honeypot - bots fill this
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setStatusMessage(data.message || "Message sent successfully!")
        ;(e.currentTarget as HTMLFormElement).reset()
      } else {
        setStatus("error")
        setStatusMessage(
          data.error || data.details?.[0]?.message || "Failed to send message.",
        )
      }
    } catch {
      setStatus("error")
      setStatusMessage("Network error. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return (
    <section id="contact" className="py-20 dark:bg-dark-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Get In Touch</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Open to collaborations, internships, and interesting projects. Let's build something great together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-5">
                {[
                  {
                    icon: <Mail className="w-5 h-5 text-accent-400" />,
                    label: "Email",
                    value: personalInfo.email,
                    href: `mailto:${personalInfo.email}`,
                  },
                  {
                    icon: <Phone className="w-5 h-5 text-accent-400" />,
                    label: "Phone",
                    value: personalInfo.phone,
                    href: `tel:${personalInfo.phone}`,
                  },
                  {
                    icon: <MapPin className="w-5 h-5 text-accent-400" />,
                    label: "Location",
                    value: personalInfo.location,
                    href: null,
                  },
                  {
                    icon: <Github className="w-5 h-5 text-accent-400" />,
                    label: "GitHub",
                    value: "rahat-codes",
                    href: personalInfo.github,
                  },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target={item.href && item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/10 hover:border-accent-400/50 transition-colors ${item.href ? "" : "cursor-default"}`}
                  >
                    <div className="p-2 rounded bg-white/5">{item.icon}</div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
                      <div className="text-sm font-medium">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-white/10 bg-white/5 p-8"
          >
            <h3 className="text-xl font-bold mb-6">Send a Message</h3>

            {status === "success" && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                {statusMessage}
              </div>
            )}
            {status === "error" && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field - hidden from users, filled by bots */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
                aria-hidden="true"
              />

              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  minLength={2}
                  className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 focus:border-accent-400 focus:outline-none transition-colors placeholder:text-muted-foreground/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 focus:border-accent-400 focus:outline-none transition-colors placeholder:text-muted-foreground/50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  maxLength={2000}
                  minLength={10}
                  className="w-full px-4 py-2 rounded bg-white/5 border border-white/10 focus:border-accent-400 focus:outline-none transition-colors placeholder:text-muted-foreground/50"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-accent-500 hover:bg-accent-400 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent-500/20"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
