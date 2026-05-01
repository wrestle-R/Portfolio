import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full px-4 pb-10 pt-8" style={{ backgroundColor: 'transparent' }}>
      <div className="mx-auto w-full max-w-4xl">
        <div
          className="rounded-xl border px-5 py-4 md:px-6"
          style={{ backgroundColor: 'oklch(var(--background))', borderColor: 'oklch(var(--border))' }}
        >
          <div className="flex flex-col items-center justify-between gap-3 text-sm md:flex-row">
            <div style={{ color: 'oklch(var(--muted-foreground))' }}>
              © Running out of Excuses | <span className="text-red-500">♥</span> Russel
            </div>

            <div className="flex items-center gap-5 text-sm">
              <a href="mailto:russeldanielpaul@gmail.com" style={{ color: 'oklch(var(--muted-foreground))' }}>
                Email
              </a>
              <a href="https://github.com/wrestle-R" target="_blank" rel="noopener noreferrer" style={{ color: 'oklch(var(--muted-foreground))' }}>
                GitHub
              </a>
              <a href="https://linkedin.com/in/russel-daniel-970b8a303" target="_blank" rel="noopener noreferrer" style={{ color: 'oklch(var(--muted-foreground))' }}>
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
