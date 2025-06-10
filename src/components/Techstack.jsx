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
		description: "Frontend library for building interactive user interfaces with reusable components",
		projectUsage: "Built responsive UIs for Screen Smart's resume dashboard and Trippeer's travel interface. Used hooks for state management and component lifecycle in both hackathon projects."
	},
	{
		id: 2,
		name: "JavaScript",
		icon: (
			<svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
				<path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
			</svg>
		),
		description: "Core programming language for both frontend interactivity and backend development",
		projectUsage: "Primary language for all logic implementation. Created dynamic filtering algorithms in Screen Smart, interactive travel recommendations in Trippeer, and API endpoint handling."
	},
	{
		id: 3,
		name: "Java",
		icon: (
			<svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
				<path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218" />
			</svg>
		),
		description: "Object-oriented programming language for enterprise applications and algorithms",
		projectUsage: "Foundation language for algorithm development. Implemented complex resume scoring algorithms in Screen Smart and data processing pipelines. Used for object-oriented design patterns in hackathon projects."
	},
	{
		id: 4,
		name: "Node.js",
		icon: (
			<svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
				<path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.46 1.71.46.85 0 1.31-.52 1.31-1.36V9.47c0-.16-.14-.3-.31-.3H7.18c-.17 0-.31.14-.31.3v8.58c0 .64-.69 1.28-1.8.73l-1.95-1.12c-.19-.11-.31-.3-.31-.52V8.71c0-.21.11-.41.31-.52l7.44-4.3c.19-.11.42-.11.61 0l7.44 4.3c.19.11.31.3.31.52v8.58c0 .21-.11.41-.31.52l-7.44 4.3c-.19.11-.42.11-.61 0l-1.83-1.05c-.11-.06-.24-.06-.32 0-.27.18-.33.21-.58.33-.09.04-.24.11-.02.21l2.39 1.36c.24.13.50.2.78.2s.54-.07.78-.2l7.44-4.3c.48-.28.78-.8.78-1.36V8.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.51-.2-.78-.2z" />
			</svg>
		),
		description: "JavaScript runtime for building scalable server-side applications and APIs",
		projectUsage: "Backend server foundation for both projects. Handled file uploads in Screen Smart, managed API integrations for AI features, and created secure endpoints for user authentication."
	},
	{
		id: 5,
		name: "Express.js",
		icon: (
			<svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
				<path d="M24 18.588a1.529 1.529 0 0 1-1.529 1.529h-4.588a1.529 1.529 0 0 1-1.529-1.529v-4.588a1.529 1.529 0 0 1 1.529-1.529h4.588a1.529 1.529 0 0 1 1.529 1.529v4.588zM22.471 9.176v-4.588a1.529 1.529 0 0 0-1.529-1.529h-4.588a1.529 1.529 0 0 0-1.529 1.529v4.588a1.529 1.529 0 0 0 1.529 1.529h4.588a1.529 1.529 0 0 0 1.529-1.529zM13.647 4.588v4.588a1.529 1.529 0 0 1-1.529 1.529H7.53a1.529 1.529 0 0 1-1.529-1.529V4.588A1.529 1.529 0 0 1 7.53 3.059h4.588a1.529 1.529 0 0 1 1.529 1.529zM13.647 18.588v-4.588a1.529 1.529 0 0 0-1.529-1.529H7.53a1.529 1.529 0 0 0-1.529 1.529v4.588a1.529 1.529 0 0 0 1.529 1.529h4.588a1.529 1.529 0 0 0 1.529-1.529z" />
			</svg>
		),
		description: "Fast, minimalist web framework for Node.js applications and RESTful APIs",
		projectUsage: "Built RESTful APIs for both projects. Created middleware for authentication, file handling routes in Screen Smart, and travel data endpoints in Trippeer with proper error handling."
	},
	{
		id: 6,
		name: "MongoDB",
		icon: (
			<svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
				<path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z" />
			</svg>
		),
		description: "NoSQL document database for flexible, scalable data storage solutions",
		projectUsage: "Primary database for storing candidate profiles and scoring data in Screen Smart. Managed user preferences, travel history, and destination information in Trippeer using Mongoose ODM."
	},
	{
		id: 7,
		name: "PostgreSQL",
		icon: (
			<svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
				<path d="M23.111 5.441c-.592-.85-1.627-1.278-3.082-1.278-1.455 0-2.49.428-3.082 1.278-.593-.85-1.628-1.278-3.083-1.278-1.454 0-2.489.428-3.081 1.278-.593-.85-1.628-1.278-3.083-1.278-1.454 0-2.489.428-3.081 1.278C3.127 4.591 2.092 5.02.637 5.02L0 6.299c1.455 0 2.49-.428 3.082-1.278.593.85 1.628 1.278 3.083 1.278 1.454 0 2.489-.428 3.081-1.278.593.85 1.628 1.278 3.083 1.278 1.454 0 2.489-.428 3.081-1.278.593.85 1.628 1.278 3.083 1.278 1.454 0 2.49-.428 3.082-1.278L24 5.021c-0.319 0-.638.14-.889.42z" />
			</svg>
		),
		description: "Advanced relational database system with complex queries and data integrity",
		projectUsage: "Used with Supabase for complex relational data in Trippeer's travel recommendations. Handled user authentication tables and normalized travel destination data with proper relationships."
	},
	{
		id: 8,
		name: "Tailwind CSS",
		icon: (
			<svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
				<path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
			</svg>
		),
		description: "Utility-first CSS framework for rapid responsive design development",
		projectUsage: "Primary styling solution for both projects. Created dark-themed interfaces, mobile-responsive layouts, and custom animations for Screen Smart and Trippeer's user interfaces."
	},
	{
		id: 9,
		name: "Next.js",
		icon: (
			<svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
				<path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.5429.0445h-.4570l-.0803-.0516c-.0516-.0336-.0939-.0822-.1213-.1201-.0329-.0537-.0516-.1213-.0516-.1618 0-.0407.0235-.2922.0516-.5429l.0235-.5429.0516-.0516c.0235-.0235.0516-.0516.0516-.0516s.0235-.0235.0516-.0235c.0235 0 .0516.0235.0516.0516v.5429c0 .3209.0235.5429.0516.5429.0235 0 .0516-.0235.0516-.0516v-.5429c0-.3209-.0235-.5429-.0516-.5429-.0235 0-.0516.0235-.0516.0516z" />
			</svg>
		),
		description: "React framework with server-side rendering and static site generation",
		projectUsage: "Currently learning for production-ready applications. Planning to rebuild Screen Smart with SSR for better SEO and performance. Exploring API routes for streamlined backend integration."
	},
	{
		id: 10,
		name: "Socket.IO",
		icon: (
			<svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
			</svg>
		),
		description: "Real-time bidirectional event-based communication library",
		projectUsage: "Implemented real-time features in Trippeer for collaborative trip planning. Used for instant travel updates, live chat functionality, and synchronized user interactions across multiple clients."
	},
	{
		id: 11,
		name: "JWT",
		icon: (
			<svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
				<path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z"/>
			</svg>
		),
		description: "JSON Web Tokens for secure authentication and authorization",
		projectUsage: "Implemented secure user authentication in both projects. Used for protecting API routes in Screen Smart's admin panel and managing user sessions in Trippeer's travel booking system."
	},
	{
		id: 12,
		name: "Supabase",
		icon: (
			<svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor">
				<path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z" />
			</svg>
		),
		description: "Open-source Firebase alternative with PostgreSQL database and real-time features",
		projectUsage: "Backend-as-a-Service for Trippeer project. Implemented real-time user authentication, travel data synchronization, and collaborative trip planning features with built-in PostgreSQL database."
	}
]

