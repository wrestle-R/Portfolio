"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(null)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % achievementsData.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + achievementsData.length) % achievementsData.length)
  }

  const handleTouchEnd = (event) => {
    if (touchStart === null) return

    const touchDistance = touchStart - event.changedTouches[0].clientX
    const minSwipeDistance = 45

    if (touchDistance > minSwipeDistance) handleNext()
    if (touchDistance < -minSwipeDistance) handlePrev()

    setTouchStart(null)
  }

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
          <div className="mb-5 flex items-center justify-between gap-3 border-b pb-3" style={{ borderColor: "oklch(var(--border))" }}>
            <h2 className="text-2xl font-bold" style={{ color: "oklch(var(--foreground))" }}>
              Achievements
            </h2>
            <span className="rounded-full border px-3 py-1.5 text-xs font-mono md:hidden" style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--muted-foreground))" }}>
              {currentIndex + 1}/{achievementsData.length}
            </span>
          </div>

          {/* Desktop View grid */}
          <div className="hidden md:grid grid-cols-2 gap-4">
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
                  className="group mt-4 w-full overflow-hidden rounded-lg border"
                  style={{ borderColor: "oklch(var(--border))", backgroundColor: "oklch(var(--muted) / 0.35)" }}
                >
                  <span className="flex aspect-[4/3] w-full items-center justify-center p-2">
                    <img
                      src={achievement.image}
                      alt={`${achievement.title} Certificate`}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div
            className="relative w-full md:hidden"
            onTouchStart={(event) => setTouchStart(event.touches[0].clientX)}
            onTouchEnd={handleTouchEnd}
          >
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: "oklch(var(--border))", backgroundColor: "oklch(var(--background) / 0.76)" }}>
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {achievementsData.map((achievement) => (
                  <div key={achievement.id} className="w-full min-w-0 shrink-0 p-3">
                    <div className="flex min-h-[520px] flex-col">
                      <div>
                        <div className="min-w-0">
                          <span className="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em]" style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--muted-foreground))" }}>
                            {achievement.type}
                          </span>
                          <h3 className="mt-3 text-xl font-bold leading-tight" style={{ color: "oklch(var(--foreground))" }}>
                            {achievement.title}
                          </h3>
                          <p className="mt-1 text-sm font-semibold" style={{ color: "oklch(var(--foreground))" }}>
                            {achievement.project}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 break-words text-sm leading-relaxed" style={{ color: "oklch(var(--muted-foreground))" }}>
                        {achievement.description}
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="min-w-0 rounded-lg border px-3 py-2" style={{ borderColor: "oklch(var(--border))", backgroundColor: "oklch(var(--muted) / 0.22)" }}>
                          <p className="font-medium" style={{ color: "oklch(var(--foreground))" }}>Host</p>
                          <p className="mt-1 break-words leading-snug" style={{ color: "oklch(var(--muted-foreground))" }}>{achievement.host}</p>
                        </div>
                        <div className="min-w-0 rounded-lg border px-3 py-2" style={{ borderColor: "oklch(var(--border))", backgroundColor: "oklch(var(--muted) / 0.22)" }}>
                          <p className="font-medium" style={{ color: "oklch(var(--foreground))" }}>Duration</p>
                          <p className="mt-1 break-words leading-snug" style={{ color: "oklch(var(--muted-foreground))" }}>{achievement.duration}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {achievement.teammates.map((teammate) => (
                          <span key={teammate} className="rounded-md border px-2 py-1 text-xs font-medium" style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--foreground))", backgroundColor: "oklch(var(--background))" }}>
                            {teammate}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedImage(achievement.image)}
                        className="group mt-4 flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-lg border p-2"
                        style={{ borderColor: "oklch(var(--border))", backgroundColor: "oklch(var(--muted) / 0.18)" }}
                        aria-label={`Open ${achievement.title} certificate`}
                      >
                        <span className="flex h-full min-h-[190px] w-full min-w-0 items-center justify-center">
                          <img
                            src={achievement.image}
                            alt={`${achievement.title} Certificate`}
                            className="h-auto max-h-[260px] w-auto max-w-full rounded-sm object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                            loading="lazy"
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3" aria-label="Achievement navigation">
              <button
                onClick={handlePrev}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors active:scale-95"
                style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--foreground))", backgroundColor: "oklch(var(--background))" }}
                aria-label="Previous achievement"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <div className="flex items-center gap-2" aria-label="Achievement slides">
                {achievementsData.map((achievement, index) => (
                  <button
                    key={achievement.id}
                    onClick={() => setCurrentIndex(index)}
                    className="h-2 rounded-full transition-all duration-200"
                    style={{
                      width: currentIndex === index ? "1.5rem" : "0.5rem",
                      backgroundColor: currentIndex === index ? "oklch(var(--foreground))" : "oklch(var(--border))",
                    }}
                    aria-label={`Show achievement ${index + 1}`}
                    aria-current={currentIndex === index ? "true" : undefined}
                  />
                ))}
              </div>
              <button
                onClick={handleNext}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors active:scale-95"
                style={{ borderColor: "oklch(var(--foreground))", color: "oklch(var(--primary-foreground))", backgroundColor: "oklch(var(--primary))" }}
                aria-label="Next achievement"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </article>

        {selectedImage && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-black/85 p-2 sm:p-4" onClick={() => setSelectedImage(null)}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-black/60 text-white transition-colors hover:bg-black sm:right-4 sm:top-4 sm:h-10 sm:w-10"
              style={{ borderColor: "oklch(var(--border))" }}
              aria-label="Close certificate preview"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <img
              src={selectedImage}
              alt="Certificate"
              className="h-auto max-h-[calc(100dvh-1rem)] w-auto max-w-[calc(100vw-1rem)] rounded-lg border bg-white object-contain sm:max-h-[calc(100dvh-2rem)] sm:max-w-[calc(100vw-2rem)]"
              style={{ borderColor: "oklch(var(--border))" }}
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        )}
      </div>
    </section>
  )
}
