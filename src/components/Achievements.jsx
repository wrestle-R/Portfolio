"use client"

import { TextGenerateEffect } from './ui/text-generate-effect';

const achievementsData = [
    {
        id: 1,
        title: "Coherence Hackathon",
        subtitle: "AIML Track",
        project: "ScreenSmart",
        description: "AI hiring assistant for resume screening and bias-free ranking.",
        teammates: ["Liza", "Romeiro", "Gavin"],
        host: "Vartak College of Engineering",
        duration: "24-hour offline",
        date: "29 March 2024",
        image: "/Coherence.jpg",
        type: "Runners Up"
    },
    {
        id: 2,
        title: "Certifiyo Hackathon",
        subtitle: "Travel Tech Track",
        project: "Trippeer – AI Travel Planner",
        description: "AI platform recommending destinations based on mood, budget, and time.",
        teammates: ["Aliqyaan", "Aditya", "Romeiro"],
        host: "Certifiyo",
        duration: "12-hour online",
        date: "17 May 2025",
        image: "/Certifiyo.jpg",
        type: "Second Runners Up"
    }
]

export default function Achievements() {
	const titleText = "Achievements"

	return (
		<section className="py-16 bg-white dark:bg-black px-4" id="achievements">
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
						Hackathon wins and recognitions
					</p>
				</div>

				{/* Achievements Grid - Show both side by side */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{achievementsData.map((achievement) => (
						<div key={achievement.id} className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
							{/* Achievement Info */}
							<div className="p-6">
								<div className="space-y-4">
									{/* Header */}
									<div>
										<div className="flex items-center gap-2 mb-2">
											<span className="text-xs bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded">
												{achievement.type}
											</span>
										</div>
										<h2 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-1">
											{achievement.title}
										</h2>
										{/* <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
											{achievement.subtitle}
										</p> */}
										<h3 className="text-lg font-semibold text-black dark:text-white mb-2">
											{achievement.project}
										</h3>
										<p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
											{achievement.description}
										</p>
									</div>

									{/* Event Details */}
									<div className="space-y-2 text-sm">
										{/* <div className="flex items-center gap-2">
											<span className="font-medium text-black dark:text-white">Date:</span>
											<span className="text-neutral-600 dark:text-neutral-400">{achievement.date}</span>
										</div> */}
										<div className="flex items-center gap-2">
											<span className="font-medium text-black dark:text-white">Host:</span>
											<span className="text-neutral-600 dark:text-neutral-400">{achievement.host}</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="font-medium text-black dark:text-white">Duration:</span>
											<span className="text-neutral-600 dark:text-neutral-400">{achievement.duration}</span>
										</div>
										<div className="flex items-start gap-2">
											<span className="font-medium text-black dark:text-white">Team:</span>
											<div className="flex flex-wrap gap-1">
												{achievement.teammates.map((teammate, index) => (
													<span
														key={index}
														className="text-xs bg-white dark:bg-black text-black dark:text-white px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700"
													>
														{teammate}
													</span>
												))}
											</div>
										</div>
									</div>

									{/* Certificate Image */}
									<div className="w-full bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-lg">
										<div className="relative w-full" style={{ aspectRatio: '1075/921' }}>
											<img
												src={achievement.image}
												alt={`${achievement.title} Certificate`}
												className="w-full h-full object-cover object-center"
												style={{ objectPosition: 'center' }}
												onError={(e) => {
													// Fallback placeholder if image doesn't exist
													e.target.src = `https://via.placeholder.com/1075x921/e5e5e5/666666?text=${encodeURIComponent(achievement.title)}+Certificate`;
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
