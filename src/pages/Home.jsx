import React from 'react';
import NavbarComponent from '../components/Navbar';
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

const sections = [About, Github, LatestBlog, Techstack, Internship, Projects, Achievements, Contact, Footer];

const Home = () => {
  const entrance = useHomeEntrance();
  return (
    <div className="min-h-screen">
      <SectionReveal enabled={entrance} navigation>
        <NavbarComponent />
      </SectionReveal>
      {sections.map((Section, index) => (
        <SectionReveal key={index} enabled={entrance} index={index}>
          <Section />
        </SectionReveal>
      ))}
    </div>
  );
};

export default Home;
