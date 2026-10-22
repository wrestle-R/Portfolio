import React, { useState, useEffect } from "react";

const shortBio =
  "I'm a fourth-year computer engineering student. I build web apps and IoT dashboards.";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/wrestle-R",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "russeldanielpaul@gmail.com",
    url: "mailto:russeldanielpaul@gmail.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16v12H4z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 7 8 6 8-6" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/russel-daniel-970b8a303",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const birthTimestamp = new Date("2005-03-22T11:45:00+05:30").getTime();
const getAge = () => ((Date.now() - birthTimestamp) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(8);

function LiveAge() {
  const [age, setAge] = useState(getAge);

  useEffect(() => {
    // Only this number updates; keep its DOM node and opacity stable.
    const interval = setInterval(() => {
      if (!document.hidden) setAge(getAge());
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return <span suppressHydrationWarning className="live-age inline-block whitespace-nowrap tabular-nums tracking-tight" aria-label={`Age: ${Math.floor(Number(age))} years`}>{age}</span>;
}

const About = () => {
  return (
    <section className="relative w-full px-4 pt-6" id="about">
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <article data-portfolio-panel className="hero-intro portfolio-intro relative isolate rounded-xl border">
          <div className="hero-layout">
            <div className="hero-headphone-slot" data-mobile-sticker-slot="headphones" aria-hidden="true" />
            <div className="hero-running-slot" data-mobile-sticker-slot="runny" aria-hidden="true" />

            <div className="hero-copy">
              <p className="hero-command"><span aria-hidden="true">$</span> whoami</p>
              <h1>Russel Daniel Paul</h1>
              <p className="hero-role">Full Stack Developer</p>
              <p className="hero-summary">{shortBio}</p>
            </div>

            <div className="hero-notes">
              <div>
                <p className="hero-command"><span aria-hidden="true">$</span> stack --current</p>
                <p className="hero-note-value">MERN · Next.js · AI/ML · IoT</p>
              </div>
              <div>
                <p className="hero-command"><span aria-hidden="true">$</span> tools --daily</p>
                <p className="hero-note-value">Codex · GitHub Copilot</p>
              </div>
              <div className="hero-blog-note hidden md:block">
                <p className="hero-command"><span aria-hidden="true">$</span> cat blogs.txt --reason</p>
                <p className="hero-note-value">I write down things I don't want to forget: running, Linux, and thoughts that sometimes turn into a whole blog.</p>
              </div>
            </div>

            <div className="hero-socials">
              <a className="hero-project-link" href="#projects">View projects <span aria-hidden="true">↗</span></a>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  data-mobile-hide={social.name === "LinkedIn" ? "true" : undefined}
                  href={social.url}
                  target={social.url.startsWith("https:") ? "_blank" : undefined}
                  rel={social.url.startsWith("https:") ? "noopener noreferrer" : undefined}
                  aria-label={social.url.startsWith("mailto:") ? "Email Russel" : `Visit Russel on ${social.name}`}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </a>
              ))}
            </div>

            <div className="hero-facts hidden md:flex">
              <span>I use Arch, by the way.</span>
              <span className="hero-age"><LiveAge /> <span>years old</span></span>
              <span>Football · Running</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default About;
