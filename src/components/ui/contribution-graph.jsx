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

  // Get color based on contribution level
  const getColor = (level) => {
    const colors = [
      'oklch(0.25 0.01 0)', // Level 0 - almost black
      'oklch(0.55 0.15 145)', // Level 1 - light green
      'oklch(0.50 0.18 145)', // Level 2 - medium green
      'oklch(0.45 0.20 145)', // Level 3 - darker green
      'oklch(0.40 0.22 145)', // Level 4 - darkest green
    ];
    return colors[level];
  };

  // Group contributions by week
  const weeks = [];
  let currentWeek = [];
  
  contributions.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === contributions.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  return (
    <div className="flex items-center scale-115 justify-center">
      {/* Contribution Graph */}
      <div className="inline-flex gap-1 p-5">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => {
              const level = getContributionLevel(day.count);
              const date = new Date(day.date);
              
              return (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  whileHover={{ scale: 1.3 }}
                  className="group relative"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-sm transition-all duration-200 cursor-pointer"
                    style={{ 
                      backgroundColor: getColor(level),
                      border: '1px solid oklch(var(--border) / 0.2)'
                    }}
                  />
                  
                  {/* Tooltip - Always on top, highly visible */}
                  <div 
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-[9999] text-sm font-medium shadow-2xl"
                    style={{ 
                      backgroundColor: 'oklch(0.2 0.01 0)',
                      color: 'oklch(0.95 0.01 0)',
                      border: '2px solid oklch(var(--border))'
                    }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="font-bold text-base" style={{ color: 'oklch(0.65 0.20 145)' }}>
                        {day.count} {day.count === 1 ? 'contribution' : 'contributions'}
                      </div>
                      <div className="text-xs" style={{ color: 'oklch(0.75 0.01 0)' }}>
                        {date.toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                    {/* Arrow */}
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px"
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid oklch(0.2 0.01 0)'
                      }}
                    />
                  </div>
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
