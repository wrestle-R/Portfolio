import React from 'react';
import NavbarComponent from '../components/Navbar';
import About from '../components/About';
import Techstack from '../components/Techstack';
import Projects from '../components/Projects';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <div className="min-h-screen">
      <NavbarComponent />
      <About/>
      <Techstack />
      <Projects />
      <Contact />
    </div>
  );
};

export default Home;