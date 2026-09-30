import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const runningTimes = [
  ['5k', '26:43'],
  ['10k', '56:24'],
  ['15k', '1:30:03'],
  ['21km', '2:08:21'],
];

const charmPositionKey = (type) => `portfolio-charm-position:${type}`;

function savedPosition(type) {
  try {
    const position = JSON.parse(localStorage.getItem(charmPositionKey(type)));
    if (Number.isFinite(position?.x) && Number.isFinite(position?.y)) return position;
  } catch {
    // Private browsing or an invalid saved value should leave the charm in place.
  }
  return { x: 0, y: 0 };
}

export default function PortfolioCharm({ type }) {
  const audioRef = useRef(null);
  const dragRef = useRef(null);
  const positionRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [position, setPosition] = useState(() => savedPosition(type));
  if (positionRef.current === null) positionRef.current = position;
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const startDrag = (event) => {
    if (event.button !== 0 || !event.target.closest('.portfolio-charm__object')) return;
    if (!window.matchMedia('(min-width: 1600px) and (hover: hover) and (pointer: fine)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      position: positionRef.current,
      bounds,
      moving: false,
    };
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moving && Math.hypot(dx, dy) < 5) return;
    if (!drag.moving) {
      drag.moving = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
    const margin = 32;
    const boundedX = Math.max(Math.min(0, margin - drag.bounds.left), Math.min(dx, Math.max(0, window.innerWidth - margin - drag.bounds.right)));
    const boundedY = Math.max(Math.min(0, margin - drag.bounds.top), Math.min(dy, Math.max(0, window.innerHeight - margin - drag.bounds.bottom)));
    const next = { x: Math.round(drag.position.x + boundedX), y: Math.round(drag.position.y + boundedY) };
    positionRef.current = next;
    setPosition(next);
  };

  const finishDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.moving) return;
    suppressClickRef.current = true;
    window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    try {
      localStorage.setItem(charmPositionKey(type), JSON.stringify(positionRef.current));
    } catch {
      // The charm remains movable when storage is unavailable.
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const resetPosition = () => {
    const origin = { x: 0, y: 0 };
    positionRef.current = origin;
    setPosition(origin);
    try { localStorage.removeItem(charmPositionKey(type)); } catch { /* Storage may be unavailable. */ }
  };

  useEffect(() => {
    if (type !== 'headphones') return undefined;
    const audio = audioRef.current;
    const stop = () => setPlaying(false);
    audio.addEventListener('ended', stop);
    audio.addEventListener('pause', stop);
    return () => {
      audio.pause();
      audio.removeEventListener('ended', stop);
      audio.removeEventListener('pause', stop);
    };
  }, [type]);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
        setAudioError(false);
      } catch {
        setAudioError(true);
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  };

  const images = {
    headphones: '/charms/headphones.png',
    shoe: '/charms/running-shoe.png',
    guitar: '/charms/guitar.png',
    laptop: '/charms/dell-laptop.png',
    minecraft: '/charms/minecraft-wrestle.png',
    blog: '/charms/blog-notebook.png',
    football: '/charms/football.png',
    hills: '/charms/hill-station.png',
    arch: '/charms/arch-linux-mark.svg',
  };

  const labels = {
    headphones: playing ? 'Pause music on Nirvana 751 ANC' : 'Play music on Nirvana 751 ANC',
    shoe: 'Running milestones',
    guitar: 'My Cort AF500C guitar',
    laptop: 'Dell Inspiron 16 2-in-1 laptop specifications',
    minecraft: 'Enter Russel’s Minecraft world',
    blog: 'Read Russel’s blog',
    football: 'Football: Football is LIFE',
    hills: 'I like Hill stations',
    arch: 'Read my Arch Linux blog post',
  };

  return (
    <aside
      className={`portfolio-charm portfolio-charm--${type}`}
      aria-label={labels[type]}
      style={{ '--charm-drag-x': `${position.x}px`, '--charm-drag-y': `${position.y}px` }}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onClickCapture={(event) => {
        if (!suppressClickRef.current) return;
        event.preventDefault();
        event.stopPropagation();
        suppressClickRef.current = false;
      }}
      onDragStart={(event) => event.preventDefault()}
    >
      {type === 'blog' || type === 'arch' ? (
        <a href={type === 'blog' ? '/blogs' : 'https://blogs.russel.is-a.dev/blog/linux-experience'} target="_blank" rel="noopener noreferrer" className="portfolio-charm__object" aria-label={labels[type]}>
          <img src={images[type]} alt="" loading="lazy" />
        </a>
      ) : type === 'minecraft' ? (
        <Link to="/minecraft" className="portfolio-charm__object minecraft-charm__object" aria-label={labels[type]}>
          <img src={images[type]} alt="" loading="lazy" />
          <span className="minecraft-gamertag" aria-hidden="true">wrestle</span>
        </Link>
      ) : type === 'headphones' ? (
        <>
          <audio ref={audioRef} preload="none" src="/unsweetened_lemonade-after-14s.mp3" />
          <button type="button" className="portfolio-charm__object" onClick={toggleAudio} aria-label={labels[type]} aria-pressed={playing}>
            <img src={images[type]} alt="Black over-ear headphones" loading="lazy" />
            <span className="portfolio-charm__play" aria-hidden="true">{playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</span>
          </button>
        </>
      ) : (
        <div className="portfolio-charm__object" tabIndex="0" role="img" aria-label={labels[type]}>
          <img src={images[type]} alt="" loading="lazy" />
        </div>
      )}
      {(position.x !== 0 || position.y !== 0) && (
        <button type="button" className="portfolio-charm__reset" onClick={resetPosition} aria-label={`Reset ${type} charm position`} title="Reset position">
          <RotateCcw size={14} aria-hidden="true" />
        </button>
      )}
      <div className="portfolio-charm__note">
        {type === 'headphones' && <><span className="portfolio-charm__eyebrow">Nirvana 751 ANC</span><strong>what is life without music</strong><span>{audioError ? 'Audio could not play. Try again.' : playing ? 'click to pause' : 'click the headphones to listen'}</span></>}
        {type === 'shoe' && <><span className="portfolio-charm__eyebrow">running · personal records</span><strong>Personal bests</strong><dl className="portfolio-charm__times">{runningTimes.map(([distance, time]) => <div key={distance}><dt>{distance}</dt><dd>{time}</dd></div>)}</dl></>}
        {type === 'guitar' && <><span className="portfolio-charm__eyebrow">six strings, some downtime</span><strong>Cort AF500C</strong><span>acoustic guitar</span></>}
        {type === 'laptop' && <><span className="portfolio-charm__eyebrow">daily companion</span><strong>Dell Inspiron 16 2-in-1</strong><span>Intel i7-1360P · 13th Gen</span><span>12 cores · 16 threads</span><span>16GB RAM · 1TB storage</span><span>1920×1080 · Intel Iris Xe Graphics</span></>}
        {type === 'minecraft' && <><span className="portfolio-charm__eyebrow">another world, same builder</span><strong>Minecraft</strong><span>click to explore</span></>}
        {type === 'blog' && <><span className="portfolio-charm__eyebrow">notes from the journey</span><strong>Read the blog</strong><span>thoughts, projects &amp; everything in between</span></>}
        {type === 'football' && <><span className="portfolio-charm__eyebrow">football</span><strong>Kneed for speed</strong></>}
        {type === 'hills' && <><span className="portfolio-charm__eyebrow">fresh air &amp; winding roads</span><strong>I like Hill stations</strong></>}
        {type === 'arch' && <><span className="portfolio-charm__eyebrow">i use arch btw</span><strong>The Linux Experience</strong><span>read my Arch Linux story</span></>}
        <span className="portfolio-charm__hint">drag to move</span>
      </div>
    </aside>
  );
}
