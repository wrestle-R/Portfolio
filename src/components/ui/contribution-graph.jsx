import React from 'react';
import { motion } from 'framer-motion';

export const ContributionGraph = ({ contributions, username }) => {
  if (!contributions || contributions.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
          Loading contributions...
        </p>
      </div>
    );
  }

  // Get contribution level for color intensity
  const getContributionLevel = (count) => {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 9) return 3;
    return 4;
  };

  // Get color based on contribution level (shades of black and gray)
  const getColor = (level) => {
    const colors = [
      'oklch(0.25 0.01 0)', // Level 0 - black
      'oklch(0.35 0.02 0)', // Level 1 - dark gray
      'oklch(0.45 0.03 0)', // Level 2 - medium gray
      'oklch(0.55 0.04 0)', // Level 3 - light gray
      'oklch(0.65 0.05 0)', // Level 4 - lightest gray
    ];
    return colors[level];
  };

  // Group contributions by week (Sunday to Saturday)
  const weeks = [];
  let currentWeek = [];
  
  contributions.forEach((day, index) => {
    currentWeek.push(day);
    // Complete week has 7 days or it's the last day
    if (currentWeek.length === 7 || index === contributions.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div className="flex items-center scale-115 justify-center overflow-x-auto md:overflow-x-visible">
      {/* Contribution Graph */}
      <div className="inline-flex gap-1 p-5 min-w-max">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => {
              const level = getContributionLevel(day.count);

              return (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  whileHover={{ scale: 1.3 }}
                  className="group relative"
                  style={{
                    zIndex: 1, // Lower z-index for graph nodes
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-sm transition-all duration-200 cursor-pointer"
                    style={{ 
                      backgroundColor: getColor(level),
                      border: '1px solid oklch(var(--border) / 0.2)',
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ContributionGraphSkeleton = () => {
  return (
    <div className="flex items-center justify-center p-4 animate-pulse">
      <div className="inline-flex gap-1">
        {Array.from({ length: 52 }).map((_, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: 'oklch(var(--muted))' }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
