
export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  updated_at: string;
  forks_count: number;
}

export interface ProfileAnalysis {
  summary: string;
  techStack: string[];
  currentProjects: string[];
  title: string;
}

export enum SortOrder {
  TOP = 'top',
  LATEST = 'latest'
}
