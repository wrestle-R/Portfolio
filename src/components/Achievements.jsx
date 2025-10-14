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
		<section className="py-16 mt-20 px-4 relative z-10" style={{ backgroundColor: 'transparent' }} id="achievements">
			<div className="max-w-4xl mx-auto">
				{/* Title */}
				<div className="mb-12 text-left">
					<TextGenerateEffect
						words={titleText}
						className="text-3xl font-bold"
						duration={2.5}
						filter={true}
					/>
					<p className="text-sm mt-2" style={{ color: 'oklch(var(--muted-foreground))' }}>
						Hackathon wins and recognitions
					</p>
				</div>

				{/* Achievements Grid - Show both side by side */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{achievementsData.map((achievement) => (
						<div key={achievement.id} className="rounded-lg overflow-hidden" style={{ backgroundColor: 'oklch(var(--muted))', border: '1px solid oklch(var(--border))' }}>
							{/* Achievement Info */}
							<div className="p-6">
								<div className="space-y-4">
									{/* Header */}
									<div>
										<div className="flex items-center gap-2 mb-2">
											<span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'oklch(var(--primary))', color: 'oklch(var(--primary-foreground))' }}>
												{achievement.type}
											</span>
										</div>
										<h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: 'oklch(var(--foreground))' }}>
											{achievement.title}
										</h2>
										<h3 className="text-lg font-semibold mb-2" style={{ color: 'oklch(var(--foreground))' }}>
											{achievement.project}
										</h3>
										<p className="text-sm leading-relaxed" style={{ color: 'oklch(var(--muted-foreground))' }}>
											{achievement.description}
										</p>
									</div>

									{/* Event Details */}
									<div className="space-y-2 text-sm">
										<div className="flex items-center gap-2">
											<span className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>Host:</span>
											<span style={{ color: 'oklch(var(--muted-foreground))' }}>{achievement.host}</span>
										</div>
										<div className="flex items-center gap-2">
											<span className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>Duration:</span>
											<span style={{ color: 'oklch(var(--muted-foreground))' }}>{achievement.duration}</span>
										</div>
										<div className="flex items-start gap-2">
											<span className="font-medium" style={{ color: 'oklch(var(--foreground))' }}>Team:</span>
											<div className="flex flex-wrap gap-1">
												{achievement.teammates.map((teammate, index) => (
													<span
														key={index}
														className="text-xs px-2 py-1 rounded"
														style={{ 
															backgroundColor: 'oklch(var(--background))',
															color: 'oklch(var(--foreground))',
															border: '1px solid oklch(var(--border))'
														}}
													>
														{teammate}
													</span>
												))}
											</div>
										</div>
									</div>

									{/* Certificate Image */}
									<div className="w-full rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: 'oklch(var(--background))', border: '1px solid oklch(var(--border))' }}>
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
