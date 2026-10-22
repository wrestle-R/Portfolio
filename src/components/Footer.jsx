import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import './footer.css';

const footerLinks = [
  { label: 'GitHub', href: 'https://github.com/wrestle-R', Icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/russel-daniel-970b8a303', Icon: Linkedin },
  { label: 'Email', href: 'mailto:russeldanielpaul@gmail.com', Icon: Mail },
];

export default function Footer() {
  return (
    <footer className="site-footer portfolio-footer">
      <div className="site-footer-frame mx-auto max-w-4xl">
        <div className="site-footer-panel">
          <p className="site-footer-copyright"><span className="site-footer-copyright-symbol">©</span><span>Running out of Excuses</span></p>
          <nav className="site-footer-connect" aria-label="Connect">
            <span className="site-footer-connect-label" aria-hidden="true">Connect</span>
            <div className="site-footer-links">
              {footerLinks.map(({ label, href, Icon }) => (
                <a key={label} href={href} title={label} target={href.startsWith('https:') ? '_blank' : undefined} rel={href.startsWith('https:') ? 'noopener noreferrer' : undefined}>
                  {React.createElement(Icon, { size: 15, strokeWidth: 1.5, 'aria-hidden': true })}
                  <span className="site-footer-link-label">{label}</span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
