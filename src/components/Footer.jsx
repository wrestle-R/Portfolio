import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-neutral-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Copyright */}
          <div className="text-sm text-neutral-400">
            © {currentYear} Russel Daniel Paul. All rights reserved.
          </div>
          
          {/* Right side - Simple links */}
          <div className="flex space-x-6 text-sm">
            <a 
              href="mailto:russeldanielpaul@gmail.com" 
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Email
            </a>
            <a 
              href="https://github.com/wrestle-R" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a 
              href="https://linkedin.com/in/russel-daniel-970b8a303" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
