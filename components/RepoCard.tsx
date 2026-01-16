
import React from 'react';
import { GithubRepo } from '../types';

interface RepoCardProps {
  repo: GithubRepo;
}

export const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  return (
    <a 
      href={repo.html_url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group p-4 border border-border bg-zinc-900/50 hover:bg-zinc-900 transition-colors flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-primary font-bold truncate group-hover:underline underline-offset-4">
          {repo.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-muted">
          <span>⭐</span>
          <span>{repo.stargazers_count}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
        {repo.description || "No description provided."}
      </p>
      <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-muted font-bold">
        <span>{repo.language || "Unknown"}</span>
        <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
      </div>
    </a>
  );
};
