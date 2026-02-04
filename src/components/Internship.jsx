"use client"

import { TextGenerateEffect } from './ui/text-generate-effect';
import { useTheme } from '../context/ThemeContext';

const internshipData = {
  company: "Technode",
  position: "Intern IOT Solutions",
  role: "Full Stack Engineer",
  project: "IOT Dashboard",
  description: "Working on comprehensive IoT dashboard solutions with full-stack development, including building REST-based APIs and real-time device communication systems. Developed multiple dashboards for different use cases, supported device monitoring and control, and contributed to improving and enhancing the main company website.",
  highlights: [
    "REST APIs",
    "MQTT real-time backend",
    "Admin dashboard",
    "IoT monitoring & control",
    "Website improvements",
  ],
  tech: ["HTML", "JavaScript", "PHP", "Node.js", "Express"],
  logo: "/technode_logo.png",
  darkModeImage: "/technode_logo.png",
  lightModeImage: "/technode_white_bg.png"
}

export default function Internship() {
  const titleText = "Professional Experience"
  const { theme } = useTheme();

  return (
    <section className="relative z-10 pt-20 px-4" style={{ backgroundColor: 'transparent' }} id="internship">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="mb-12 text-left">
          <TextGenerateEffect
            words={titleText}
            className="text-3xl font-bold"
            duration={2.5}
            filter={true}
          />
        </div>

        {/* Internship Card */}
        <div
          className="rounded-xl p-6 md:p-8 shadow-lg"
          style={{
            backgroundColor: 'oklch(var(--muted) / 0.6)',
            border: '1px solid oklch(var(--border))',
          }}
        >
          {/* Company Header with Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start items-center gap-5 sm:gap-6 mb-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div
                className="overflow-hidden"
                style={{
                  width: '160px',
                  maxWidth: '60vw',
                  aspectRatio: '430/120',
                }}
              >
                <img
                  src={theme === 'dark' ? internshipData.darkModeImage : internshipData.lightModeImage}
                  alt={`${internshipData.company} Logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback if logo doesn't exist - show company initial
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl font-bold" style="color: oklch(var(--primary))">${internshipData.company[0]}</div>`;
                  }}
                />
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 flex-wrap mb-2 justify-center sm:justify-between sm:flex-nowrap">
                {/* <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'oklch(var(--foreground))' }}>
                  {internshipData.company}
                </h2> */}
                <span
                  className="px-3 py-1 mt-3 text-sm rounded-full font-medium"
                  style={{ 
                    backgroundColor: 'oklch(var(--primary) / 0.2)',
                    color: 'oklch(var(--primary))',
                    border: '1px solid oklch(var(--primary) / 0.3)'
                  }}
                >
                  {internshipData.role}
                </span>
                <span
                  className="px-3 py-1 text-sm rounded-full font-medium"
                  style={{
                    backgroundColor: 'oklch(var(--muted))',
                    color: 'oklch(var(--muted-foreground))',
                    border: '1px solid oklch(var(--border))'
                  }}
                >
                  Sept 2025 - Present
                </span>
              </div>
              <div className="text-center sm:text-left">
                {/* <p className="text-lg font-semibold" style={{ color: 'oklch(var(--foreground))' }}>
                  {internshipData.project}
                </p> */}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="leading-relaxed" style={{ color: 'oklch(var(--muted-foreground))' }}>
            {internshipData.description}
          </p>

          {/* Highlights */}
          {/* <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {internshipData.highlights.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs rounded-full font-medium"
                  style={{
                    backgroundColor: 'oklch(var(--background))',
                    border: '1px solid oklch(var(--border))',
                    color: 'oklch(var(--foreground))',
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div> */}

          <div className="mt-3" style={{ borderTop: '1px solid oklch(var(--border))' }} />

          {/* Tech Stack */}
          <div className="mt-3">
            <h3 className="text-base font-semibold mb-3" style={{ color: 'oklch(var(--foreground))' }}>
              Technologies Used:
            </h3>
            <div className="flex flex-wrap gap-2">
              {internshipData.tech.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm rounded-md font-medium"
                  style={{ 
                    backgroundColor: 'oklch(var(--background))',
                    border: '1px solid oklch(var(--border))',
                    color: 'oklch(var(--foreground))'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
