import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const ContributionGraph = ({ contributions, username }) => {
  const { theme } = useTheme();

  if (!contributions || contributions.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-sm" style={{ color: 'oklch(var(--muted-foreground))' }}>
          Loading contributions...
        </p>
      </div>
    );
  }

  const getContributionLevel = (count) => {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 9) return 3;
    return 4;
  };

  const getColor = (level) => {
    const darkColors = [
      'oklch(0.25 0.01 0)',
      'oklch(0.35 0.02 0)',
      'oklch(0.45 0.03 0)',
      'oklch(0.55 0.04 0)',
      'oklch(0.65 0.05 0)',
    ];

    const lightColors = [
      'oklch(0.95 0.01 0)',
      'oklch(0.85 0.02 0)',
      'oklch(0.75 0.03 0)',
      'oklch(0.65 0.04 0)',
      'oklch(0.55 0.05 0)',
    ];

    return theme === 'dark' ? darkColors[level] : lightColors[level];
  };

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
    <div className="flex items-center justify-start md:overflow-x-hidden md:scale-115 md:justify-center">
      <div className="inline-flex gap-1 overflow-x-auto md:overflow-x-hidden">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => {
              const level = getContributionLevel(day.count);

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
    <div className="flex items-center justify-start md:justify-center animate-pulse">
      <div className="inline-flex gap-1 min-w-max">
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
