import process from 'node:process';

// Keep the existing GraphQL credential on the server, never in the Vite bundle.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_API;
  if (!token) return res.status(503).json({ error: 'Primary activity source unavailable' });
  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      signal: AbortSignal.timeout(3500),
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query { user(login: "wrestle-R") { contributionsCollection { contributionCalendar { weeks { contributionDays { date contributionCount } } } } } }`,
      }),
    });
    if (!response.ok) throw new Error('Upstream failed');
    const data = await response.json();
    const weeks = data.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
    if (data.errors || !Array.isArray(weeks)) throw new Error('Invalid GraphQL response');
    const contributions = weeks.flatMap(week => week.contributionDays.map(day => ({ date: day.date, count: day.contributionCount })));
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ contributions });
  } catch {
    return res.status(502).json({ error: 'Primary activity source unavailable' });
  }
}
