import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

const charmPositionKey = (type) => type === 'minecraft'
  ? 'portfolio-charm-position:minecraft:hero'
  : `portfolio-charm-position:${type}`;

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
  const charmRef = useRef(null);
  const audioRef = useRef(null);
  const dragRef = useRef(null);
  const positionRef = useRef(null);
  const suppressClickRef = useRef(false);
  const [position, setPosition] = useState(() => savedPosition(type));
  if (positionRef.current === null) positionRef.current = position;
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    const charm = charmRef.current;
    let frame;
    const constrainPosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!window.matchMedia('(min-width: 1400px)').matches) return;
        const bounds = charm.getBoundingClientRect();
        const section = charm.parentElement.getBoundingClientRect();
        const current = positionRef.current;
        // Keep saved offsets inside the resized viewport and their own section.
        // Section bounds allow stickers further down the page to remain scrollable.
        const margin = 32;
        const baseLeft = bounds.left - current.x;
        const baseTop = bounds.top - current.y;
        const next = {
          x: Math.round(Math.max(margin - baseLeft, Math.min(current.x, window.innerWidth - margin - bounds.width - baseLeft))),
          y: Math.round(Math.max(section.top + margin - baseTop, Math.min(current.y, section.bottom - margin - bounds.height - baseTop))),
        };
        if (next.x === current.x && next.y === current.y) return;
        positionRef.current = next;
        setPosition(next);
      });
    };
    const observer = new ResizeObserver(constrainPosition);
    observer.observe(charm);
    observer.observe(charm.parentElement);
    window.addEventListener('resize', constrainPosition);
    constrainPosition();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', constrainPosition);
    };
  }, []);

  const startDrag = (event) => {
    if (event.button !== 0 || !event.target.closest('.portfolio-charm__object')) return;
    if (!window.matchMedia('(min-width: 1400px) and (hover: hover) and (pointer: fine)').matches) return;
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
      ref={charmRef}
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
        <a href="https://minecraft.russel.is-a.dev" target="_blank" rel="noopener noreferrer" className="portfolio-charm__object minecraft-charm__object" aria-label={labels[type]}>
          <img src={images[type]} alt="" loading="lazy" />
        </a>
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
      {type === 'headphones' && (
        <div className="portfolio-charm__note">
          <span className="portfolio-charm__eyebrow">Nirvana 751 ANC</span>
          <strong>what is life without music</strong>
          <span>{audioError ? 'Audio could not play. Try again.' : playing ? 'click to pause' : 'click the headphones to listen'}</span>
          <span className="portfolio-charm__hint">drag to move</span>
        </div>
      )}
    </aside>
  );
}
