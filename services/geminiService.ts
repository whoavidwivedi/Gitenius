

import { GithubUser, GithubRepo, ProfileAnalysis } from "../types";

export const analyzeProfile = async (user: GithubUser, repos: GithubRepo[]): Promise<ProfileAnalysis> => {
  // Client-side service that calls our own API route
  // Prepare context - Optimize by taking only top 15 repos
  const repoData = repos.slice(0, 15).map(r => ({
    name: r.name,
    desc: r.description,
    lang: r.language
  }));

  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userBio: user.bio,
      repoData
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to analyze profile');
  }

  return response.json();
};
