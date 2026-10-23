import React, { useEffect, useRef, useState } from 'react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { techData } from './tech/TechData';
import { useTheme } from '../context/ThemeContext';
import iconPaths from './tech/IconPaths.json';
import './techstack.css';

// Keep the complete desktop inventory; phones show a curated set in all six groups.
const mobileNames = new Set([
  'JavaScript', 'TypeScript', 'Python', 'SQL',
  'React', 'Next.js', 'Tailwind CSS', 'Tauri',
  'Node.js', 'FastAPI', 'MQTT',
  'MongoDB', 'PostgreSQL',
  'Vercel', 'Cloudflare Workers',
  'Git & GitHub', 'VS Code', 'Codex', 'Docker',
]);

function TechIcon({ item, theme }) {
  const [failedSource, setFailedSource] = useState(null);
  const original = theme === 'dark' ? item.iconDark || item.icon : item.iconLight || item.icon;
  const source = iconPaths[original] || original;
  return (
    <span className="magnetic-stack__icon" data-tool={item.name} aria-hidden="true">
      {source && failedSource !== source ? (
        <img src={source} alt="" loading="lazy" decoding="async" width="24" height="24" onError={() => setFailedSource(source)} />
      ) : (
        <span className="magnetic-stack__initials">{item.name.slice(0, 2)}</span>
      )}
    </span>
  );
}

function MagneticTile({ category, index, theme, reducedMotion }) {
  const frame = useRef(null);
  const tile = useRef(null);
  const mobileCount = category.items.filter(item => mobileNames.has(item.name)).length;

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  function followPointer(event) {
    if (event.pointerType !== 'mouse' || reducedMotion) return;
    const element = tile.current;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      element.style.setProperty('--magnet-x', `${x * 100}%`);
      element.style.setProperty('--magnet-y', `${y * 100}%`);
      element.style.setProperty('--magnet-rx', `${(y - .5) * -7}deg`);
      element.style.setProperty('--magnet-ry', `${(x - .5) * 7}deg`);
      frame.current = null;
    });
  }

  function resetPointer() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    tile.current?.style.setProperty('--magnet-rx', '0deg');
    tile.current?.style.setProperty('--magnet-ry', '0deg');
    tile.current?.style.removeProperty('--magnet-x');
    tile.current?.style.removeProperty('--magnet-y');
  }

  return (
    <Motion.section
      ref={tile}
      className="magnetic-stack__tile"
      aria-labelledby={`stack-category-${index}`}
      initial={reducedMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: .15 }}
      transition={{ duration: .5, delay: index * .055 }}
      onPointerMove={followPointer}
      onPointerLeave={resetPointer}
      onPointerCancel={resetPointer}
    >
      <h3 id={`stack-category-${index}`}>
        <span className="magnetic-stack__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        {category.category}
        <span className="magnetic-stack__count" aria-hidden="true"><span className="magnetic-stack__desktop">{category.items.length}</span><span className="magnetic-stack__mobile">{mobileCount}</span></span>
      </h3>
      <ul className="magnetic-stack__tools">
        {category.items.map(item => (
          <li key={item.name} className={mobileNames.has(item.name) ? undefined : 'magnetic-stack__desktop'}>
            <TechIcon item={item} theme={theme} />
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </Motion.section>
  );
}

export default function Techstack() {
  const { theme } = useTheme();
  const reducedMotion = useReducedMotion();
  return (
    <section className="relative w-full px-4 pt-8 md:pt-10 magnetic-stack" id="tech" aria-labelledby="tech-stack-title">
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <article data-portfolio-panel className="magnetic-stack__panel">
          <header className="magnetic-stack__header">
            <div><p>~/russel/stack.json</p><h2 id="tech-stack-title">Tech Stack<span>.</span></h2></div>
          </header>
          <div className="magnetic-stack__grid">
            {techData.map((category, index) => <MagneticTile key={category.category} category={category} index={index} theme={theme} reducedMotion={reducedMotion} />)}
          </div>
        </article>
      </div>
    </section>
  );
}
