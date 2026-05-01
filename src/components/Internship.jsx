"use client"

import { useTheme } from "../context/ThemeContext"

const internshipData = {
  company: "Technode",
  role: "Full Stack Engineer Intern - IoT Solutions",
  period: "Sept 2025 - Present",
  description:
    "Built and maintained IoT dashboard solutions, APIs, and real-time device flows. Worked directly with Hostinger KVM 2 infrastructure, managed VPS deployments, configured and operated an EMQX broker, and integrated MQTT-based communication for live device telemetry and control.",
  highlights: [
    "Managed Hostinger KVM 2 and VPS environments",
    "Set up and operated EMQX broker for production-like IoT flows",
    "Implemented MQTT pipelines for real-time telemetry and control",
    "Developed REST APIs and dashboard modules for monitoring",
  ],
  tech: ["Node.js", "Express", "MQTT", "EMQX", "VPS", "Hostinger KVM 2", "JavaScript", "HTML", "PHP"],
  darkModeImage: "/Techstack/technode_logo.png",
  lightModeImage: "/Techstack/technode_white_bg.png",
}

export default function Internship() {
  const { theme } = useTheme()

  return (
    <section className="relative z-10 w-full px-4 pt-8 md:pt-10" id="internship" style={{ backgroundColor: "transparent" }}>
      <div className="mx-auto w-full max-w-4xl">
        <article
          className="w-full overflow-hidden rounded-xl border p-5 md:p-6 transition-colors duration-300 ease-in-out hover:bg-muted/50"
          style={{ backgroundColor: "oklch(var(--background))", borderColor: "oklch(var(--border))" }}
        >
          <div className="mb-5 flex items-start justify-between gap-3 border-b pb-3" style={{ borderColor: "oklch(var(--border))" }}>
            <h2 className="text-2xl font-bold" style={{ color: "oklch(var(--foreground))" }}>
              Professional Experience
            </h2>
            <span className="rounded-full border px-3 py-1.5 text-xs font-mono" style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--muted-foreground))" }}>
              {internshipData.period}
            </span>
          </div>

          <div className="mb-5 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div
              className="overflow-hidden rounded-lg border px-3 py-2"
              style={{ borderColor: "oklch(var(--border))", backgroundColor: "oklch(var(--background))", width: "170px", aspectRatio: "430/120" }}
            >
              <img
                src={theme === "dark" ? internshipData.darkModeImage : internshipData.lightModeImage}
                alt={`${internshipData.company} Logo`}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold" style={{ color: "oklch(var(--foreground))" }}>
                {internshipData.company}
              </h3>
              <p className="mt-1 text-sm font-medium" style={{ color: "oklch(var(--muted-foreground))" }}>
                {internshipData.role}
              </p>
            </div>
          </div>

          <p className="mb-4 text-sm leading-relaxed md:text-base" style={{ color: "oklch(var(--muted-foreground))" }}>
            {internshipData.description}
          </p>

          <div className="mb-4 grid gap-2">
            {internshipData.highlights.map((item) => (
              <div key={item} className="rounded-md border px-3 py-2 text-sm" style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--foreground))", backgroundColor: "oklch(var(--background) / 0.7)" }}>
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {internshipData.tech.map((tech) => (
              <span
                key={tech}
                className="rounded-md border px-2.5 py-1 text-xs font-medium"
                style={{ borderColor: "oklch(var(--border))", backgroundColor: "oklch(var(--background))", color: "oklch(var(--foreground))" }}
              >
                {tech}
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
