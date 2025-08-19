import React, { useEffect, useState } from 'react';
import { FlickeringGrid } from './ui/flickering-grid';

const BackgroundGrid = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      const darkMode = document.documentElement.classList.contains('dark') || 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(darkMode);
    };

    checkDarkMode();

    // Listen for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <FlickeringGrid
        className="w-full h-full"
        squareSize={3}
        gridGap={8}
        color={isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"}
        maxOpacity={isDark ? 0.03 : 0.02}
        flickerChance={0.05}
      />
    </div>
  );
};

export default BackgroundGrid;
