"use client"

import { BriefcaseBusiness } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import "./Internship.css"

const experiences = [
  {
    company: "Technode",
    role: "Full Stack Engineer, IoT Solutions",
    period: "Sept 2025 to May 2026",
    achievements: [
      "Rebuilt Technode's landing page and main website.",
      "Maintained a React and Java dashboard for monitoring and managing IoT devices.",
    ],
    tech: ["React", "Java", "JavaScript", "IoT"],
    darkModeImage: "/Techstack/technode_logo.png",
    lightModeImage: "/Techstack/technode_white_bg.png",
  },
  {
    company: "NetstellarIOT Solutions",
    role: "Full Stack Developer, IoT Platforms",
    period: "June 2026 to August 2026",
    achievements: [
      "Added queues to process incoming device data.",
      "Raised ingestion throughput from 1,600 to 10,000 requests per minute (6.25 times the previous rate).",
    ],
    tech: ["Queues", "IoT"],
    darkModeImage: "/Techstack/netstellar-iot-dark.svg",
    lightModeImage: "/Techstack/netstellar-iot-light.svg",
  },
  {
    company: "Technode",
    role: "Full Stack Engineer, IoT Solutions",
    period: "Sept 2026 to present",
    achievements: [
      "Built and deployed an MQTT dashboard with Next.js and Docker on a Hostinger VPS.",
    ],
    tech: ["Next.js", "Docker", "MQTT", "VPS", "Hostinger"],
    darkModeImage: "/Techstack/technode_logo.png",
    lightModeImage: "/Techstack/technode_white_bg.png",
  },
]

const techColors = {
  React: "cyan",
  Java: "orange",
  JavaScript: "yellow",
  "Next.js": "neutral",
  Docker: "blue",
  MQTT: "purple",
  VPS: "neutral",
  Hostinger: "purple",
  Queues: "purple",
  IoT: "cyan",
}

export default function Internship() {
  const { theme } = useTheme()

  return (
    <section className="relative z-10 w-full px-4 pt-8 md:pt-10" id="internship" aria-labelledby="experience-heading">
      <div className="experience-panel mx-auto w-full max-w-4xl">
        <header className="experience-header">
          <BriefcaseBusiness aria-hidden="true" strokeWidth={1.6} />
          <h2 id="experience-heading">Professional Experience</h2>
          <span className="mobile-sticker-slot" data-mobile-sticker-slot="resume" aria-hidden="true" />
        </header>

        <ol className="experience-timeline">
          {experiences.map((experience) => (
            <li key={experience.period} className="experience-entry">
              <p className="experience-date">{experience.period}</p>
              <span className="experience-marker" aria-hidden="true">
                <span />
              </span>
              <article className="experience-content">
                <div className="experience-logo">
                  <img
                    src={theme === "dark" ? experience.darkModeImage : experience.lightModeImage}
                    alt={`${experience.company} logo`}
                    width="430"
                    height="120"
                  />
                </div>
                <div className="experience-identity">
                  <div className="experience-name">
                    <h3>{experience.company}</h3>
                    <span className="experience-intern">Intern</span>
                  </div>
                  <p className="experience-role">{experience.role}</p>
                </div>

                <ul className="experience-achievements">
                  {experience.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>

                <ul className="experience-technologies" aria-label="Technologies">
                  {experience.tech.map((tech) => (
                    <li key={tech} data-color={techColors[tech]}>{tech}</li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
