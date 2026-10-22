"use client"

import { useMemo, useState, useSyncExternalStore } from "react"
import { useTheme } from "../context/ThemeContext"

// Previous project entries preserved for future use.
/*
const projectsData = [
  {
    id: 1,
    name: "Pashu Pehchaan",
    description:
      "Pashu Pehchan is a comprehensive tech-driven platform designed to revolutionize livestock management for farmers. It bridges traditional farming and modern technology through digital identity, health monitoring, vaccination planning, and transparent marketplace integration.",
    url: "https://pashu-pehchaan.vercel.app",
    github: "https://github.com/romeirofernandes/tech-fiesta",
    tech: ["MongoDB", "Express", "React", "IoT", "Twilio", "Node.js"],
    imageLight: "/Projects/PashuPehchaan_light.png",
    imageDark: "/Projects/PashuPehcaan_dark.png",
  },
  {
    id: 2,
    name: "Money Council",
    description:
      "Money Council is a fintech-focused platform for students and young professionals that builds a financial profile and generates actionable monthly guidance using multi-agent AI across budgeting, savings, debt, and investments.",
    url: "https://money-council-mirror-family.vercel.app/",
    github: "https://github.com/wrestle-R/Mirror_Family",
    tech: ["React", "Vite", "Node.js", "MongoDB", "Firebase", "Tailwind CSS"],
    imageLight: "/Projects/MoneyCouncil_light.png",
    imageDark: "/Projects/MoneyCouncil_dark.png",
  },
  {
    id: 3,
    name: "NoMoreProxies",
    description:
      "Intelligent student attendance verification with tamper-resistant multi-factor checks including facial recognition, ID-card validation, and fingerprint authentication.",
    url: "https://nomoreproxies-hackcrypt.vercel.app/",
    github: "https://github.com/Hike-12/Team-Pony-HackCrypt",
    tech: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Three.js",
      "Framer Motion",
      "Node.js",
      "MongoDB",
      "Socket.io",
      "JWT",
      "Groq AI",
      "WebAuthn",
      "Tesseract",
      "Chrome Extension",
    ],
    imageLight: "/Projects/NoMoreProxies_light.png",
    imageDark: "/Projects/NoMoreProxies_Dark.png",
  },
  {
    id: 4,
    name: "Varte",
    description:
      "Web app and CLI for syncing environment files with their GitHub repositories.",
    url: "https://vathavaran-variables.vercel.app/",
    github: "https://github.com/wrestle-R/Vathavaran-Variables",
    tech: ["React", "Node.js", "Firebase", "Cloudflare Workers"],
    imageLight: "/Projects/varte_light.png",
    imageDark: "/Projects/Varte_dark.png",
  },
  {
    id: 5,
    name: "Healix",
    description:
      "Next-generation telemedicine and digital health platform connecting patients and doctors with secure, scalable care workflows.",
    url: "https://healix-med.vercel.app/",
    github: "https://github.com/wrestle-R/Healix",
    tech: ["React", "Node.js", "MongoDB", "Cloudinary", "Firebase", "A-Frame"],
    imageLight: "/Projects/Healix_light.png",
    imageDark: "/Projects/Healix_dark.png",
  },
  {
    id: 6,
    name: "Bible Wordle",
    description: "Wordle with words from the Bible.",
    url: "https://biblical-wordle.vercel.app/",
    github: "https://github.com/wrestle-R/Bible-Wordle",
    tech: ["React", "JavaScript", "CSS"],
    imageLight: "/Projects/Bible_Wordle_light.png",
    imageDark: "/Projects/Bible_Wordle_dark.png",
  },
]
*/

const projectsData = [
  {
    id: 1,
    name: "Multi Codex",
    description:
      "I use this to keep my Codex logins and VS Code windows separate.",
    url: "https://github.com/wrestle-R/multi-codex/releases/latest",
    primaryLabel: "Download App",
    github: "https://github.com/wrestle-R/multi-codex",
    tech: ["React", "TypeScript", "Rust", "Tauri", "Vite"],
    imageLight: "/Projects/multi-codex_preview_light.png",
    imageDark: "/Projects/multi-codex_preview_dark.png",
  },
  {
    id: 2,
    name: "Varte",
    description:
      "Web app and CLI for syncing environment files with their GitHub repositories.",
    url: "https://vathavaran-variables.vercel.app/",
    github: "https://github.com/wrestle-R/Vathavaran-Variables",
    tech: ["React", "Node.js", "Firebase", "Cloudflare Workers"],
    imageLight: "/Projects/Varte_preview_light.png",
    imageDark: "/Projects/Varte_preview_dark.png",
  },
  {
    id: 3,
    name: "Bible Wordle",
    description: "Wordle with words from the Bible.",
    url: "https://biblical-wordle.vercel.app/",
    github: "https://github.com/wrestle-R/Bible-Wordle",
    tech: ["React", "JavaScript", "CSS"],
    imageLight: "/Projects/Bible_Wordle_preview_light.png",
    imageDark: "/Projects/Bible_Wordle_preview_dark.png",
  },
  {
    id: 4,
    name: "ASOIAF",
    description:
      "Characters and storylines across Westeros and Essos.",
    url: "https://asoiaf-rdp.vercel.app/",
    github: "https://github.com/wrestle-R/ASOIAF",
    tech: ["React", "JavaScript", "Tailwind CSS", "Vite"],
    imageLight: "/Projects/ASOIAF_preview_light.png",
    imageDark: "/Projects/ASOIAF_preview_dark.png",
  },
  {
    id: 5,
    name: "HyprTrack",
    description:
      "I track my app usage on Hyprland. Everything stays on my machine.",
    url: "https://github.com/wrestle-R/HyprTrack/releases/latest",
    primaryLabel: "Download App",
    github: "https://github.com/wrestle-R/HyprTrack",
    tech: ["React", "TypeScript", "Rust", "Tauri", "Python", "SQLite"],
    imageLight: "/Projects/HyprTrack_preview_light.png",
    imageDark: "/Projects/HyprTrack_preview_dark.png",
  },
]

