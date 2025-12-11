"use client"

import { useState, useEffect, useRef } from "react"
import { TextGenerateEffect } from './ui/text-generate-effect';
import { useTheme } from '../context/ThemeContext'; // Import ThemeContext

// Tech stack data with image icons
const techStackData = [
	{
		id: 1,
		name: "React",
		icon: (
			<img src="/React.png" alt="React" className="w-full h-full pt-1 object-contain scale-145" />
		),
			activeIcon: (
			<img src="/React_black.png" alt="React" className="w-full h-full pt-1 object-contain scale-145" />
		),
		description: "Frontend library for building interactive user interfaces with reusable components",
		projectUsage: "Quite proficient and used React to build frontend of Bible Wordle, Vathavaran Variables (Varte), Trippeer and many more projects."
	},
	{
		id: 2,
		name: "Git",
		icon: (
			<img src="/Git.png" alt="Git" className="w-full h-full object-contain" />
		),
		description: "Distributed version control system for tracking changes in source code during development",
		projectUsage: "Use Git for all my project development and storage. Essential for version control."
	},
	{
		id: 3,
		name: "Java",
		icon: (
			<img src="/Java.png" alt="Java" className="w-full h-full object-contain scale-150" />
		),
		activeIcon: (
			<img src="/java_black.png" alt="Java" className="w-full h-full object-contain scale-150" />
		),
		description: "Object-oriented programming language for enterprise applications and algorithms",
		projectUsage: "Learnt Spring Boot framework for making Recipe Vault which was necessary for college project."
	},
	{
		id: 4,
		name: "Node.js",
		icon: (
			<img src="/Node.png" alt="Node.js" className="w-full h-full object-contain scale-165" />
		),
		activeIcon: (
			<img src="/Node_black.png" alt="Node.js" className="w-full h-full object-contain scale-165" />
		),
		description: "JavaScript runtime for building scalable server-side applications and APIs",
		projectUsage: "Made the backend of Danys Pizza, Talent Hunt and a todo list application."
	},
	{
		id: 5,
		name: "Express.js",
		icon: (
			<img src="/express_black.png" alt="Express.js" className="w-full h-full object-contain" />
		),
		activeIcon: (
			<img src="/express.png" alt="Express.js" className="w-full h-full object-contain" />
		),
		description: "Fast, minimalist web framework for Node.js applications and RESTful APIs",
		projectUsage: "Used Express with Node.js for connecting backend services in my various projects."
	},
	{
		id: 6,
		name: "MongoDB",
		icon: (
			<img src="/mongo.png" alt="MongoDB" className="w-full h-full object-contain scale-130" />
		),
		activeIcon: (
			<img src="/mongo_black.png" alt="MongoDB" className="w-full h-full object-contain scale-130" />
		),
		description: "NoSQL document database for flexible, scalable data storage solutions",
		projectUsage: "My go-to database. I like NoSQL and used MongoDB for connecting with Node.js."
	},
	{
		id: 7,
		name: "PostgreSQL",
		icon: (
			<img src="/postgresSql.png" alt="PostgreSQL" className="w-full h-full object-contain scale-130" />
		),
		activeIcon: (
			<img src="/postgresSql_black.png" alt="PostgreSQL" className="w-full h-full object-contain scale-130" />
		),
		description: "Advanced relational database system with complex queries and data integrity",
		projectUsage: "Learnt PostgreSQL commands as part of DBMS in college and used for Recipe Vault."
	},
	{
		id: 8,
		name: "Tailwind CSS",
		icon: (
			<img src="/Tailwind.png" alt="Tailwind CSS" className="w-full h-full object-contain scale-130" />
		),
		activeIcon: (
			<img src="/Tailwind_black.png" alt="Tailwind CSS" className="w-full h-full object-contain scale-130" />
		),
		description: "Utility-first CSS framework for rapid responsive design development",
		projectUsage: "I have used Tailwind in everything I have ever built. Just so much better."
	},
	{
		id: 9,
		name: "Next.js",
		icon: (
			<img src="/NEXT_black.png" alt="Next.js" className="w-full h-full object-contain scale-129" />
		),
		activeIcon: (
			<img src="/NEXT.png" alt="Next.js" className="w-full h-full object-contain" />
		),
		description: "React framework with server-side rendering and static site generation",
		projectUsage: "Used for making car showroom which fetches cars via API. Actively learning TypeScript."
	},
	{
		id: 10,
		name: "FastAPI",
		icon: (
			<img src="/fastapi.svg" alt="FastAPI" className="w-full h-full object-contain scale-130" />
		),
		activeIcon: (
			<img src="/fastapi.svg" alt="FastAPI" className="w-full h-full object-contain scale-130" />
		),
		description: "High-performance Python web framework for building APIs with automatic docs",
		projectUsage: "Used to develop RESTful endpoints, implement SMTP functionality, and rapidly deploy backend services for prototyping."
	},
	{
		id: 11,
		name: "Python",
		icon: (
			<img src="/python.png" alt="Python" className="w-full h-full object-contain scale-150" />
		),
		activeIcon: (
			<img src="/python.png" alt="Python" className="w-full h-full object-contain scale-150" />
		),
		description: "General-purpose programming language used for scripting, automation, and backend development",
		projectUsage: "Used Python for backend development (FastAPI and Flask) and for machine-learning workflows in Jupyter notebooks."
	},
	{
		id: 13,
		name: "C/C++",
		icon: (
			<img src="/cplusplus.png" alt="C/C++" className="w-full h-full object-contain scale-150" />
		),
		activeIcon: (
			<img src="/cplusplus_black.png" alt="C/C++" className="w-full h-full object-contain scale-150" />
		),
		description: "C and C++ are general-purpose languages, with C focusing on efficiency and C++ adding OOP features.",
		projectUsage: "I leveraged C and C++ to dive deep into core Data Structures and Algorithms."
	}
]

