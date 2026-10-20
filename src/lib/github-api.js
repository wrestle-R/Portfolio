// Public endpoints only: VITE_* values are bundled into visitors' browsers.
const request = async (url, signal) => {
  const response = await fetch(url, { signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(4000)]) : AbortSignal.timeout(4000) });
  if (!response.ok) throw new Error(`GitHub activity request failed (${response.status})`);
  return response.json();
};

export async function getGitHubContributions(username, { signal } = {}) {
  const login = encodeURIComponent(username);
  let contributions;
  // Sequential fallbacks: stop as soon as one source has real contributions.
  // All-zero calendars are retained, but checked against the second source.
  for (const url of [
    '/api/github-contributions',
    `https://github-contributions-api.jogruber.de/v4/${login}?y=last`,
  ]) {
    try {
      const data = await request(url, signal);
      if (!Array.isArray(data.contributions) || !data.contributions.length || !data.contributions.every(day =>
        /^\d{4}-\d{2}-\d{2}$/.test(day.date) && Number.isFinite(Date.parse(day.date)) && Number.isInteger(day.count) && day.count >= 0
      )) throw new Error('Invalid contribution calendar');
      contributions = data.contributions.map(({ date, count }) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
      if (contributions.some(day => day.count > 0)) return { contributions, kind: 'contributions' };
    } catch (error) {
      if (signal?.aborted) throw error;
    }
  }

  // An Events API page is a capped sample, not contribution history. Never
  // expand it into a yearly calendar or treat unreturned dates as zero activity.
  if (contributions) return { contributions, kind: 'empty' };
  throw new Error('GitHub contribution history is unavailable');
}
