import React from 'react';
import NavbarComponent from '../components/Navbar';
import About from '../components/About';
import Techstack from '../components/Techstack';
import Projects from '../components/Projects';

const Home = () => {
  return (
    <div className="min-h-screen">
      <NavbarComponent />
      <About/>
      <Techstack />
      <Projects />
    </div>
  );
};

export default Home;