"use client"

import React, { useState } from "react"
import emailjs from "@emailjs/browser"
import "./contact-sticker.css"
import { useHydrated } from "../lib/use-hydrated"

const Contact = () => {
  const interactive = useHydrated()
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
        <article data-portfolio-panel className="w-full rounded-xl border p-4 md:p-5 transition-colors duration-300 ease-in-out hover:bg-muted/50" style={{ backgroundColor: "oklch(var(--background))", borderColor: "oklch(var(--border))" }}>
          <div className="mb-3 border-b pb-2" style={{ borderColor: "oklch(var(--border))" }}>
            <h2 className="text-xl font-bold" style={{ color: "oklch(var(--foreground))" }}>Contact</h2>
          </div>

          <div className="grid items-start gap-4 md:grid-cols-5 md:gap-6">
            <div className="md:col-span-2 text-sm leading-relaxed" style={{ color: "oklch(var(--muted-foreground))" }}>
              <p>Have something in mind?</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 md:flex-col">
                <a className="break-all underline-offset-4 hover:underline" href="mailto:russeldanielpaul@gmail.com">russeldanielpaul@gmail.com</a>
                <a className="underline-offset-4 hover:underline" href="https://github.com/wrestle-R">GitHub: wrestle-R</a>
              </div>
            </div>

            <form id="contact-form" onSubmit={handleSubmit} className="grid gap-2 md:col-span-3" aria-label="Send me a message">
              <div className="grid gap-2 min-[480px]:grid-cols-2">
                <div>
                  <label className="sr-only" htmlFor="contact-name">Your name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-11 w-full rounded-lg border px-3 py-2 text-base sm:text-sm"
                    style={{ backgroundColor: "oklch(var(--background) / 0.8)", borderColor: "oklch(var(--border))", color: "oklch(var(--foreground))" }}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="sr-only" htmlFor="contact-email">Email address</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-11 w-full rounded-lg border px-3 py-2 text-base sm:text-sm"
                    style={{ backgroundColor: "oklch(var(--background) / 0.8)", borderColor: "oklch(var(--border))", color: "oklch(var(--foreground))" }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="contact-message-row">
              <label className="sr-only" htmlFor="contact-message">Your message</label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={2}
                className="min-h-[72px] w-full resize-y rounded-lg border px-3 py-2 text-base sm:text-sm"
                style={{ backgroundColor: "oklch(var(--background) / 0.8)", borderColor: "oklch(var(--border))", color: "oklch(var(--foreground))" }}
                placeholder="What did you have in mind?"
              />
              <div className="sticker-inline contact-send-sticker" data-sticker-inline data-sticker-id="send-message">
                <button
                  type="submit"
                  form="contact-form"
                  disabled={!interactive || isSubmitting}
                  className="send-message-sticker"
                  aria-label="Send message"
                  aria-describedby="contact-send-help"
                  aria-busy={isSubmitting}
                >
                  <svg className="send-message-sticker__icon" viewBox="0 0 32 26" fill="none" aria-hidden="true"><path d="m3 11 26-8-8 21-6-9-12-4Z" fill="#deedf3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m15 15 14-12M15 15l-1 6 4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>{isSubmitting ? "Sending..." : "Send message"}</span>
                </button>
              </div>
              </div>
              <span className="sr-only" id="contact-send-help">Press and hold to move this sticker on a phone. Tap or press Enter to send your message.</span>
              <noscript><p className="text-sm">You can reach me at <a href="mailto:russeldanielpaul@gmail.com" className="underline">russeldanielpaul@gmail.com</a>.</p></noscript>
              {submitStatus && <p role="status" className="text-sm" style={{ color: submitStatus === "error" ? "oklch(var(--destructive))" : "oklch(var(--foreground))" }}>{submitStatus === "success" ? "Message sent." : "Couldn't send your message. Please try again."}</p>}
            </form>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Contact
