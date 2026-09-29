import { useEffect, useRef, useState } from "react";
import musicUrl from "../assets/audio/snowfall.mp3?url";

const preferenceKey = "minecraft-music-muted";
function savedMuted() {
  try {
    return localStorage.getItem(preferenceKey) === "true";
  } catch {
    return false;
  }
}

export default function AmbientMusic() {
  const audio = useRef(null);
  const wanted = useRef(!savedMuted());
  const activated = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const player = new Audio(musicUrl);
    player.loop = true;
    player.preload = "none";
    player.volume = 0.22;
    audio.current = player;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    player.addEventListener("playing", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("error", onPause);
    const start = (event) => {
      if (event.target.closest?.(".mc-music, .mc-back")) return;
      if (!wanted.current || document.hidden || !player.paused) return;
      // A real pointer/key gesture satisfies browser audio policies.
      activated.current = true;
      player.play().catch(() => setPlaying(false));
    };
    const visibility = () => {
      if (document.hidden) player.pause();
      else if (wanted.current && activated.current)
        player.play().catch(() => setPlaying(false));
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      document.removeEventListener("visibilitychange", visibility);
      player.removeEventListener("playing", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("error", onPause);
      player.pause();
      player.removeAttribute("src");
      player.load();
      audio.current = null;
    };
  }, []);

  function toggle() {
    const player = audio.current;
    if (!player) return;
    wanted.current = player.paused;
    try {
      localStorage.setItem(preferenceKey, String(!wanted.current));
    } catch {
      /* Audio still works when storage is disabled. */
    }
    if (wanted.current) {
      activated.current = true;
      player.play().catch(() => setPlaying(false));
    } else player.pause();
  }

  return (
    <button
      className="mc-music"
      onClick={toggle}
      aria-label={playing ? "Mute music" : "Play soft music"}
      aria-pressed={playing}
      title={playing ? "Mute music" : "Play soft music"}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        {playing ? (
          <>
            <path d="M15 8a6 6 0 0 1 0 8" />
            <path d="M18 5a10 10 0 0 1 0 14" />
          </>
        ) : (
          <path d="m16 9 6 6m0-6-6 6" />
        )}
      </svg>
    </button>
  );
}
