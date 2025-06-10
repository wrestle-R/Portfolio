"use client"

import { useState, useEffect, useRef } from "react"

// Tech stack data with SVG icons
const techStackData = [
  {
    id: 1,
    name: "React",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89s-.84 1.85-1.87 1.85S10.13 13.04 10.13 12s.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 0 1-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9s-1.17 0-1.71.03c-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03s1.17 0 1.71-.03c.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.37 1.95-1.47-.84-1.63-3.05-1.01-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1.01-5.63 1.46-.84 3.45.12 5.37 1.95 1.92-1.83 3.91-2.79 5.37-1.95z" />
      </svg>
    ),
    description: "A JavaScript library for building user interfaces",
    projects: ["Portfolio Website", "E-commerce Dashboard", "Social Media App"],
    experience: "3 years",
  },
  {
    id: 2,
    name: "Node.js",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.46 1.71.46.85 0 1.31-.52 1.31-1.36V9.47c0-.16-.14-.3-.31-.3H7.18c-.17 0-.31.14-.31.3v8.58c0 .64-.69 1.28-1.8.73l-1.95-1.12c-.19-.11-.31-.3-.31-.52V8.71c0-.21.11-.41.31-.52l7.44-4.3c.19-.11.42-.11.61 0l7.44 4.3c.19.11.31.3.31.52v8.58c0 .21-.11.41-.31.52l-7.44 4.3c-.19.11-.42.11-.61 0l-1.83-1.05c-.11-.06-.24-.06-.32 0-.27.18-.33.21-.58.33-.09.04-.24.11-.02.21l2.39 1.36c.24.13.50.2.78.2s.54-.07.78-.2l7.44-4.3c.48-.28.78-.8.78-1.36V8.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.51-.2-.78-.2z" />
      </svg>
    ),
    description: "JavaScript runtime built on Chrome's V8 JavaScript engine",
    projects: ["RESTful API", "Authentication Service", "Real-time Chat Application"],
    experience: "2 years",
  },
  {
    id: 3,
    name: "TypeScript",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
      </svg>
    ),
    description: "Strongly typed programming language that builds on JavaScript",
    projects: ["Enterprise CRM", "Financial Dashboard", "Task Management System"],
    experience: "1.5 years",
  },
  {
    id: 4,
    name: "MongoDB",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z" />
      </svg>
    ),
    description: "NoSQL database program that uses JSON-like documents",
    projects: ["User Management System", "Content Management System", "Analytics Platform"],
    experience: "2 years",
  },
  {
    id: 5,
    name: "AWS",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335c-.072.048-.144.071-.2.071-.08 0-.16-.04-.239-.112a2.417 2.417 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.383-.591-.894-.591-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.27 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.030-.375-1.277-.255-.248-.686-.367-1.297-.367-.279 0-.567.032-.863.104-.296.064-.583.16-.863.28-.128.055-.224.08-.279.08-.104 0-.16-.08-.16-.231v-.367c0-.12.016-.208.056-.256.04-.048.112-.096.2-.144.279-.144.614-.264 1.005-.36.391-.095.807-.144 1.246-.144.95 0 1.644.216 2.091.647.439.431.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.503.128-.144.224-.304.272-.48.047-.175.08-.375.08-.598v-.287a6.45 6.45 0 00-.735-.136 6.538 6.538 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.295.838.295zm6.41.862c-.135 0-.224-.024-.279-.08-.056-.048-.104-.151-.151-.28l-1.669-5.492c-.047-.159-.071-.263-.071-.32 0-.127.064-.2.191-.2h.783c.143 0 .239.025.287.08.056.048.104.151.151.28l1.19 4.696 1.102-4.696c.04-.159.088-.231.151-.28.056-.055.151-.08.279-.08h.638c.143 0 .239.025.287.08.056.048.112.151.151.28l1.118 4.744 1.222-4.744c.048-.159.104-.231.151-.28.056-.055.151-.08.287-.08h.742c.127 0 .2.063.2.2 0 .04-.008.08-.016.127-.008.048-.024.111-.048.2L15.583 11.2c-.047.159-.095.231-.151.28-.056.055-.151.08-.279.08h-.687c-.143 0-.239-.024-.287-.08-.056-.055-.112-.151-.151-.28l-1.102-4.567-1.086 4.567c-.04.159-.095.231-.151.28-.056.055-.151.08-.287.08h-.686zm9.422.199c-.375 0-.718-.04-1.038-.127-.32-.088-.57-.2-.75-.336-.111-.087-.184-.183-.2-.28-.016-.032-.024-.08-.024-.14v-.38c0-.152.064-.231.183-.231.048 0 .096.008.151.032.048.016.12.048.2.08.271.111.559.2.862.255.304.056.606.08.91.08.48 0 .854-.088 1.118-.264.264-.176.398-.423.398-.742 0-.215-.08-.406-.24-.566-.159-.159-.462-.304-.917-.43l-1.315-.415c-.663-.2-1.14-.494-1.45-.886-.32-.391-.479-.830-.479-1.324 0-.383.08-.718.24-1.005.159-.287.375-.535.646-.742.272-.208.583-.368.942-.48.36-.112.734-.168 1.142-.168.16 0 .32.008.49.032.159.024.32.056.47.088.144.040.28.08.415.127.135.048.24.096.32.144.111.064.191.135.24.2.047.063.071.159.071.271v.335c0 .152-.063.231-.183.231-.064 0-.159-.024-.287-.08-.415-.183-.878-.272-1.38-.272-.431 0-.774.072-1.03.216-.255.144-.383.367-.383.67 0 .215.087.398.255.550.168.152.479.304.926.438l1.286.415c.654.2 1.118.479 1.405.838.287.36.43.775.43 1.245 0 .391-.08.747-.24 1.062-.159.32-.383.598-.67.838-.288.24-.63.423-1.038.55-.415.135-.862.2-1.34.2z" />
      </svg>
    ),
    description: "Cloud computing platform providing on-demand computing resources",
    projects: ["Serverless Application", "Cloud Storage Solution", "Scalable Web Service"],
    experience: "1 year",
  },
  {
    id: 6,
    name: "Next.js",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.5429.0445h-.4570l-.0803-.0516c-.0516-.0336-.0939-.0822-.1213-.1201-.0329-.0537-.0516-.1213-.0516-.1618 0-.0407.0235-.2922.0516-.5429l.0235-.5429.0516-.0516c.0235-.0235.0516-.0516.0516-.0516s.0235-.0235.0516-.0235c.0235 0 .0516.0235.0516.0516v.5429c0 .3209.0235.5429.0516.5429.0235 0 .0516-.0235.0516-.0516v-.5429c0-.3209-.0235-.5429-.0516-.5429-.0235 0-.0516.0235-.0516.0516z" />
      </svg>
    ),
    description: "React framework for production with server-side rendering",
    projects: ["Marketing Website", "Admin Dashboard", "E-commerce Platform"],
    experience: "1.5 years",
  },
  {
    id: 7,
    name: "Tailwind CSS",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
      </svg>
    ),
    description: "Utility-first CSS framework for rapidly building custom designs",
    projects: ["Portfolio Website", "Component Library", "Landing Pages"],
    experience: "2 years",
  },
]

