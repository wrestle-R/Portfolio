import React, { useEffect, useState } from 'react';
import { ContributionGraph, ContributionGraphSkeleton } from './ui/contribution-graph';
import { getGitHubContributions } from '../lib/github-api';
import { TextGenerateEffect } from './ui/text-generate-effect';

const Github = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalContributions, setTotalContributions] = useState(0);
  const username = 'wrestle-R'; // Your GitHub username
  const titleText = "GitHub Activity";

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
      className="relative mt-8" 
      id="github"
      style={{ backgroundColor: 'oklch(var(--background))' }}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-4 text-left sm:pl-0 pl-3">
          <TextGenerateEffect
            words={titleText}
            className="text-3xl font-bold"
            duration={1.5}
            filter={true}
          />
        </div>
        
        <div 
          className="rounded-lg shadow-lg border"
          style={{ 
            backgroundColor: 'oklch(var(--card))',
            borderColor: 'oklch(var(--border))'
          }}
        >
          {loading ? (
            <ContributionGraphSkeleton />
          ) : (
            <ContributionGraph 
              contributions={contributions} 
              username={username}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Github;
