import React from 'react';
import { Search, Radio } from 'lucide-react';

export type NavTab = 'browse' | 'trending' | 'seasonal' | 'genres' | 'mylist';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenSearch: () => void;
  onOpenCustomStream: () => void;
  isWatching: boolean;
  onBackToHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onOpenCustomStream,
  isWatching,
  onBackToHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={onBackToHome}
          className="text-xl sm:text-2xl font-extrabold tracking-tight font-display text-rose-500 hover:text-rose-400 transition-colors text-left shrink-0 cursor-pointer"
        >
          KuroNami
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onTabChange('browse')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'browse' && !isWatching
                ? 'text-white border-b-2 border-rose-500 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => onTabChange('trending')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'trending' && !isWatching
                ? 'text-white border-b-2 border-rose-500 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => onTabChange('seasonal')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'seasonal' && !isWatching
                ? 'text-white border-b-2 border-rose-500 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Seasonal
          </button>
          <button
            onClick={() => onTabChange('genres')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'genres' && !isWatching
                ? 'text-white border-b-2 border-rose-500 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Genres
          </button>
          <button
            onClick={() => onTabChange('mylist')}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              activeTab === 'mylist' && !isWatching
                ? 'text-white border-b-2 border-rose-500 font-semibold'
                : 'hover:text-white'
            }`}
          >
            My List
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-slate-900 hover:bg-slate-800 hover:text-slate-200 border border-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Search anime"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded">⌘K</kbd>
          </button>

          <button
            onClick={onOpenCustomStream}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm shadow-rose-950/40"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Custom Stream</span>
          </button>
        </div>
      </div>
    </header>
  );
};