export default function Techstack() {
  const [activeStack, setActiveStack] = useState(techStackData[0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const scrollRef = useRef(null)
  const intervalRef = useRef(null)

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        const currentIndex = techStackData.findIndex((stack) => stack.id === activeStack.id)
        const nextIndex = (currentIndex + 1) % techStackData.length
        handleStackClick(techStackData[nextIndex], false)
      }, 3000) // Change every 3 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [activeStack, isPaused])

  const handleStackClick = (stack, userInteraction = true) => {
    if (stack.id === activeStack.id) return

    if (userInteraction) {
      setIsPaused(true)
      // Resume auto-scroll after 10 seconds of inactivity
      setTimeout(() => setIsPaused(false), 10000)
    }

    setIsAnimating(true)
    setTimeout(() => {
      setActiveStack(stack)
      setIsAnimating(false)
    }, 300)
  }

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    // Resume auto-scroll after 2 seconds
    setTimeout(() => setIsPaused(false), 2000)
  }

  return (
    <section className="min-h-screen flex pt-32 bg-white dark:bg-black px-4 py-20" id="techstack">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">Technical Expertise</h2>
          <div className="w-16 h-0.5 bg-neutral-400 dark:bg-neutral-600 mx-auto"></div>
        </div>

        {/* Tech Stack Carousel */}
        <div className="relative mb-16" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="flex overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory" ref={scrollRef}>
            <div className="flex space-x-8 min-w-full justify-center">
              {techStackData.map((stack) => (
                <div
                  key={stack.id}
                  onClick={() => handleStackClick(stack)}
                  className={`flex-none cursor-pointer transition-all duration-500 transform ${
                    activeStack.id === stack.id ? "scale-110" : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <div
                    className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-xl transition-all duration-500 ${
                      activeStack.id === stack.id
                        ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                        : "bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {stack.icon}
                  </div>
                  <p
                    className={`text-center font-medium mt-3 text-sm transition-colors duration-300 ${
                      activeStack.id === stack.id
                        ? "text-black dark:text-white"
                        : "text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {stack.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {techStackData.map((stack) => (
              <div
                key={stack.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeStack.id === stack.id ? "bg-black dark:bg-white" : "bg-neutral-300 dark:bg-neutral-700"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tech Stack Info */}
        <div
          className={`bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 md:p-12 transition-all duration-500 ${
            isAnimating ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
          }`}
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-xl mr-6">
                  {activeStack.icon}
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white">{activeStack.name}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 font-light">
                    {activeStack.experience} of experience
                  </p>
                </div>
              </div>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed font-light">
                {activeStack.description}
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-black dark:text-white border-b border-neutral-200 dark:border-neutral-700 pb-3">
                Projects Built With <span className="font-bold">{activeStack.name}</span>
              </h4>
              <ul className="space-y-4">
                {activeStack.projects.map((project, index) => (
                  <li key={index} className="flex items-center group">
                    <div className="w-2 h-2 rounded-full bg-black dark:bg-white mr-4 transition-transform group-hover:scale-125"></div>
                    <span className="text-neutral-700 dark:text-neutral-300 font-light group-hover:text-black dark:group-hover:text-white transition-colors">
                      {project}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Auto-scroll indicator */}
        <div className="text-center mt-8">
          <p className="text-sm text-neutral-500 dark:text-neutral-500 font-light">
            {isPaused ? "Auto-scroll paused" : "Auto-scrolling • Hover to pause"}
          </p>
        </div>
      </div>
    </section>
  )
}
