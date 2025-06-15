"use client"

import { useState } from "react"
import { TextGenerateEffect } from './ui/text-generate-effect';

const projectsData = [
  {
    id: 1,
    name: "Bible Wordle",
    description: "A biblical twist on the popular Wordle game with scripture-based words",
    url: "https://wordle-nine-snowy.vercel.app/", 
    github: "https://github.com/wrestle-R/Bible-Wordle",
    tech: ["React", "JavaScript", "CSS", "Firebase"],
    image: "./public/Bible_Wordle.png"
  },
  {
    id: 2,
    name: "Watchlist",
    description: "A personal movie and series tracker with genre-based watchlist, predictive search using OMDb API, and real-time data storage. Features an 'Unlisted' panel for quick daily notes across all pages.",
    url: "https://watchlist-a9568.web.app/",
    github: "https://github.com/wrestle-R/watchlist", 
    tech: ["React", "Tailwind", "Supabase", "OMDb API"],
    image: "./public/Watchlist.png"
  },
  {
    id: 3,
    name: "Walking Project",
    description: "Comprehensive survey and report on Mumbai's footpaths with data-driven insights for improving walking conditions",
    url: "https://wrestle-r.github.io/walking-project/",
    github: "https://github.com/wrestle-R/walking-project",
    tech: ["HTML", "CSS", "JavaScript", "Data Analysis"],
    image: "./public/The_Walking_Project.png"
  },
  {
    id: 4,
    name: "Trippeer",
    description: "AI-powered travel planner that recommends destinations and builds full itineraries based on mood, budget, and travel time. Features reverse planning, AI itineraries, dashboard tracking, and real-time integrations.",
    url: "https://certifiyo.vercel.app/",
    github: "https://github.com/wrestle-R/certifiyo", 
    tech: ["React", "Node.js", "MongoDB", "OpenWeather API", "Maps API"],
    image: "./public/Trippeer.png"
  },
  {
    id: 5,
    name: "Clarity AI",
    description: "AI-powered learning companion that transforms PDFs into dynamic tools. Features document summaries, flashcards, quizzes, and Active Recall using Feynman Technique with speech-to-text feedback.",
    url: "https://clarity-ai-virid.vercel.app/", 
    github: "https://github.com/romeirofernandes/ClarityAI",
    tech: ["React", "Node.js", "MongoDB", "Google Gemini AI", "Firebase Auth"],
    image: "./public/Clarity_Ai.png"
  }
]

export default function Projects() {
  const [activeProject, setActiveProject] = useState(projectsData[0])
  const titleText = "My Projects"

  return (
    <section className="py-16 bg-white dark:bg-black px-4" id="projects">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="mb-12 text-center">
          <TextGenerateEffect
            words={titleText}
            className="text-3xl md:text-4xl font-bold text-black dark:text-white"
            duration={2.5}
            filter={true}
          />
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-2">
            Here are some of my featured projects - not all of them, just the ones I'm most proud of!
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {projectsData.map((project) => (
            <div
              key={project.id}
              onClick={() => setActiveProject(project)}
              className={`cursor-pointer p-4 rounded-lg border transition-all duration-300 ${
                activeProject.id === project.id
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                  : "bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
              }`}
            >
              <h3 className="font-semibold text-sm">{project.name}</h3>
            </div>
          ))}
        </div>

        {/* Active Project Display */}
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6">
          {/* Project Info */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
              {activeProject.name}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-3">
              {activeProject.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {activeProject.tech.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white dark:bg-black text-xs rounded border border-neutral-200 dark:border-neutral-800"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project Screenshot */}
          <div className="w-full bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-lg">
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
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
            >
              🚀 Live Demo
            </a>
            <a
              href={activeProject.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white rounded-lg text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              📂 View Code
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
