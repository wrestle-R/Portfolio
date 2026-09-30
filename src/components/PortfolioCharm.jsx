import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const runningTimes = [
  ['5k', '26:43'],
  ['10k', '56:24'],
  ['15k', '1:30:03'],
  ['21km', '2:08:21'],
];

export default function PortfolioCharm({ type }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

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
  };

  const labels = {
    headphones: playing ? 'Pause Unsweetened Lemonade on Nirvana 751 ANC' : 'Play Unsweetened Lemonade on Nirvana 751 ANC',
    shoe: 'Running milestones',
    guitar: 'My Cort AF500C guitar',
    laptop: 'Dell Inspiron 16 2-in-1 laptop specifications',
  };

  return (
    <aside className={`portfolio-charm portfolio-charm--${type}`} aria-label={labels[type]}>
      {type === 'headphones' ? (
        <>
          <audio ref={audioRef} preload="none" src="/unsweetened_lemonade.mp3" />
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
      <div className="portfolio-charm__note">
        {type === 'headphones' && <><span className="portfolio-charm__eyebrow">Nirvana 751 ANC · unsweetened lemonade</span><strong>what is life without music</strong><span>{audioError ? 'Audio could not play. Try again.' : playing ? 'click to pause' : 'click the headphones to listen'}</span></>}
        {type === 'shoe' && <><span className="portfolio-charm__eyebrow">running · personal records</span><strong>PR log</strong><dl className="portfolio-charm__times">{runningTimes.map(([distance, time]) => <div key={distance}><dt>{distance}</dt><dd>{time}</dd></div>)}</dl></>}
        {type === 'guitar' && <><span className="portfolio-charm__eyebrow">six strings, some downtime</span><strong>Cort AF500C</strong><span>acoustic guitar</span></>}
        {type === 'laptop' && <><span className="portfolio-charm__eyebrow">daily companion</span><strong>Dell Inspiron 16 2-in-1</strong><span>Intel i7-1360P · 13th Gen</span><span>12 cores · 16 threads</span><span>16GB RAM · 1TB storage</span><span>1920×1080 · Intel Iris Xe Graphics</span></>}
      </div>
    </aside>
  );
}