export default function Techstack() {
    const [activeStack, setActiveStack] = useState(techStackData[0])
    const [isAnimating, setIsAnimating] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const intervalRef = useRef(null)
    const { theme } = useTheme(); // Get theme from context
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

	// Helper to decide icon for special stacks
	const getStackIcon = (stack) => {
		const specialNames = ["Java", "Next.js", "Express.js", "FastAPI"];
		if (specialNames.includes(stack.name)) {
			if (theme === "light" && stack.activeIcon) return stack.activeIcon;
			if (theme === "dark" && stack.icon) return stack.icon;
		}
		// Fallback to normal logic for others
		return stack.icon;
	};

	return (
		<section className="pt-24 px-4 relative z-10" style={{ backgroundColor: 'transparent' }} id="skills">
			<div className="max-w-4xl mx-auto">
				{/* Title */}
				 <div className="mb-12 text-left">
                          <TextGenerateEffect
                            words={titleText}
                            className="text-3xl font-bold"
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
									className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl transition-all duration-500 mx-auto shadow-sm`}
									style={
										activeStack.id === stack.id
											? {
													backgroundColor: 'oklch(var(--primary-foreground))',
													color: 'oklch(var(--primary))',
													transform: 'scale(1.05)'
											  }
											: {
													backgroundColor: 'oklch(var(--muted))',
													color: 'oklch(var(--muted-foreground))'
											  }
									}
								>
									<div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7">
										{getStackIcon(stack)}
									</div>
								</div>
								<p
									className={`text-center font-medium mt-2 text-[10px] sm:text-xs transition-colors duration-300`}
									style={
										activeStack.id === stack.id
											? { color: 'oklch(var(--foreground))', fontWeight: 600 }
											: { color: 'oklch(var(--muted-foreground))' }
									}
								>
									{stack.name}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Tech Stack Info */}
				<div
					className={`rounded-lg p-4 md:p-6 transition-all duration-500 ${
						isAnimating ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
					}`}
					style={{
						backgroundColor: 'oklch(var(--muted))',
						border: '1px solid oklch(var(--border))'
					}}
				>
					<div className="max-w-4xl">
						{/* Header */}
						<div className="flex items-center justify-center mb-3 md:mb-4">
							<h3 className="text-lg md:text-2xl font-bold" style={{ color: 'oklch(var(--foreground))' }}>{activeStack.name}</h3>
						</div>
						
						{/* Two Column Layout */}
						<div className="grid md:grid-cols-2 gap-4 md:gap-6">
							{/* Description - Left Side - Hidden on mobile */}
							<div className="hidden md:block rounded-lg p-3 md:p-4" style={{ backgroundColor: 'oklch(var(--background))', border: '1px solid oklch(var(--border))' }}>
								<h4 className="text-sm md:text-base font-semibold mb-2 md:mb-3" style={{ color: 'oklch(var(--foreground))' }}>Description</h4>
								<p className="text-xs md:text-sm leading-relaxed" style={{ color: 'oklch(var(--muted-foreground))' }}>
									{activeStack.description}
								</p>
							</div>

							{/* Project Usage - Right Side - Full width on mobile */}
							<div className="col-span-full md:col-span-1 rounded-lg p-3 md:p-4" style={{ backgroundColor: 'oklch(var(--background))', border: '1px solid oklch(var(--border))' }}>
								<h4 className="text-sm md:text-base font-semibold mb-2 md:mb-3" style={{ color: 'oklch(var(--foreground))' }}>How I've Used This</h4>
								<p className="text-xs md:text-sm leading-relaxed" style={{ color: 'oklch(var(--muted-foreground))' }}>
									{activeStack.projectUsage}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Auto-scroll indicator */}
				<div className="text-center mt-4 md:mt-6">
					<p className="text-xs font-light" style={{ color: 'oklch(var(--muted-foreground))' }}>
						{isPaused ? "Auto-scroll paused" : "Auto-scrolling • Hover to pause"}
					</p>
				</div>
			</div>
		</section>
	)
}
