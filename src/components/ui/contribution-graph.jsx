  import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const ContributionGraph = ({ contributions }) => {
  const { theme } = useTheme();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const visibleWeeks = isMobile ? weeks.slice(-15) : weeks.slice(-39); // Show roughly 9 months on desktop and 3.5 months on mobile

  // Calculate month labels based on visible weeks
  const monthLabels = [];
  let currentMonth = -1;
  visibleWeeks.forEach((week, index) => {
    if (week.length > 0 && week[0].date) {
      const date = new Date(week[0].date);
      const month = date.getMonth();
      if (month !== currentMonth) {
        monthLabels.push({ label: date.toLocaleString('default', { month: 'short' }), index });
        currentMonth = month;
      }
    }
  });

  return (
    <div className="flex flex-col items-center justify-center w-full pb-0 pt-0 group/graph">
      <div className="flex flex-col gap-2 min-w-max">
        {/* Months header */}
        <div className="flex relative h-5 text-[10px] md:text-xs text-muted-foreground mr-2 ml-10">
          {monthLabels.map((m, i) => (
            <div 
              key={i} 
              className="absolute" 
              style={{ left: `calc(${m.index} * (1rem + 0.25rem))` }}
            >
              {m.label}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          {/* Graph cells */}
          <div className="inline-flex gap-1 overflow-visible pb-1 px-1">
            {visibleWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const level = getContributionLevel(day.count);
                  const isLeftEdge = weekIndex < 4;
                  const isRightEdge = weekIndex >= visibleWeeks.length - 4;
                  const isTopRow = dayIndex <= 1;
                  const tooltipPositionClass = isLeftEdge
                    ? 'left-1/2 translate-x-[-10%]'
                    : isRightEdge
                    ? 'left-1/2 translate-x-[-90%]'
                    : 'left-1/2 -translate-x-1/2';
                  const arrowPositionClass = isLeftEdge
                    ? 'left-[10%] -translate-x-1/2'
                    : isRightEdge
                    ? 'left-[90%] -translate-x-1/2'
                    : 'left-1/2 -translate-x-1/2';
                  
                  // Map day counts to formatted text
                  const countText = day.count === 0 ? 'No contributions' : 
                                    day.count === 1 ? '1 contribution' : 
                                    `${day.count} contributions`;

                  let dateStr = '';
                  if (day.date) {
                    const d = new Date(day.date);
                    dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  }

                  return (
                    <motion.div
                      key={`${weekIndex}-${dayIndex}`}
                      whileHover={isMobile ? undefined : { scale: 1.28, zIndex: 40 }}
                      className="group relative"
                    >
                      <div
                        className={`w-4 h-4 rounded-[4px] transition-all duration-200 ${isMobile ? 'cursor-default' : 'cursor-pointer'}`}
                        style={{ 
                          backgroundColor: getColor(level),
                          border: '1px solid oklch(var(--border) / 0.1)',
                        }}
                      />
                      
                      {!isMobile && (
                        <>
                          {/* Tooltip */}
                          <div
                            className={`pointer-events-none absolute ${isTopRow ? 'top-[calc(100%+4px)] mt-2' : 'bottom-[calc(100%+4px)] mb-2'} ${tooltipPositionClass} w-max opacity-0 transition-opacity group-hover:opacity-100 z-[9999]`}
                          >
                            <div className="rounded-md px-3 py-1.5 text-xs shadow-lg font-medium border" style={{ backgroundColor: 'oklch(var(--background))', color: 'oklch(var(--foreground))', borderColor: 'oklch(var(--border))' }}>
                              <span className="font-bold">{countText}</span> on {dateStr}
                            </div>
                            {/* Tooltip arrow */}
                            {isTopRow ? (
                              <>
                                <div className={`absolute bottom-full ${arrowPositionClass} border-[5px] border-transparent`} style={{ borderBottomColor: 'oklch(var(--border))' }} />
                                <div className={`absolute bottom-[calc(100%-1.5px)] ${arrowPositionClass} border-[5px] border-transparent`} style={{ borderBottomColor: 'oklch(var(--background))' }} />
                              </>
                            ) : (
                              <>
                                <div className={`absolute top-full ${arrowPositionClass} border-[5px] border-transparent`} style={{ borderTopColor: 'oklch(var(--border))' }} />
                                <div className={`absolute top-[calc(100%-1.5px)] ${arrowPositionClass} border-[5px] border-transparent`} style={{ borderTopColor: 'oklch(var(--background))' }} />
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContributionGraphSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full animate-pulse pb-0 pt-0">
      <div className="flex flex-col gap-2 min-w-max">
        {/* Months header skeleton */}
        <div className="flex relative h-5 mr-2 ml-10">
          <div className="w-full h-full rounded bg-muted/50" />
        </div>
        
        <div className="flex gap-2">
          <div className="inline-flex gap-1 min-w-max px-1">
            {Array.from({ length: 39 }).map((_, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-4 h-4 rounded-[4px]"
                    style={{ backgroundColor: 'oklch(var(--muted))' }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
