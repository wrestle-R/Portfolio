import React, { useEffect, useState } from 'react';
import { ContributionGraph, ContributionGraphSkeleton } from './ui/contribution-graph';
import { getGitHubContributions } from '../lib/github-api';

const Github = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);
  const [currentMonthContributions, setCurrentMonthContributions] = useState(0);
  const [averageMonthlyContributions, setAverageMonthlyContributions] = useState(0);
  const username = 'wrestle-R'; // Your GitHub username

  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      const data = await getGitHubContributions(username);
      setContributions(data);
      
      // Calculate total contributions
      const total = data.reduce((sum, day) => sum + day.count, 0);
      setTotalContributions(total);

      const uniqueMonths = new Set(
        data
          .filter((day) => day.date)
          .map((day) => {
            const d = new Date(day.date);
            return `${d.getFullYear()}-${d.getMonth()}`;
          }),
      );
      const monthCount = Math.max(uniqueMonths.size, 1);
      setAverageMonthlyContributions(Math.round(total / monthCount));
      
      // Calculate current month contributions
      const now = new Date();
      const currentMonthInt = now.getMonth();
      const currentYearStr = now.getFullYear();
      
      const currentMonthTotal = data.filter(day => {
        const d = new Date(day.date);
        return d.getMonth() === currentMonthInt && d.getFullYear() === currentYearStr;
      }).reduce((sum, day) => sum + day.count, 0);
      
      setCurrentMonthContributions(currentMonthTotal);
      
      setLoading(false);
    };

    fetchContributions();
  }, []);

  return (
    <section 
      className="relative w-full px-4 pt-8 md:pt-10" 
      id="github"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <article 
          className="rounded-xl border p-5 md:p-6 w-full flex flex-col items-center relative overflow-hidden transition-colors duration-300 ease-in-out hover:bg-muted/50" 
          style={{ backgroundColor: "oklch(var(--background))", borderColor: "oklch(var(--border))" }}
        >
            <div className="w-full flex items-start justify-between gap-3 md:gap-4 mb-4 md:mb-6">
              <div className="flex flex-row flex-wrap items-center gap-3 md:gap-4">
                <h2 className="text-2xl font-bold" style={{ color: 'oklch(var(--foreground))' }}>
                  GitHub
                </h2>
                {!loading && (
                  <div className="text-xs md:text-sm font-mono border px-3 py-1.5 rounded-full" style={{ borderColor: 'oklch(var(--border))', color: 'oklch(var(--muted-foreground))' }}>
                    {totalContributions.toLocaleString()} contributions
                  </div>
                )}
              </div>
              {!loading && (
                <div className="text-xs md:text-sm font-mono border px-3 py-1.5 rounded-full shrink-0" style={{ borderColor: 'oklch(var(--border))', color: 'oklch(var(--muted-foreground))' }}>
                  {averageMonthlyContributions.toLocaleString()} avg/month
                </div>
              )}
            </div>

            <div className="w-full overflow-x-hidden overflow-y-visible pb-1 pt-1 flex justify-center">
              {loading ? (
                <ContributionGraphSkeleton />
              ) : (
                <ContributionGraph 
                  contributions={contributions} 
                  username={username}
                />
              )}
            </div>
            
            <div className="mt-4 flex flex-row items-center justify-between w-full text-xs font-mono" style={{ color: "oklch(var(--muted-foreground))" }}>
              <div className="flex items-center">
                {!loading && (
                  <span className="hidden md:inline-flex border px-3 py-1.5 rounded-full" style={{ borderColor: 'oklch(var(--border))' }}>
                    {currentMonthContributions} this month
                  </span>
                )}
              </div>
              <div className="hidden md:flex items-center justify-end gap-2">
                <span>Less</span>
                <div className="flex gap-1 mx-1">
                  <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: 'oklch(var(--muted))' }}></div>
                  <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: 'oklch(0.65 0.05 0)', opacity: 0.4 }}></div>
                  <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: 'oklch(0.55 0.04 0)', opacity: 0.6 }}></div>
                  <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: 'oklch(0.45 0.03 0)', opacity: 0.8 }}></div>
                  <div className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: 'oklch(0.25 0.01 0)' }}></div>
                </div>
                <span>More</span>
              </div>
            </div>
        </article>
      </div>
    </section>
  );
};

export default Github;
