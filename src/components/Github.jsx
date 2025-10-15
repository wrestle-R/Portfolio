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
      className="relative pt-24 px-4" 
      id="github"
      style={{ backgroundColor: 'transparent' }}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-12 text-left">
          <TextGenerateEffect
            words={titleText}
            className="text-3xl font-bold"
            duration={1.5}
            filter={true}
          />
        </div>
        
        <div 
          className="rounded-lg p-4 md:p-6 overflow-x-auto"
          style={{ 
            backgroundColor: 'oklch(var(--muted))',
            border: '1px solid oklch(var(--border))'
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
