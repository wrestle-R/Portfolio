import React, { useEffect, useState } from 'react';
import { ContributionGraph, ContributionGraphSkeleton } from './ui/contribution-graph';
import { getGitHubContributions } from '../lib/github-api';

const Github = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = 'wrestle-R'; // Your GitHub username

  useEffect(() => {
    const fetchContributions = async () => {
      setLoading(true);
      const data = await getGitHubContributions(username);
      setContributions(data);
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
