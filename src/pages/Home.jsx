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
import PortfolioBackground from '../components/PortfolioBackground';
import PortfolioCharm from '../components/PortfolioCharm';

const sections = [About, Github, LatestBlog, Techstack, Internship, Projects, Achievements, Contact, Footer];
const sectionCharms = { 0: 'headphones', 1: 'shoe', 2: 'blog', 3: 'guitar', 5: 'laptop', 6: 'minecraft' };

const Home = () => {
  const entrance = useHomeEntrance();
  return (
    <div className="portfolio-home min-h-screen">
      <PortfolioBackground />
      <SectionReveal enabled={entrance} navigation>
        <NavbarComponent />
      </SectionReveal>
      {sections.map((Section, index) => (
        <SectionReveal key={index} enabled={entrance} index={index}>
          <div className="portfolio-charm-section">
            <Section />
            {sectionCharms[index] && <PortfolioCharm type={sectionCharms[index]} />}
          </div>
        </SectionReveal>
      ))}
    </div>
  );
};

export default Home;
