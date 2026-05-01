import React, { useEffect, useState } from 'react';
import { ContributionGraph, ContributionGraphSkeleton } from './ui/contribution-graph';
import { getGitHubContributions } from '../lib/github-api';
import { TextGenerateEffect } from './ui/text-generate-effect';

const Github = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);
  const username = 'wrestle-R'; // Your GitHub username
  const titleText = "GitHub";

  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      const data = await getGitHubContributions(username);
      setContributions(data);
      
      // Calculate total contributions
      const total = data.reduce((sum, day) => sum + day.count, 0);
      setTotalContributions(total);
      
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
        <div className="mb-3 md:mb-4 pb-4 md:pb-6 text-left pl-2">
          <TextGenerateEffect
            words={titleText}
            className="text-3xl font-bold"
            duration={1.5}
            filter={true}
          />
        </div>
        
        <article 
          className="rounded-xl border p-4 md:p-6 w-full flex flex-col items-center relative overflow-hidden transition-colors duration-300 ease-in-out hover:bg-muted/50" 
          style={{ backgroundColor: "oklch(var(--background))", borderColor: "oklch(var(--border))" }}
        >
            <div className="w-full flex mb-4">
              {!loading && (
                <div className="text-xs md:text-sm font-mono border px-3 py-1.5 rounded-full" style={{ borderColor: 'oklch(var(--border))', color: 'oklch(var(--muted-foreground))' }}>
                  {totalContributions.toLocaleString()} contributions
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
            
            <div className="mt-4 hidden md:flex items-center justify-end w-full gap-2 text-xs font-mono" style={{ color: "oklch(var(--muted-foreground))" }}>
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
        </article>
      </div>
    </section>
  );
};

export default Github;
