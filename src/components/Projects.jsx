"use client"

import { useState } from "react"
import { TextGenerateEffect } from './ui/text-generate-effect';

const projectsData = [
  {
    id: 1,
    name: "Bible Wordle",
    description: "Biblical twist on Wordle with scripture-based words",
    url: "https://biblical-wordle.vercel.app/", 
    github: "https://github.com/wrestle-R/Bible-Wordle",
    tech: ["React", "JavaScript", "CSS"],
    image: "/Bible_Wordle.png"
  },
  {
    id: 2,
    name: "Walking Project",
    description: "Survey and report on Mumbai's footpaths with data-driven insights",
    url: "https://wrestle-r.github.io/walking-project/",
    github: "https://github.com/wrestle-R/walking-project",
    tech: ["HTML", "CSS", "JavaScript", "Data Analysis"],
    image: "/The_Walking_Project.png"
  },
  {
    id: 3,
    name: "Trippeer",
    description: "AI travel planner recommending destinations and building itineraries based on preferences",
    url: "https://certifiyo.vercel.app/",
    github: "https://github.com/wrestle-R/certifiyo", 
    tech: ["React", "Node.js", "MongoDB", "OpenWeather API"],
    image: "/Trippeer.png"
  },
  {
    id: 4,
    name: "Varte",
    description: "Secure environment-variable management system with a web UI and a CLI. Includes an npm package `varte` for seamless workflows.",
    url: "https://vathavaran-variables.vercel.app/", 
    github: "https://github.com/wrestle-R/Vathavaran-Variables",
    tech: ["React", "Node.js", "Firebase", "Cloudflare Workers"],
    image: "/Varte.png"
  },
    {
    id: 5,
    name: "Healix",
    description: "Healix is a next-generation telemedicine and digital health platform designed to connect patients and doctors seamlessly.",
    url: "https://healix-med.vercel.app/", 
    github: "https://github.com/wrestle-R/Healix",
    tech: ["React", "Node.js", "MongoDB","Cloudinary","Firebase","A-frame"],
    image: "/Healix.png"
  },
]

export default function Projects() {
  const [activeProject, setActiveProject] = useState(projectsData[0])
  const titleText = "My Projects"

  return (
    <section className="pt-20 px-4 relative z-10" style={{ backgroundColor: 'transparent' }} id="projects">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="mb-8 text-left">
          <TextGenerateEffect
            words={titleText}
            className="text-3xl font-bold"
            duration={2.5}
            filter={true}
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {projectsData.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className={`cursor-pointer py-4 pl-4 rounded-lg border transition-all duration-300`}
              style={
                activeProject.id === project.id
                  ? {
                      backgroundColor: 'oklch(var(--primary))',
                      color: 'oklch(var(--primary-foreground))',
                      borderColor: 'oklch(var(--primary))'
                    }
                  : {
                      backgroundColor: 'oklch(var(--muted))',
                      color: 'oklch(var(--foreground))',
                      borderColor: 'oklch(var(--border))'
                    }
              }
            >
              <h3 className="font-semibold text-sm">{project.name}</h3>
            </div>
          ))}
        </div>

        {/* Active Project Display */}
        <div className="rounded-lg p-6" style={{ backgroundColor: 'oklch(var(--muted))', border: '1px solid oklch(var(--border))' }}>
          {/* Project Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(var(--foreground))' }}>
              {activeProject.name}
            </h2>
            <p className="mb-3" style={{ color: 'oklch(var(--muted-foreground))' }}>
              {activeProject.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {activeProject.tech.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs rounded"
                  style={{ 
                    backgroundColor: 'oklch(var(--background))',
                    border: '1px solid oklch(var(--border))'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project Screenshot */}
          <div className="w-full rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: 'oklch(var(--background))', border: '1px solid oklch(var(--border))' }}>
            {/* Responsive container that maintains aspect ratio */}
            <div className="relative w-full" style={{ aspectRatio: '1332/768' }}>
              <img
                src={activeProject.image}
                alt={`${activeProject.name} Screenshot`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback placeholder if image doesn't exist
                  e.target.src = `https://via.placeholder.com/1332x768/e5e5e5/666666?text=${encodeURIComponent(activeProject.name)}+Preview`;
                }}
              />
            </div>
          </div>

          {/* Project Links */}
          <div className="mt-6 flex gap-3">
            <a
              href={activeProject.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: 'oklch(var(--primary))',
                color: 'oklch(var(--primary-foreground))'
              }}
            >
              Live Demo
            </a>
            <a
              href={activeProject.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg text-sm font-medium transition-colors"
              style={{
                border: '1px solid oklch(var(--border))',
                color: 'oklch(var(--foreground))'
              }}
            >
              View Code
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
