import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const SESSION_KEY = 'portfolio:entrance:v1';
let completedInMemory = false;

function hasCompletedEntrance() {
  if (completedInMemory) return true;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === 'complete';
  } catch {
    return false;
  }
}

export function useHomeEntrance() {
  const reducedMotion = useReducedMotion();
  const [firstVisit] = useState(() =>
    !hasCompletedEntrance() &&
    !window.location.hash &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [hasAnchor, setHasAnchor] = useState(() => Boolean(window.location.hash));

  useEffect(() => {
    const complete = () => {
      completedInMemory = true;
      try {
        window.sessionStorage.setItem(SESSION_KEY, 'complete');
      } catch {
        // In-memory state still covers navigation when storage is unavailable.
      }
    };
    const timer = window.setTimeout(complete, reducedMotion || hasAnchor ? 0 : 1500);
    // Once a visitor jumps to an anchor, do not restart the entrance afterward.
    const handleHash = () => {
      if (window.location.hash) setHasAnchor(true);
    };
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('hashchange', handleHash);
    };
  }, [reducedMotion, hasAnchor]);

  return firstVisit && !reducedMotion && !hasAnchor;
}
