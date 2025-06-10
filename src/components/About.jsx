import React from 'react';
import { TextGenerateEffect } from './ui/text-generate-effect';
import GitHubCalendar from 'react-github-calendar'

const About = () => {
  const titleText = "About Me";
  
  return (
    <section className="flex pt-32 bg-white dark:bg-black px-4 py-20" id="about">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated Title */}
        <div className="mb-12">
          <TextGenerateEffect
            words={titleText}
            className="text-3xl md:text-4xl font-bold text-black dark:text-white"
            duration={2.5}
            filter={true}
          />
        </div>
        
        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <p className="text-lg md:text-lg font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Hello! I'm Russel Daniel Paul, 
            a passionate second-year engineering student who loves creating 
            dark-themed websites and finding 
            unique solutions to complex problems. 
            I specialize in the MERN stack and am currently 
            exploring Next.js and other modern frameworks.
          </p>
          
          <GitHubCalendar username="wrestle-R" />

          {/* Achievements
          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400 italic">
            Successfully participated in multiple hackathons with runner-up achievements and innovative solutions.
          </p> */}
          
          {/* Subtle accent line */}
          {/* <div className="w-16 h-0.5 bg-neutral-400 dark:bg-neutral-600 mx-auto mt-10"></div> */}
        </div>
      </div>
    </section>
  );
};

export default About;