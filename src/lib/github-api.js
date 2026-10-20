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

  // GitHub sometimes reports an empty contribution calendar while public events
  // remain available. Events are a different metric, labelled as such in the UI.
  try {
    const events = await request(`https://api.github.com/users/${login}/events/public?per_page=100`, signal);
    if (!Array.isArray(events)) throw new Error('Invalid public activity');
    const counts = new Map();
    const seen = new Set();
    for (const event of events) {
      if (!event.id || seen.has(event.id) || !Number.isFinite(Date.parse(event.created_at))) continue;
      seen.add(event.id);
      const date = event.created_at.slice(0, 10);
      counts.set(date, (counts.get(date) || 0) + 1);
    }
    if (counts.size) {
      const today = new Date();
      const start = new Date(`${[...counts.keys()].sort()[0]}T00:00:00Z`);
      const days = [];
      for (let day = start; day.toISOString().slice(0, 10) <= today.toISOString().slice(0, 10); day.setUTCDate(day.getUTCDate() + 1)) {
        const date = day.toISOString().slice(0, 10);
        days.push({ date, count: counts.get(date) || 0 });
      }
      return { contributions: days, kind: 'events' };
    }
  } catch (error) {
    if (signal?.aborted) throw error;
  }
  if (contributions) return { contributions, kind: 'contributions' };
  throw new Error('GitHub activity is unavailable');
}
