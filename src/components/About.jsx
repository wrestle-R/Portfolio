import React from 'react';
import { TextGenerateEffect } from './ui/text-generate-effect';

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
          <p className="text-lg md:text-xl font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Hello! I'm <span className="font-semibold text-black dark:text-white">Russel Daniel Paul</span>, 
            a passionate second-year engineering student who loves creating 
            <span className="font-semibold text-black dark:text-white"> dark-themed websites</span> and finding 
            <span className="font-semibold text-black dark:text-white">unique solutions</span> to complex problems. 
            I specialize in the <span className="font-semibold text-black dark:text-white">MERN stack</span> and am currently 
            exploring <span className="font-semibold text-black dark:text-white">Next.js</span> and other modern frameworks.
          </p>
          
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