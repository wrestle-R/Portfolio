// Fetch GitHub contributions data with primary API and fallback
export async function getGitHubContributions(username) {
  const token = import.meta.env.VITE_GITHUB_API;
  
  // Try primary GraphQL API first
  if (token) {
    try {
      const contributions = await getGitHubContributionsGraphQL(username, token);
      if (contributions && contributions.length > 0) {
        const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
        console.log(`Primary API - Total contributions: ${totalContributions}`);
        return contributions;
      }
    } catch (error) {
      console.error('Primary API failed, falling back to jogruber API:', error);
    }
  }
  
  // Fallback to jogruber API
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub contributions');
    }
    
    const data = await response.json();
    
    // Transform the data to our expected format
    const contributions = data.contributions.map(contribution => ({
      date: contribution.date,
      count: contribution.count,
      level: contribution.level
    }));
    
    const totalContributions = contributions.reduce((sum, day) => sum + day.count, 0);
    console.log(`Fallback API - Total contributions: ${totalContributions}`);
    
    return contributions;
  } catch (error) {
    console.error('Error fetching GitHub contributions from fallback API:', error);
    return [];
  }
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
        variables: { username }
      })
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
        level: day.contributionLevel
      }))
    );

    return contributions;
  } catch (error) {
    console.error('Error fetching GitHub contributions from GraphQL:', error);
    throw error;
  }
}
