import React from 'react';
import './footer.css';

const footerLinks = [
  { label: 'Email', href: 'mailto:russeldanielpaul@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/wrestle-R' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/russel-daniel-970b8a303' },
];

export default function Footer() {
  return (
    <footer className="site-footer portfolio-footer">
      <div className="mx-auto w-full max-w-4xl">
        <div className="site-footer-panel">
          <div className="site-footer-signature">
            <p className="site-footer-copyright">© Running out of Excuses</p>
            <p className="site-footer-name"><span className="site-footer-heart">♥</span> Russel</p>
          </div>
          <nav className="site-footer-links" aria-label="Social links">
            {footerLinks.map(({ label, href }) => (
              <a key={label} href={href} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}>{label}</a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