export default function Techstack() {
	const [activeStack, setActiveStack] = useState(techStackData[0])
	const [isAnimating, setIsAnimating] = useState(false)
	const [isPaused, setIsPaused] = useState(false)
	const intervalRef = useRef(null)

	// Auto-scroll functionality
	useEffect(() => {
		if (!isPaused) {
			intervalRef.current = setInterval(() => {
				const currentIndex = techStackData.findIndex((stack) => stack.id === activeStack.id)
				const nextIndex = (currentIndex + 1) % techStackData.length
				handleStackClick(techStackData[nextIndex], false)
			}, 3000)
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
		setTimeout(() => setIsPaused(false), 2000)
	}

	return (
		<section className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4 py-20" id="skills">
			<div className="max-w-6xl mx-auto">
				{/* Title */}
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">Tech Stack</h2>
					<div className="w-16 h-0.5 bg-neutral-400 dark:bg-neutral-600 mx-auto"></div>
				</div>

				{/* Tech Stack Grid */}
				<div className="relative mb-16" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
					<div className="grid grid-cols-3 md:grid-cols-6 gap-6 mb-8">
						{techStackData.map((stack) => (
							<div
								key={stack.id}
								onClick={() => handleStackClick(stack)}
								className={`cursor-pointer transition-all duration-500 transform ${
									activeStack.id === stack.id ? "scale-110" : "opacity-60 hover:opacity-100 hover:scale-105"
								}`}
							>
								<div
									className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-xl transition-all duration-500 mx-auto ${
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
					<div className="text-center max-w-3xl mx-auto">
						<div className="flex items-center justify-center mb-6">
							<div className="w-16 h-16 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-xl mr-6">
								{activeStack.icon}
							</div>
							<h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white">{activeStack.name}</h3>
						</div>
						<p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed font-light mb-6">
							{activeStack.description}
						</p>
						
						{/* Project Usage Section */}
						<div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
							<h4 className="text-lg font-semibold text-black dark:text-white mb-3">How I've Used This Technology</h4>
							<p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
								{activeStack.projectUsage}
							</p>
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
