
import { GithubUser, GithubRepo } from '../types';

export const fetchGithubUser = async (username: string): Promise<GithubUser> => {
  const response = await fetch(`https://api.github.com/users/${username}`);

  if (response.status === 404) {
    throw new Error('User not found');
  }
  if (response.status === 403) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch user details (${response.status})`);
  }

  return response.json();
};

export const fetchGithubRepos = async (username: string): Promise<GithubRepo[]> => {
  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);

  if (response.status === 404) {
    throw new Error('Repositories not found');
  }
  if (response.status === 403) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch repositories (${response.status})`);
  }

  return response.json();
};
