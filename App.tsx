"use client";

import React, { useState } from 'react';
import { GithubUser, GithubRepo, ProfileAnalysis, SortOrder } from './types';
import { fetchGithubUser, fetchGithubRepos } from './services/githubService';
import { analyzeProfile } from './services/geminiService';
import { LanguageChart } from './components/LanguageChart';
import { LoadingTimeline } from './components/LoadingTimeline';
import { RepoCard } from './components/RepoCard';
import { DownloadButton } from './components/DownloadButton';
import { DevDrawer } from './components/DevDrawer';
import Link from 'next/link';
import { ContributionsDrawer } from './components/ContributionsDrawer';

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [loadingStep, setLoadingStep] = useState(0); // 0: Idle, 1: Fetching Github, 2: Analyzing, 3: Done
  const [error, setError] = useState<string | null>(null);
  const [showDevDrawer, setShowDevDrawer] = useState(false);
  const [showCommits, setShowCommits] = useState(false);

  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.TOP);

  // Keyboard shortcut for search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Right-click override
  React.useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShowDevDrawer(true);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsLoading(true);
    setLoadingStep(1);
    setError(null);
    setUser(null);
    setAnalysis(null);

    try {
      const userData = await fetchGithubUser(username);
      const repoData = await fetchGithubRepos(username);

      setUser(userData);
      setRepos(repoData);

      setLoadingStep(2);
      const analysisData = await analyzeProfile(userData, repoData);

      // Artificial delay for step 1
      await new Promise(resolve => setTimeout(resolve, 1000));

      setLoadingStep(2);
      setAnalysis(analysisData);

      setLoadingStep(3);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setLoadingStep(0);
    } finally {
      setIsLoading(false);
    }
  };


  const sortedRepos = [...repos].sort((a, b) => {
    if (sortOrder === SortOrder.TOP) {
      return b.stargazers_count - a.stargazers_count;
    }
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  }).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col p-6 md:p-12 lg:max-w-7xl lg:mx-auto selection:bg-primary selection:text-primary-foreground">
      {/* Navigation / Logo */}
      <nav className="flex justify-between items-center mb-16">
        <div
          className="cursor-pointer group"
          onClick={() => {
            setUser(null);
            setUsername('');
            setError(null);
            setLoadingStep(0);
          }}
        >
          <h1 className="text-2xl font-bold tracking-tighter text-primary">
            GITENIUS<span className="text-foreground">.</span>
          </h1>
          <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-300" />
        </div>
        <div className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-6">
          <Link
            href="/sponsor"
            className="text-muted hover:text-primary transition-colors border border-zinc-800 px-3 py-1.5 rounded hover:border-primary/50 hidden md:block"
          >
            Sponsor
          </Link>
        </div>
        {user && !isLoading ? (
          <div className="flex gap-6 items-center">
            <button
              onClick={() => {
                setUser(null);
                setUsername('');
                setError(null);
                setLoadingStep(0);
              }}
              className="text-primary hover:text-primary/70 transition-colors"
            >
              SEARCH USERNAME
            </button>
          </div>
        ) : (
          <span className="text-muted">Profile Visualization Engine</span>
        )}
      </nav>

      {/* Landing / Search Section */}
      {
        !user && !isLoading && (
          <section className="flex-grow flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in-95 duration-700">
            <div className="max-w-2xl text-center space-y-8 mb-12">
              <div className="inline-block px-3 py-1 border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                Intelligence System Active
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
                Visualize the technical essence of any developer.
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed uppercase tracking-wide opacity-80">
                Gitenius transforms raw GitHub data into structured technical insights, analyzing stacks, focus areas, and language distribution with precision.
              </p>
            </div>

            <form onSubmit={handleSearch} className="w-full max-w-xl flex flex-col md:flex-row gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="ENTER GITHUB IDENTIFIER..."
                  className="w-full bg-zinc-900 border border-border px-6 py-4 text-sm focus:outline-none focus:border-primary transition-colors uppercase placeholder:text-zinc-700 disabled:opacity-50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  ref={searchInputRef}
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                  <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400 opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground px-10 py-4 text-sm font-bold uppercase hover:bg-green-500 transition-all disabled:opacity-50 active:scale-95 whitespace-nowrap"
              >
                {isLoading ? 'PROCESSING...' : 'INITIALIZE'}
              </button>
            </form>

            {error && (
              <div className="mt-8 p-4 border border-red-900/50 bg-red-900/5 text-red-400 text-xs font-bold uppercase tracking-widest">
                [CRITICAL ERROR]: {error}
              </div>
            )}
          </section>
        )
      }

      {/* Loading Section */}
      {
        isLoading && (
          <section className="flex-grow flex flex-col items-center justify-center py-12">
            <LoadingTimeline currentStep={loadingStep} />
          </section>
        )
      }

      {/* Results Section */}
      {
        user && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Main Top Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">

              {/* Left: Identity Column */}
              <div className="lg:col-span-4 space-y-12">
                <section className="space-y-6">
                  <div className="aspect-square w-full border border-border overflow-hidden bg-zinc-900 relative">
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tighter">{user.name || user.login}</h2>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">@{user.login}</p>
                    {user.bio && <p className="mt-4 text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4">{user.bio}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-bold text-muted border-y border-border py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-600">Repositories</span>
                      <span className="text-foreground text-sm">{user.public_repos}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-600">Followers</span>
                      <span className="text-foreground text-sm">{user.followers}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2 no-print">
                    <DownloadButton username={user.login} />
                    <button
                      onClick={() => setShowCommits(true)}
                      className="w-full py-3 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-[10px] font-bold tracking-widest uppercase text-white hover:text-primary transition-colors text-center block"
                    >
                      VIEW COMMITS
                    </button>
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-[10px] font-bold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors text-center block"
                    >
                      VISIT GITHUB
                    </a>
                  </div>
                </section>

                {/* Language Chart Below Photo */}
                <section className="pt-4 no-print">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted border-b border-border pb-2 mb-4">
                    Language Distribution
                  </h3>
                  <LanguageChart repos={repos} />
                </section>
              </div>

              {/* Right: Intelligence Column */}
              <div className="lg:col-span-8 space-y-12">
                {/* Analysis Header */}
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <span className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted">
                      Automated Profile Intelligence
                    </h3>
                  </div>

                  {analysis ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="md:col-span-2">
                        <div className="mb-6">
                          <h4 className="text-[10px] uppercase font-bold text-primary mb-2 tracking-widest">Professional Identity</h4>
                          <p className="text-2xl md:text-3xl font-light tracking-tight text-white/90 font-serif italic border-l-4 border-primary pl-6 py-2">
                            "{analysis.title}"
                          </p>
                        </div>
                        <h4 className="text-[10px] uppercase font-bold text-primary mb-3 tracking-widest">Executive Summary</h4>
                        <p className="text-base leading-relaxed text-zinc-300 font-light">
                          {analysis.summary}
                        </p>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-[10px] uppercase font-bold text-primary mb-3 tracking-widest">Technical Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.techStack.map(tech => (
                            <span key={tech} className="px-3 py-1.5 text-[10px] font-bold bg-zinc-900 border border-border text-zinc-400 uppercase hover:border-primary/50 transition-colors">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-[10px] uppercase font-bold text-primary mb-3 tracking-widest">Strategic Focus</h4>
                        <ul className="space-y-3">
                          {analysis.currentProjects.map((proj, idx) => (
                            <li key={idx} className="text-xs flex gap-3 group">
                              <span className="text-primary font-bold opacity-50 group-hover:opacity-100 transition-opacity">0{idx + 1}.</span>
                              <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">{proj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-pulse">
                      <div className="h-20 bg-zinc-900/50" />
                      <div className="grid grid-cols-2 gap-8">
                        <div className="h-32 bg-zinc-900/50" />
                        <div className="h-32 bg-zinc-900/50" />
                      </div>
                    </div>
                  )}
                </section>

                {/* Repositories Section */}
                <section className="no-print">
                  <div className="flex justify-between items-end border-b border-border pb-3 mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted">
                      Core Repositories
                    </h3>
                    <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
                      <button
                        onClick={() => setSortOrder(SortOrder.TOP)}
                        className={`${sortOrder === SortOrder.TOP ? 'text-primary' : 'text-zinc-600 hover:text-zinc-400'} transition-colors underline-offset-8 ${sortOrder === SortOrder.TOP ? 'underline' : ''}`}
                      >
                        Impact
                      </button>
                      <button
                        onClick={() => setSortOrder(SortOrder.LATEST)}
                        className={`${sortOrder === SortOrder.LATEST ? 'text-primary' : 'text-zinc-600 hover:text-zinc-400'} transition-colors underline-offset-8 ${sortOrder === SortOrder.LATEST ? 'underline' : ''}`}
                      >
                        Recency
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sortedRepos.map(repo => (
                      <RepoCard key={repo.id} repo={repo} />
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )
      }

      {/* Footer */}
      <footer className="mt-auto pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
        <div className="flex items-center gap-4">
          <span className="text-primary">Gitenius V1</span>
          <span className="opacity-20">|</span>
          <span>© {new Date().getFullYear()}</span>
          <span className="opacity-20">|</span>
          <Link href="/sponsor" className="hover:text-primary transition-colors">
            Sponsor
          </Link>
        </div>
      </footer>

      <DevDrawer isOpen={showDevDrawer} onClose={() => setShowDevDrawer(false)} />
      {user && <ContributionsDrawer isOpen={showCommits} onClose={() => setShowCommits(false)} username={user.login} />}
    </div>
  );
};

export default App;
