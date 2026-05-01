"use client"

import React, { useState } from "react"
import emailjs from "@emailjs/browser"

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("")

    try {
      const serviceId = import.meta.env.VITE_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_PUBLIC_EMAILJS_PUBLIC_KEY
      emailjs.init(publicKey)

      await emailjs.send(serviceId, templateId, {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        time: new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" }),
      })

      setSubmitStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      console.error("Error sending message:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative z-10 w-full px-4 pt-8 md:pt-10" id="contact" style={{ backgroundColor: "transparent" }}>
      <div className="mx-auto w-full max-w-4xl">
        <article className="w-full overflow-hidden rounded-xl border p-5 md:p-6 transition-colors duration-300 ease-in-out hover:bg-muted/50" style={{ backgroundColor: "oklch(var(--background))", borderColor: "oklch(var(--border))" }}>
          <div className="mb-5 border-b pb-3" style={{ borderColor: "oklch(var(--border))" }}>
            <h2 className="text-2xl font-bold" style={{ color: "oklch(var(--foreground))" }}>Contact</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-2">
              <h3 className="mb-2 text-xl font-semibold" style={{ color: "oklch(var(--foreground))" }}>Let's Connect!</h3>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(var(--muted-foreground))" }}>
                Have an idea, project, or just want to chat? I'd love to hear from you and explore how we can work together to bring your vision to life.
              </p>
              <div className="mt-4 space-y-2 text-sm" style={{ color: "oklch(var(--muted-foreground))" }}>
                <p>Quick responses</p>
                <p>Open to collaborations & projects</p>
              </div>
            </div>

            <div className="md:col-span-3">
              <h4 className="mb-3 text-lg font-semibold" style={{ color: "oklch(var(--foreground))" }}>Send me a message</h4>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={{ backgroundColor: "oklch(var(--background) / 0.8)", borderColor: "oklch(var(--border))", color: "oklch(var(--foreground))" }}
                  placeholder="Your name"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  style={{ backgroundColor: "oklch(var(--background) / 0.8)", borderColor: "oklch(var(--border))", color: "oklch(var(--foreground))" }}
                  placeholder="your.email@example.com"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full resize-none rounded-lg border px-3 py-2 text-sm"
                  style={{ backgroundColor: "oklch(var(--background) / 0.8)", borderColor: "oklch(var(--border))", color: "oklch(var(--foreground))" }}
                  placeholder="Tell me about your project, idea, or just say hello..."
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "oklch(var(--primary))", color: "oklch(var(--primary-foreground))" }}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {submitStatus === "success" && (
                  <p className="text-sm font-medium" style={{ color: "oklch(var(--foreground))" }}>Message sent successfully!</p>
                )}
                {submitStatus === "error" && (
                  <p className="text-sm font-medium" style={{ color: "oklch(var(--destructive))" }}>Failed to send message.</p>
                )}
              </form>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Contact
