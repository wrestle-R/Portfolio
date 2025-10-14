import React, { useEffect, useState } from 'react';
import { FlickeringGrid } from './ui/flickering-grid';

const BackgroundGrid = () => {
  const [gridColor, setGridColor] = useState('rgb(255, 255, 255)');

  useEffect(() => {
    const updateGridColor = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      // Light theme: use dark color for grid, Dark theme: use light color for grid
      setGridColor(theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)');
    };

    updateGridColor();
    
    // Watch for theme changes
    const observer = new MutationObserver(updateGridColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <FlickeringGrid
        className="w-full h-full"
        squareSize={4}
        gridGap={6}
        color={gridColor}
        maxOpacity={0.06}
        flickerChance={0.1}
      />
    </div>
  );
};

export default BackgroundGrid;
