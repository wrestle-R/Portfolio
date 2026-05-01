"use client"

import { useEffect, useState } from "react"

const achievementsData = [
  {
    id: 1,
    title: "Coherence Hackathon",
    project: "ScreenSmart",
    description: "AI hiring assistant for resume screening and bias-free ranking.",
    teammates: ["Liza", "Romeiro", "Gavin"],
    host: "Vartak College of Engineering",
    duration: "24-hour offline",
    image: "/Projects/Coherence.jpg",
    type: "Runners Up",
  },
  {
    id: 2,
    title: "Certifiyo Hackathon",
    project: "Trippeer - AI Travel Planner",
    description: "AI platform recommending destinations based on mood, budget, and time.",
    teammates: ["Aliqyaan", "Aditya", "Romeiro"],
    host: "Certifiyo",
    duration: "12-hour online",
    image: "/Projects/Certifiyo.jpg",
    type: "Second Runners Up",
  },
  {
    id: 3,
    title: "Neural Nexus 2.0",
    project: "AI-Powered Trekking Platform",
    description:
      "AI and Data Science driven trekking website and mobile app for intelligent trek recommendations, safety insights, and route visualizations.",
    teammates: ["Shravya", "Gavin", "Aliqyaan"],
    host: "Vijaybhoomi University",
    duration: "7 day hybrid",
    image: "/Projects/Karjat.jpeg",
    type: "Second Runners Up",
  },
]

export default function Achievements() {
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [selectedImage])

  return (
    <section className="relative z-10 w-full px-4 pt-8 md:pt-10" id="achievements" style={{ backgroundColor: "transparent" }}>
      <div className="mx-auto w-full max-w-4xl">
        <article className="w-full overflow-hidden rounded-xl border p-5 md:p-6" style={{ backgroundColor: "oklch(var(--background))", borderColor: "oklch(var(--border))" }}>
          <div className="mb-5 border-b pb-3" style={{ borderColor: "oklch(var(--border))" }}>
            <h2 className="text-2xl font-bold" style={{ color: "oklch(var(--foreground))" }}>
              Achievements
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {achievementsData.map((achievement) => (
              <div key={achievement.id} className="rounded-xl border p-4" style={{ borderColor: "oklch(var(--border))", backgroundColor: "oklch(var(--background) / 0.72)" }}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full border px-2.5 py-1 text-xs font-medium" style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--foreground))" }}>
                    {achievement.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold" style={{ color: "oklch(var(--foreground))" }}>{achievement.title}</h3>
                <p className="mt-1 text-sm font-medium" style={{ color: "oklch(var(--foreground))" }}>{achievement.project}</p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "oklch(var(--muted-foreground))" }}>{achievement.description}</p>

                <div className="mt-3 space-y-1 text-sm" style={{ color: "oklch(var(--muted-foreground))" }}>
                  <p><span className="font-medium" style={{ color: "oklch(var(--foreground))" }}>Host:</span> {achievement.host}</p>
                  <p><span className="font-medium" style={{ color: "oklch(var(--foreground))" }}>Duration:</span> {achievement.duration}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {achievement.teammates.map((teammate) => (
                    <span key={teammate} className="rounded-md border px-2 py-1 text-xs" style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--foreground))" }}>
                      {teammate}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedImage(achievement.image)}
                  className="mt-4 w-full overflow-hidden rounded-lg border"
                  style={{ borderColor: "oklch(var(--border))" }}
                >
                  <img src={achievement.image} alt={`${achievement.title} Certificate`} className="h-auto w-full object-cover" />
                </button>
              </div>
            ))}
          </div>
        </article>

        {selectedImage && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 p-4" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Certificate" className="max-h-[85vh] max-w-[85vw] rounded-lg border" style={{ borderColor: "oklch(var(--border))" }} />
          </div>
        )}
      </div>
    </section>
  )
}
