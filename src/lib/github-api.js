// Fetch GitHub contributions data with primary API and fallback
export async function getGitHubContributions(username) {
  const token = import.meta.env.VITE_GITHUB_API;

  let primaryContributions = [];
  let fallbackContributions = [];

  // Try primary GraphQL API first
  if (token) {
    try {
      primaryContributions = await getGitHubContributionsGraphQL(username, token);
      console.log('Primary API Contributions:', primaryContributions);
    } catch (error) {
      console.error('Primary API failed:', error);
    }
  }

  // Fetch from fallback API
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub contributions from fallback API');
    }

    const data = await response.json();

    // Transform the data to our expected format
    fallbackContributions = data.contributions.map(contribution => ({
      date: contribution.date,
      count: contribution.count,
      level: contribution.level,
    }));

    console.log('Fallback API Contributions:', fallbackContributions);
  } catch (error) {
    console.error('Error fetching GitHub contributions from fallback API:', error);
  }

  // Return the primary contributions if available, otherwise fallback contributions
  return primaryContributions.length > 0 ? primaryContributions : fallbackContributions;
}

// Alternative: Fetch contributions using GitHub GraphQL API (requires token)
export async function getGitHubContributionsGraphQL(username, token) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    const weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;

    // Flatten the weeks into a single array of contributions
    const contributions = weeks.flatMap(week =>
      week.contributionDays.map(day => ({
        date: day.date,
        count: day.contributionCount,
        level: day.contributionLevel,
      }))
    );

    return contributions;
  } catch (error) {
    console.error('Error fetching GitHub contributions from GraphQL:', error);
    throw error;
  }
}
