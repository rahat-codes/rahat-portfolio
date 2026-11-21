"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Github, ArrowRight } from "lucide-react"
import { personalInfo } from "../data/personal"

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
    const honeypot = formData.get("website")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          website: honeypot,
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
    <section id="contact" className="section-container relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-24"></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight">Get In Touch</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Open to collaborations, internships, and interesting projects. Let&apos;s build something great together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">Contact Information</h3>
              </div>
              <div className="space-y-5">
                {[
                  {
                    icon: <Mail className="w-5 h-5 text-primary" />,
                    label: "Email",
                    value: personalInfo.email,
                    href: `mailto:${personalInfo.email}`,
                  },
                  {
                    icon: <Phone className="w-5 h-5 text-primary" />,
                    label: "Phone",
                    value: personalInfo.phone,
                    href: `tel:${personalInfo.phone}`,
                  },
                  {
                    icon: <MapPin className="w-5 h-5 text-primary" />,
                    label: "Location",
                    value: personalInfo.location,
                    href: null,
                  },
                  {
                    icon: <Github className="w-5 h-5 text-primary" />,
                    label: "GitHub",
                    value: "rahat-codes",
                    href: personalInfo.github,
                  },
                ].map((item, i) => {
                  const content = (
                    <>
                      <div className="p-2 rounded bg-secondary">{item.icon}</div>
                      <div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
                        <div className="text-sm font-medium text-foreground">{item.value}</div>
                      </div>
                    </>
                  )
                  const className = "flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-secondary transition-all"

                  return item.href ? (
                    <a
                      key={i}
                      href={item.href ?? undefined}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={i} className={`${className} cursor-default`}>
                      {content}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Social links */}
            <div className="rounded-2xl glass-card p-6">
              <h4 className="font-bold text-lg mb-4">Let&apos;s Connect</h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/rahat-codes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="mailto:mhr1760@gmail.com"
                  className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/in/rahat-codes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all opacity-50"
                >
                  <span className="text-sm">in</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl glass-card p-8"
          >
            <h3 className="text-xl font-bold mb-6">Send a Message</h3>

            {status === "success" && (
              <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm">
                {statusMessage}
              </div>
            )}
            {status === "error" && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Honeypot field */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
                aria-hidden="true"
              />

              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  minLength={2}
                  className="w-full px-4 py-3 rounded-xl bg-transparent border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  className="w-full px-4 py-3 rounded-xl bg-transparent border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  maxLength={2000}
                  minLength={10}
                  className="w-full px-4 py-3 rounded-xl bg-transparent border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground/50"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    Sending... <span className="animate-spin ml-2">⟳</span>
                  </>
                ) : (
                  <>
                    Send Message <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
        </motion.div>
    </section>
  )
}
