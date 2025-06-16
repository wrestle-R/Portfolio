import React from 'react';
import NavbarComponent from '../components/Navbar';
import About from '../components/About';
import Techstack from '../components/Techstack';
import Projects from '../components/Projects';
import Achievements from '../components/Achievements';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <NavbarComponent />
      <About/>
      <Techstack />
      <Projects />
      <Achievements />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;