import React from 'react';
import StickerNavigation from '../components/StickerNavigation';
import About from '../components/About';
import Github from '../components/Github';
import LatestBlog from '../components/LatestBlog';
import Techstack from '../components/Techstack';
import Internship from '../components/Internship';
import Projects from '../components/Projects';
import Achievements from '../components/Achievements';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import SectionReveal from '../components/ui/section-reveal';
import { useHomeEntrance } from '../lib/use-home-entrance';
import SiltBackground from '../components/SiltBackground';

const sections = [About, Github, LatestBlog, Techstack, Internship, Projects, Achievements, Contact, Footer];
const Home = () => {
  const entrance = useHomeEntrance();
  return (
    <div className="portfolio-home min-h-screen">
      <a className="portfolio-skip-link" href="#main-content">Skip to content</a>
      <SiltBackground />
      <StickerNavigation />
      <main id="main-content" tabIndex={-1}>
      {sections.map((Section, index) => (
        <SectionReveal key={index} enabled={entrance && index === 0} index={index}>
          <div className="portfolio-charm-section">
            <Section />
          </div>
        </SectionReveal>
      ))}
      </main>
    </div>
  );
};

export default Home;
