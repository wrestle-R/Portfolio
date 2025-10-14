// Fetch GitHub contributions data
export async function getGitHubContributions(username) {
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
    
    return contributions;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
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
      throw new Error('Failed to fetch GitHub contributions');
    }

    const data = await response.json();
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
    console.error('Error fetching GitHub contributions:', error);
    return [];
  }
}
