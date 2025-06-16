"use client"

import { useState, useEffect, useRef } from "react"
import { TextGenerateEffect } from './ui/text-generate-effect';

// Tech stack data with SVG icons
const techStackData = [
	{
		id: 1,
		name: "React",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
				<path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.277-.005-.003-.01-.003-.017-.005z"/>
			</svg>
		),
		description: "Frontend library for building interactive user interfaces with reusable components",
		projectUsage: "Quite proficient and used React to build frontend of Bible Wordle, Clarity, Trippeer and many more projects."
	},
	{
		id: 2,
		name: "Git",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
				<path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/>
			</svg>
		),
		description: "Distributed version control system for tracking changes in source code during development",
		projectUsage: "Use Git for all my project development and storage. Essential for version control."
	},
	{
		id: 3,
		name: "Java",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
				<path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c0-.484-.183-.904-.423-1.289.923-.825 1.041-1.584.654-2.294-.423-.753-1.222-1.13-2.294-1.13h-2.12v7.464h2.12c1.072 0 1.871-.377 2.294-1.13.387-.71.269-1.469-.654-2.294.24-.385.423-.805.423-1.289v-.038z"/>
			</svg>
		),
		description: "Object-oriented programming language for enterprise applications and algorithms",
		projectUsage: "Learnt Spring Boot framework for making Recipe Vault which was necessary for college project."
	},
	{
		id: 4,
		name: "Node.js",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
				<path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.570,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z"/>
			</svg>
		),
		description: "JavaScript runtime for building scalable server-side applications and APIs",
		projectUsage: "Made the backend of Danys Pizza, Talent Hunt and a todo list application."
	},
	{
		id: 5,
		name: "Express.js",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
				<path d="M24 18.588a1.529 1.529 0 01-1.529 1.529h-4.588a1.529 1.529 0 01-1.529-1.529v-4.588a1.529 1.529 0 011.529-1.529h4.588a1.529 1.529 0 011.529 1.529v4.588z"/>
				<path d="M22.471 9.176v-4.588a1.529 1.529 0 00-1.529-1.529h-4.588a1.529 1.529 0 00-1.529 1.529v4.588a1.529 1.529 0 001.529 1.529h4.588a1.529 1.529 0 001.529-1.529z"/>
				<path d="M13.647 4.588v4.588a1.529 1.529 0 01-1.529 1.529H7.53a1.529 1.529 0 01-1.529-1.529V4.588A1.529 1.529 0 017.53 3.059h4.588a1.529 1.529 0 011.529 1.529z"/>
				<path d="M13.647 18.588v-4.588a1.529 1.529 0 00-1.529-1.529H7.53a1.529 1.529 0 00-1.529 1.529v4.588a1.529 1.529 0 001.529 1.529h4.588a1.529 1.529 0 001.529-1.529z"/>
			</svg>
		),
		description: "Fast, minimalist web framework for Node.js applications and RESTful APIs",
		projectUsage: "Used Express with Node.js for connecting backend services in my various projects."
	},
	{
		id: 6,
		name: "MongoDB",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
				<path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/>
			</svg>
		),
		description: "NoSQL document database for flexible, scalable data storage solutions",
		projectUsage: "My go-to database. I like NoSQL and used MongoDB for connecting with Node.js."
	},
	{
		id: 7,
		name: "PostgreSQL",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
					<path d="M4 6h16v2H4zm0 5h16v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6zM4 4a2 2 0 012-2h12a2 2 0 012 2v2H4V4zm2 9h2v2H6v-2zm4 0h2v2h-2v-2z"/>
			</svg>
		),
		description: "Advanced relational database system with complex queries and data integrity",
		projectUsage: "Learnt PostgreSQL commands as part of DBMS in college and used for Recipe Vault."
	},
	{
		id: 8,
		name: "Tailwind CSS",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
				<path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
			</svg>
		),
		description: "Utility-first CSS framework for rapid responsive design development",
		projectUsage: "I have used Tailwind in everything I have ever built. Just so much better."
	},
	{
		id: 9,
		name: "Next.js",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
				<path d="M11.5725 0c-.1763 0-.3098.0013-.3584.0067-.0516.0053-.2159.021-.3636.0328-3.4088.3073-6.6017 2.1463-8.624 4.9728C1.1004 6.584.3802 8.3666.1082 10.255c-.0962.659-.108.8537-.108 1.7474s.012 1.0884.108 1.7476c.652 4.506 3.8591 8.2919 8.2087 9.6945.7789.2511 1.6.4223 2.5337.5255.3636.04 1.9354.04 2.299 0 1.6117-.1783 2.9772-.577 4.3237-1.2643.2065-.1056.2464-.1337.2183-.1573-.0188-.0139-.8987-1.1938-1.9543-2.62l-1.919-2.592-2.4047-3.5583c-1.3231-1.9564-2.4117-3.556-2.4211-3.556-.0094-.0026-.0187 1.5787-.0235 3.509-.0067 3.3802-.0093 3.5162-.0516 3.596-.061.115-.108.1618-.2064.2134-.075.0374-.1408.0445-.5429.0445h-.4570l-.0803-.0516c-.0516-.0336-.0939-.0822-.1213-.1201-.0329-.0537-.0516-.1213-.0516-.1618 0-.0407.0235-.2922.0516-.5429l.0235-.5429.0516-.0516c.0235-.0235.0516-.0516.0516-.0516s.0235-.0235.0516-.0235c.0235 0 .0516.0235.0516.0516v.5429c0 .3209.0235.5429.0516.5429.0235 0 .0516-.0235.0516-.0516v-.5429c0-.3209-.0235-.5429-.0516-.5429-.0235 0-.0516.0235-.0516.0516z"/>
			</svg>
		),
		description: "React framework with server-side rendering and static site generation",
		projectUsage: "Used for making car showroom which fetches cars via API. Actively learning TypeScript."
	},
	{
		id: 10,
		name: "Socket.IO",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
				<path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 14.34c-.289.293-.676.293-.965 0l-2.12-2.121-2.12 2.121c-.293.293-.676.293-.965 0-.293-.289-.293-.672 0-.965l2.12-2.12-2.12-2.121c-.293-.289-.293-.672 0-.965.289-.289.672-.289.965 0l2.12 2.121 2.12-2.121c.289-.289.676-.289.965 0 .289.293.289.676 0 .965l-2.12 2.121 2.12 2.12c.289.293.289.676 0 .965z"/>
			</svg>
		),
		description: "Real-time bidirectional event-based communication library",
		projectUsage: "Made Chat Masala app using MERN stack and integrated WebRTC for Talent Hunt website."
	},
	{
		id: 11,
		name: "JWT",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
				<path d="M10.2 0L0 6v12l10.2 6L20.4 18V6L10.2 0zm8.4 16.2l-8.4 4.8-8.4-4.8V7.8l8.4-4.8 8.4 4.8v8.4zm-4.8-6L12 8.4 10.2 10.2l1.8 1.8-1.8 1.8L12 15.6l1.8-1.8z"/>
			</svg>
		),
		description: "JSON Web Tokens for secure authentication and authorization",
		projectUsage: "Used JWT for keeping authorization in Talent Hunt and Danys Pizza applications."
	},
	{
		id: 12,
		name: "Supabase",
		icon: (
			<svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
				<path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z"/>
			</svg>
		),
		description: "Open-source Firebase alternative with PostgreSQL database and real-time features",
		projectUsage: "Used Supabase for storage of images and authorization of ScreenSmart and Watchlist."
	}
]

