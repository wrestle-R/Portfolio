import React from 'react';
import NavbarComponent from '../components/Navbar';
import About from '../components/About';
import Techstack from '../components/Techstack';

const Home = () => {
  return (
    <div className="min-h-screen">
      <NavbarComponent />
      <About/>
      <Techstack />
    </div>
  );
};

export default Home;