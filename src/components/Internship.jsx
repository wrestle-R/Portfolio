import { useState } from "react"
import { motion as Motion, useReducedMotion } from "framer-motion"
import { BriefcaseBusiness, ChevronDown, ChevronLeft, ChevronRight, LayoutTemplate } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import "./Internship.css"

const experiences = [
  {
    company: "Technode",
    role: "Full Stack Engineer, IoT Solutions",
    period: "Sept 2025 to May 2026",
    start: "Sept 2025",
    year: 2025,
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
    start: "June 2026",
    year: 2026,
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
    period: "Sept 2026 to October 2026",
    start: "Sept 2026",
    year: 2026,
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

const layouts = [
  ["motion", "Motion"],
  ["classic", "Classic timeline"],
  ["alternating", "Alternating timeline"],
  ["cards", "Card grid"],
  ["ledger", "Ledger"],
  ["accordion", "Accordion"],
  ["tabs", "Date tabs"],
  ["spotlight", "Spotlight"],
  ["chapters", "Year chapters"],
  ["compact", "Compact list"],
]

function CompanyLogo({ experience, theme }) {
  return (
    <div className="experience-logo">
      <img
        src={theme === "dark" ? experience.darkModeImage : experience.lightModeImage}
        alt=""
        width="430"
        height="120"
        draggable="false"
      />
    </div>
  )
}

function ExperienceCard({ experience, theme }) {
  return (
    <article className="experience-content">
      <CompanyLogo experience={experience} theme={theme} />
      <div className="experience-identity">
        <div className="experience-name">
          <h3>{experience.company}</h3>
          <span className="experience-intern">Intern</span>
        </div>
        <p className="experience-role">{experience.role}</p>
      </div>

      <ul className="experience-achievements">
        {experience.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}
      </ul>

      <ul className="experience-technologies" aria-label="Technologies">
        {experience.tech.map((tech) => (
          <li key={tech} data-color={techColors[tech]}>{tech}</li>
        ))}
      </ul>
    </article>
  )
}

// The centered card, year backdrop and draggable rail are adapted from beUI's timeline.
function MotionRail({ active, onChange, theme }) {
  const reducedMotion = useReducedMotion()
  const last = experiences.length - 1

  function step(direction) {
    onChange(Math.max(0, Math.min(last, active + direction)))
  }

  return (
    <div className="experience-motion">
      <div className="experience-stage" aria-hidden="true">
        <span className="experience-stage-year">{experiences[active].year}</span>
        <Motion.div
          className="experience-drag"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.4}
          dragMomentum={false}
          dragTransition={reducedMotion ? { bounceStiffness: 1000, bounceDamping: 100 } : undefined}
          onDragEnd={(_, { offset, velocity }) => {
            if (Math.abs(offset.x) > 35) step(-Math.sign(offset.x))
            else if (Math.abs(offset.x) > 10 && Math.abs(velocity.x) > 400) step(-Math.sign(velocity.x))
          }}
        >
          {experiences.map((experience, index) => (
            <div
              key={experience.period}
              className="experience-preview"
              data-active={index === active}
              style={{ "--offset": index - active }}
            >
              <CompanyLogo experience={experience} theme={theme} />
              <span>{experience.start}</span>
            </div>
          ))}
        </Motion.div>
      </div>
      <div className="experience-rail-controls">
        <button type="button" aria-label="Previous role" onClick={() => step(-1)} disabled={active === 0}>
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <RolePicker active={active} onChange={onChange} />
        <button type="button" aria-label="Next role" onClick={() => step(1)} disabled={active === last}>
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

function RolePicker({ active, onChange, showCompany = false }) {
  return (
    <div className="experience-role-picker" role="group" aria-label="Choose a role">
      {experiences.map((experience, index) => (
        <button
          type="button"
          key={experience.period}
          aria-pressed={active === index}
          onClick={() => onChange(index)}
        >
          {showCompany && <strong>{experience.company}</strong>}
          <span>{experience.start}</span>
        </button>
      ))}
    </div>
  )
}

function ExperienceList({ layout, theme, active }) {
  return (
    <ol className="experience-list">
      {experiences.map((experience, index) => (
        <li className="experience-entry" key={experience.period}>
          {layout === "chapters" && experience.year !== experiences[index - 1]?.year && (
            <p className="experience-chapter">{experience.year}</p>
          )}
          {layout === "accordion" ? (
            <details open={index === active}>
              <summary>
                <span className="experience-date">{experience.period}</span>
                <strong>{experience.company}</strong>
                <ChevronDown size={16} aria-hidden="true" />
              </summary>
              <ExperienceCard experience={experience} theme={theme} />
            </details>
          ) : (
            <>
              <p className="experience-date">{experience.period}</p>
              <ExperienceCard experience={experience} theme={theme} />
            </>
          )}
        </li>
      ))}
    </ol>
  )
}

export default function Internship() {
  const { theme } = useTheme()
  const [layout, setLayout] = useState("motion")
  const [active, setActive] = useState(experiences.length - 1)
  const focused = ["motion", "tabs", "spotlight"].includes(layout)

  return (
    <section className="relative z-10 w-full px-4 pt-8 md:pt-10" id="internship" aria-labelledby="experience-heading">
      <div className="experience-panel mx-auto w-full max-w-4xl" data-layout={layout}>
        <header className="experience-header">
          <div className="experience-heading">
            <BriefcaseBusiness aria-hidden="true" strokeWidth={1.6} />
            <h2 id="experience-heading">Professional Experience</h2>
          </div>
          <label className="experience-layout">
            <LayoutTemplate size={16} aria-hidden="true" />
            <span className="sr-only">Experience layout</span>
            <select value={layout} onChange={(event) => setLayout(event.target.value)}>
              {layouts.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </label>
        </header>

        {focused ? (
          <div className="experience-focused">
            {layout === "motion" ? (
              <MotionRail active={active} onChange={setActive} theme={theme} />
            ) : (
              <RolePicker active={active} onChange={setActive} showCompany={layout === "spotlight"} />
            )}
            <div className="experience-selection" aria-live="polite">
              <p className="experience-date">{experiences[active].period}</p>
              <ExperienceCard experience={experiences[active]} theme={theme} />
            </div>
          </div>
        ) : (
          <ExperienceList layout={layout} theme={theme} active={active} />
        )}
      </div>
    </section>
  )
}