export default function Techstack() {
	const [activeStack, setActiveStack] = useState(techStackData[0])
	const [isAnimating, setIsAnimating] = useState(false)
	const [isPaused, setIsPaused] = useState(false)
	const intervalRef = useRef(null)
    const titleText = "My Tech Stack";
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
		<section className="pt-24 bg-white dark:bg-black px-4" id="skills">
			<div className="max-w-4xl mx-auto">
				{/* Title */}
				 <div className="mb-12 text-center">
                          <TextGenerateEffect
                            words={titleText}
                            className="text-3xl md:text-4xl font-bold text-black dark:text-white"
                            duration={2.5}
                            filter={true}
                          />
                        </div>

				{/* Tech Stack Grid */}
				<div className="relative mb-12" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
					<div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 md:gap-3 mb-6">
						{techStackData.map((stack) => (
							<div
								key={stack.id}
								onClick={() => handleStackClick(stack)}
								className={`cursor-pointer transition-all duration-500 transform ${
									activeStack.id === stack.id ? "scale-110" : "opacity-60 hover:opacity-100 hover:scale-105"
								}`}
							>
								<div
									className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl transition-all duration-500 mx-auto shadow-sm ${
										activeStack.id === stack.id
											? "bg-black dark:bg-white text-white dark:text-black shadow-lg transform scale-105"
											: "bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:shadow-md"
									}`}
								>
									<div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7">
										{stack.icon}
									</div>
								</div>
								<p
									className={`text-center font-medium mt-2 text-[10px] sm:text-xs transition-colors duration-300 ${
										activeStack.id === stack.id
											? "text-black dark:text-white font-semibold"
											: "text-neutral-600 dark:text-neutral-400"
									}`}
								>
									{stack.name}
								</p>
							</div>
						))}
					</div>

					{/* Progress indicators */}
					<div className="flex justify-center space-x-1 mt-6">
						{techStackData.map((stack) => (
							<div
								key={stack.id}
								className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
									activeStack.id === stack.id ? "bg-black dark:bg-white scale-125" : "bg-neutral-300 dark:bg-neutral-700"
								}`}
							/>
						))}
					</div>
				</div>

				{/* Tech Stack Info */}
				<div
					className={`bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 md:p-6 transition-all duration-500 ${
						isAnimating ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
					}`}
				>
					<div className="max-w-4xl">
						{/* Header */}
						<div className="flex items-center justify-center mb-3 md:mb-4">
							<h3 className="text-lg md:text-2xl font-bold text-black dark:text-white">{activeStack.name}</h3>
						</div>
						
						{/* Two Column Layout */}
						<div className="grid md:grid-cols-2 gap-4 md:gap-6">
							{/* Description - Left Side - Hidden on mobile */}
							<div className="hidden md:block bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 md:p-4">
								<h4 className="text-sm md:text-base font-semibold text-black dark:text-white mb-2 md:mb-3">Description</h4>
								<p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
									{activeStack.description}
								</p>
							</div>

							{/* Project Usage - Right Side - Full width on mobile */}
							<div className="col-span-full md:col-span-1 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 md:p-4">
								<h4 className="text-sm md:text-base font-semibold text-black dark:text-white mb-2 md:mb-3">How I've Used This</h4>
								<p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
									{activeStack.projectUsage}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Auto-scroll indicator */}
				<div className="text-center mt-4 md:mt-6">
					<p className="text-xs text-neutral-500 dark:text-neutral-500 font-light">
						{isPaused ? "Auto-scroll paused" : "Auto-scrolling • Hover to pause"}
					</p>
				</div>
			</div>
		</section>
	)
}
