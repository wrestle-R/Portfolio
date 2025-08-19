import React from 'react';
import { FlickeringGrid } from './ui/flickering-grid';

const BackgroundGrid = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <FlickeringGrid
        className="w-full h-full"
        squareSize={4}
        gridGap={6}
        color="rgb(255, 255, 255)"
        maxOpacity={0.06}
        flickerChance={0.1}
      />
    </div>
  );
};

export default BackgroundGrid;
