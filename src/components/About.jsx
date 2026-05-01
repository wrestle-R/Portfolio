import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const shortBio =
  "Engineering student who enjoys building real products, breaking things, and fixing them fast.";

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

const About = () => {
  const [ageParts, setAgeParts] = useState({ whole: "0", decimal: "0000000000" });

  useEffect(() => {
    const birthDate = new Date("2005-03-22T11:45:00+05:30").getTime();
    
    const updateAge = () => {
      const now = Date.now();
      const diff = now - birthDate;
      const ageInYears = diff / (1000 * 60 * 60 * 24 * 365.25);
      const formattedAge = ageInYears.toFixed(10);
      const [whole = "0", decimal = "0000000000"] = formattedAge.split(".");
      setAgeParts({ whole, decimal });
    };
    
    updateAge();
    const interval = setInterval(updateAge, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="relative flex w-full items-center justify-center px-4 pt-28"
      id="about"
      style={{ backgroundColor: "oklch(var(--background))" }}
    >
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <article 
          className="rounded-xl border p-5 md:p-6 transition-colors duration-300 ease-in-out hover:bg-muted/50" 
          style={{ backgroundColor: "oklch(var(--background))", borderColor: "oklch(var(--border))" }}
        >
          <div className="relative">
            {/* Arch Logo / details on top right */}
            <div className="hidden md:flex absolute top-0 right-0 flex-col items-start text-sm font-mono opacity-90" style={{ color: "oklch(var(--foreground) / 0.82)" }}>
              <div className="flex items-center">
                <svg className="w-3 h-3 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 22h4.5l5.5-12.5L17.5 22H22L12 2zm0 6.5l-3 7h6l-3-7z" />
                </svg>
                <span>i use arch btw</span>
              </div>
              <div className="flex flex-col items-start mt-2 space-y-1.5 text-sm text-current">
                <div className="flex items-center gap-1.5">
                  <span className="tabular-nums tracking-tight">{ageParts.whole}.</span>
                  <motion.span
                    key={ageParts.decimal}
                    initial={{ opacity: 0.55 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
                    className="tabular-nums tracking-tight"
                  >
                    {ageParts.decimal}
                  </motion.span>
                </div>
                <span>Third year in computer engineering</span>
                <span>Football | Running</span>
              </div>
            </div>

            <div className="space-y-2 font-mono text-sm">
              <p>
                <span style={{ color: "oklch(var(--muted-foreground))" }}>$</span> whoami
              </p>
              <p className="pl-4" style={{ color: "oklch(var(--muted-foreground))" }}>
                Russel Daniel Paul
              </p>
              <p>
                <span style={{ color: "oklch(var(--muted-foreground))" }}>$</span> stack --current
              </p>
              <p className="pl-4" style={{ color: "oklch(var(--muted-foreground))" }}>
                mern | next | ai/ml | iot
              </p>
              <p>
                <span style={{ color: "oklch(var(--muted-foreground))" }}>$</span> tools --daily
              </p>
              <p className="pl-4" style={{ color: "oklch(var(--muted-foreground))" }}>
                Codex | GitHub Copilot
              </p>
              <div className="hidden md:block">
                <p>
                  <span style={{ color: "oklch(var(--muted-foreground))" }}>$</span> cat blogs.txt --reason
                </p>
                <p className="pl-4 leading-relaxed" style={{ color: "oklch(var(--muted-foreground))" }}>
                  writing to remember, think clearly, and leave proof of how I learn and build.
                </p>
                <p className="pl-4 leading-relaxed" style={{ color: "oklch(var(--muted-foreground))" }}>
                  Leave something useful for others (and your future self)
                </p>
              </div>
              <p>
                <span style={{ color: "oklch(var(--muted-foreground))" }}>$</span> cat mindset.txt
              </p>
              <p className="pl-4 leading-relaxed" style={{ color: "oklch(var(--muted-foreground))" }}>
                {shortBio}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit Russel on ${social.name}`}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors duration-300 hover:bg-black/5 hover:[animation:wiggle_0.45s_ease-in-out] active:[animation:wiggle_0.35s_ease-in-out] focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{
                    borderColor: "oklch(var(--border))",
                    color: "oklch(var(--muted-foreground))",
                    outlineColor: "oklch(var(--foreground))",
                  }}
                >
                  {social.icon}
                  {social.name !== "X" ? <span>{social.name}</span> : null}
                </a>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default About;
