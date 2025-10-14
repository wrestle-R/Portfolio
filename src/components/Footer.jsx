import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8" style={{ backgroundColor: 'oklch(var(--background))', borderTop: '1px solid oklch(var(--border))' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Copyright */}
          <div className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
            © {currentYear} Russel Daniel Paul. All rights reserved.
          </div>
          
          {/* Right side - Simple links */}
          <div className="flex space-x-6 text-sm">
            <a 
              href="mailto:russeldanielpaul@gmail.com" 
              className="transition-colors"
              style={{ color: 'oklch(var(--muted-foreground))' }}
            >
              Email
            </a>
            <a 
              href="https://github.com/wrestle-R" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: 'oklch(var(--muted-foreground))' }}
            >
              GitHub
            </a>
            <a 
              href="https://linkedin.com/in/russel-daniel-970b8a303" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-colors"
              style={{ color: 'oklch(var(--muted-foreground))' }}
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
