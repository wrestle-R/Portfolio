import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { ContributionGraph, ContributionGraphSkeleton } from './ui/contribution-graph';
import { getGitHubContributions } from '../lib/github-api';

const Github = () => {
  const [result, setResult] = useState({ status: 'loading', contributions: [] });
  const reducedMotion = useReducedMotion();
  const { status, contributions } = result;
  const loading = status === 'loading';
  const ready = status === 'ready';
  const username = 'wrestle-R';

  useEffect(() => {
    let settled = false;
    const finish = (nextResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      setResult(nextResult);
    };
    // A stalled external service must also leave the loading state.
    const timeout = window.setTimeout(() => {
      finish({ status: 'unavailable', contributions: [] });
    }, 12000);

    getGitHubContributions(username).then((data) => {
      const valid = Array.isArray(data) && data.length > 0 && data.every((day) =>
        day && Number.isFinite(day.count) && day.count >= 0 &&
        typeof day.date === 'string' && Number.isFinite(Date.parse(day.date))
      );
      finish({ status: valid ? 'ready' : 'unavailable', contributions: valid ? data : [] });
    }).catch(() => finish({ status: 'unavailable', contributions: [] }));

    return () => {
      settled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
  const months = new Set(contributions.map((day) => day.date.slice(0, 7)));
  const averageMonthlyContributions = Math.round(totalContributions / Math.max(months.size, 1));
  const now = new Date();
  const currentMonthContributions = contributions.reduce((sum, day) => {
    const date = new Date(day.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      ? sum + day.count : sum;
  }, 0);
  const transition = { duration: reducedMotion ? 0 : 0.35, ease: 'easeOut' };

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
            <div className="grid w-full grid-cols-2 items-center gap-3 mb-4 md:mb-6 sm:grid-cols-[auto_1fr_auto]">
              <h2 className="col-span-2 text-2xl font-bold sm:col-span-1" style={{ color: 'oklch(var(--foreground))' }}>
                GitHub
              </h2>
              <div className="min-h-9 flex items-center">
                {ready ? (
                  <Motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition} className="whitespace-nowrap text-xs md:text-sm font-mono border px-3 py-1.5 rounded-full" style={{ borderColor: 'oklch(var(--border))', color: 'oklch(var(--muted-foreground))' }}>
                    {totalContributions.toLocaleString()} contributions
                  </Motion.span>
                ) : loading ? <span aria-hidden="true" className="github-loading-placeholder animate-pulse h-8 w-36 rounded-full" style={{ backgroundColor: 'oklch(var(--muted))' }} /> : null}
              </div>
              <div className="min-h-9 flex items-center justify-end">
                {ready ? (
                  <Motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition} className="whitespace-nowrap text-xs md:text-sm font-mono border px-3 py-1.5 rounded-full" style={{ borderColor: 'oklch(var(--border))', color: 'oklch(var(--muted-foreground))' }}>
                    {averageMonthlyContributions.toLocaleString()} avg/month
                  </Motion.span>
                ) : loading ? <span aria-hidden="true" className="github-loading-placeholder animate-pulse h-8 w-28 rounded-full" style={{ backgroundColor: 'oklch(var(--muted))' }} /> : null}
              </div>
            </div>

            <p className="sr-only" role="status">
              {loading ? 'Loading GitHub activity.' : ready ? 'GitHub activity loaded.' : 'GitHub activity is temporarily unavailable.'}
            </p>
            <div className="grid w-full min-h-[176px] overflow-x-hidden overflow-y-visible pb-1 pt-1" aria-busy={loading}>
              <AnimatePresence initial={false}>
                <Motion.div
                  key={status}
                  className="col-start-1 row-start-1 flex min-w-0 items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                >
                  {loading ? (
                    <div className="w-full" aria-hidden="true"><ContributionGraphSkeleton /></div>
                  ) : ready ? (
                    <ContributionGraph contributions={contributions} />
                  ) : (
                    <div className="text-center text-sm px-4" style={{ color: 'oklch(var(--muted-foreground))' }}>
                      <p>GitHub activity is temporarily unavailable.</p>
                      <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 underline underline-offset-4">View activity on GitHub</a>
                    </div>
                  )}
                </Motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex flex-row items-center justify-between w-full text-xs font-mono md:min-h-8" style={{ color: "oklch(var(--muted-foreground))" }}>
              <div className="flex items-center">
                {ready ? (
                  <Motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition} className="hidden md:inline-flex border px-3 py-1 rounded-full" style={{ borderColor: "oklch(var(--border))", color: "oklch(var(--muted-foreground))" }}>
                    {currentMonthContributions} this month
                  </Motion.span>
                ) : loading ? <span aria-hidden="true" className="github-loading-placeholder hidden md:block animate-pulse h-7 w-28 rounded-full" style={{ backgroundColor: 'oklch(var(--muted))' }} /> : null}
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