const subscribeToMobile = (onChange) => {
  const media = window.matchMedia('(max-width: 767px)')
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const getMobileSnapshot = () => window.matchMedia('(max-width: 767px)').matches

export default function Projects() {
  const [activeProject, setActiveProject] = useState(projectsData[0])
  const { theme } = useTheme()
  const isMobile = useSyncExternalStore(subscribeToMobile, getMobileSnapshot, () => false)
  const selectedProject = isMobile && activeProject.id > 3 ? projectsData[0] : activeProject

  const activeImage = useMemo(() => {
    if (theme === "dark") return selectedProject.imageDark || selectedProject.image
    return selectedProject.imageLight || selectedProject.image
  }, [selectedProject, theme])

  return (
    <section className="relative z-10 w-full px-4 pt-8 md:pt-10" id="projects" style={{ backgroundColor: "transparent" }}>
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <article data-portfolio-panel
          className="relative w-full overflow-hidden rounded-xl border p-5 md:p-6 transition-colors duration-300 ease-in-out hover:bg-muted/50"
          style={{ backgroundColor: "oklch(var(--background))", borderColor: "oklch(var(--border))" }}
        >
          <div className="projects-heading mb-5 flex items-start justify-between gap-3 border-b pb-3" style={{ borderColor: "oklch(var(--border))" }}>
            <div>
            <h2 className="text-2xl font-bold" style={{ color: "oklch(var(--foreground))" }}>
              Projects
            </h2>
            <span className="project-count text-xs font-mono" style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--muted-foreground))" }}>
              {isMobile ? 3 : projectsData.length} projects
            </span>
            </div>
            <span className="mobile-sticker-slot" data-mobile-sticker-slot="constellation" aria-hidden="true" />
          </div>

          <div className="project-tabs mb-5 grid grid-cols-3 gap-2 pb-1 md:grid-cols-5" aria-label="Choose a project">
            {/* Mobile: Keep the first three projects in one row */}
            {projectsData.slice(0, 3).map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project)}
                aria-pressed={selectedProject.id === project.id}
                className="md:hidden w-full cursor-pointer rounded-lg border px-2 py-2 text-center text-xs sm:text-sm font-medium transition-colors duration-200 truncate"
                style={
                  selectedProject.id === project.id
                    ? {
                        backgroundColor: "oklch(var(--primary))",
                        color: "oklch(var(--primary-foreground))",
                        borderColor: "oklch(var(--primary))",
                      }
                    : {
                        backgroundColor: "oklch(var(--background))",
                        color: "oklch(var(--foreground))",
                        borderColor: "oklch(var(--border))",
                      }
                }
                title={project.name}
              >
                {project.name}
              </button>
            ))}
            
            {/* Desktop: Show all project tabs without horizontal scroll */}
            {projectsData.map((project) => (
              <button
                key={project.id}
                onClick={() => setActiveProject(project)}
                aria-pressed={selectedProject.id === project.id}
                className="hidden md:block w-full cursor-pointer rounded-lg border px-2 py-2 text-center text-xs lg:text-sm font-medium transition-colors duration-200 truncate"
                style={
                  selectedProject.id === project.id
                    ? {
                        backgroundColor: "oklch(var(--primary))",
                        color: "oklch(var(--primary-foreground))",
                        borderColor: "oklch(var(--primary))",
                      }
                    : {
                        backgroundColor: "oklch(var(--background))",
                        color: "oklch(var(--foreground))",
                        borderColor: "oklch(var(--border))",
                      }
                }
                title={project.name}
              >
                {project.name}
              </button>
            ))}
          </div>

          <div key={selectedProject.id} className="project-showcase">
            <div className="project-copy">
              <h3>{selectedProject.name}</h3>
              <p className="project-description">{selectedProject.description}</p>
              <ul className="project-technologies" aria-label={`${selectedProject.name} technologies`}>
                {selectedProject.tech.map((tech) => <li key={tech}>{tech}</li>)}
              </ul>
              <div className="project-actions">
                <a className="project-primary-action" href={selectedProject.url} target="_blank" rel="noopener noreferrer">
                  {selectedProject.primaryLabel || "Live Demo"} <span aria-hidden="true">↗</span>
                </a>
                <a className="project-code-action" href={selectedProject.github} target="_blank" rel="noopener noreferrer">
                  View Code <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <div className="project-preview">
              <div className="project-preview-bar" aria-hidden="true"><span className="project-preview-dots"><i /><i /><i /></span><span>{selectedProject.name}</span></div>
              <img
                src={activeImage}
                alt={`${selectedProject.name} Preview`}
                width="1332"
                height="768"
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
