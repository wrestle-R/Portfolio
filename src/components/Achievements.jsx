"use client"

import { useState } from 'react';
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
	const [selectedImage, setSelectedImage] = useState(null);

	return (
		<section className="py-16 mt-20 px-4 relative z-10" style={{ backgroundColor: 'transparent' }} id="achievements">
			<div className="max-w-4xl mx-auto">
				{/* Title */}
				<div className="mb-12 text-left">
					<TextGenerateEffect
						words={titleText}
						className="text-3xl font-extrabold tracking-tight"
						duration={2.5}
						filter={true}
					/>

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
									<div className="w-full rounded-lg overflow-hidden shadow-lg cursor-pointer hover:opacity-90 transition-opacity" 
										style={{ backgroundColor: 'oklch(var(--background))', border: '1px solid oklch(var(--border))' }}
										onClick={() => setSelectedImage(achievement.image)}
									>
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

				{/* Lightbox Modal */}
				{selectedImage && (
					<div 
						className="fixed inset-0 flex items-center justify-center p-4"
						style={{ 
							backgroundColor: 'oklch(var(--background) / 0.95)', 
							zIndex: 999999,
							backdropFilter: 'blur(12px)',
							WebkitBackdropFilter: 'blur(12px)'
						}}
						onClick={() => setSelectedImage(null)}
					>
						<div className="relative w-full h-full flex items-center justify-center">
							{/* Close Button */}
							<button
								onClick={() => setSelectedImage(null)}
								className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 hover:opacity-80"
								style={{ 
									backgroundColor: 'oklch(var(--card))',
									color: 'oklch(var(--foreground))',
									border: '2px solid oklch(var(--border))',
									zIndex: 1000000
								}}
								aria-label="Close"
							>
								<svg 
									xmlns="http://www.w3.org/2000/svg" 
									className="h-6 w-6" 
									fill="none" 
									viewBox="0 0 24 24" 
									stroke="currentColor"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>

							{/* Image Container - 80% of screen */}
							<div 
								className="relative max-w-[80vw] max-h-[80vh]"
								onClick={(e) => e.stopPropagation()}
								style={{ zIndex: 1000000 }}
							>
								<img
									src={selectedImage}
									alt="Certificate"
									className="w-full h-full object-contain rounded-lg shadow-2xl"
									style={{ 
										maxWidth: '80vw', 
										maxHeight: '80vh',
										border: '2px solid oklch(var(--border))'
									}}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	)
}
