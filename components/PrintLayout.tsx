import React from 'react';
import { GithubUser, GithubRepo, ProfileAnalysis } from '../types';

interface PrintLayoutProps {
    user: GithubUser | null;
    repos: GithubRepo[];
    analysis: ProfileAnalysis | null;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ user, repos, analysis }) => {
    if (!user || !analysis) return null;

    return (
        <div className="print-only min-h-screen bg-black text-white p-8">
            {/* Report Header */}
            <header className="border-b border-zinc-800 pb-6 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">GITENIUS INTELLIGENCE REPORT</h1>
                    <p className="text-zinc-500 uppercase tracking-widest text-xs">Generated for @{user.login}</p>
                </div>
                <div className="text-right">
                    <p className="text-zinc-500 text-xs uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">CONFIDENTIAL ANALYSIS</p>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* Left Column: Identity & Core Stats */}
                <div className="col-span-4 space-y-8">
                    {/* Profile Card */}
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                        <div className="aspect-square w-full mb-6 border border-zinc-800 bg-zinc-950">
                            <img
                                src={user.avatar_url}
                                alt={user.login}
                                className="w-full h-full object-cover grayscale"
                            />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight mb-1">{user.name || user.login}</h2>
                        <p className="text-zinc-500 text-sm font-mono mb-4">@{user.login}</p>
                        {user.bio && <p className="text-xs text-zinc-400 italic mb-4 border-l-2 border-primary/50 pl-3 leading-relaxed">{user.bio}</p>}

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                            <div>
                                <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-wider block">Repositories</span>
                                <span className="text-xl font-mono">{user.public_repos}</span>
                            </div>
                            <div>
                                <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-wider block">Followers</span>
                                <span className="text-xl font-mono">{user.followers}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack List */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-2">Identified Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysis.techStack.map(tech => (
                                <span key={tech} className="px-2 py-1 text-[10px] font-bold border border-zinc-800 text-zinc-400 uppercase">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Deep Analysis */}
                <div className="col-span-8 space-y-8">
                    {/* Executive Summary */}
                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Executive Summary
                        </h3>
                        <p className="text-sm leading-relaxed text-zinc-300 text-justify columns-1">
                            {analysis.summary}
                        </p>
                    </section>

                    {/* Current Focus */}
                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">
                            Strategic Focus Areas
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            {analysis.currentProjects.map((proj, idx) => (
                                <div key={idx} className="flex gap-4 items-baseline">
                                    <span className="text-primary font-mono text-xs">0{idx + 1}</span>
                                    <span className="text-sm text-zinc-300">{proj}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Top Repositories List (Compact) */}
                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">
                            Key Repository Signals
                        </h3>
                        <div className="space-y-3">
                            {repos
                                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                                .slice(0, 6)
                                .map(repo => (
                                    <div key={repo.id} className="flex justify-between items-baseline text-sm border-b border-zinc-900/50 pb-2">
                                        <span className="font-bold text-zinc-300 truncate w-[30%]">{repo.name}</span>
                                        <span className="text-zinc-500 text-xs italic truncate w-[50%]">{repo.description}</span>
                                        <span className="text-zinc-600 font-mono text-xs w-[10%] text-right">{repo.language}</span>
                                        <span className="text-primary font-mono text-xs w-[10%] text-right">★ {repo.stargazers_count}</span>
                                    </div>
                                ))}
                        </div>
                    </section>
                </div>
            </div>

            <footer className="fixed bottom-8 left-8 right-8 text-[10px] text-zinc-700 font-mono uppercase tracking-widest flex justify-between border-t border-zinc-900 pt-4">
                <span>Gitenius Intelligence System</span>
                <span>Confidential Report</span>
            </footer>
        </div>
    );
};
