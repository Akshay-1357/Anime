import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Play, Star } from 'lucide-react';
import { Anime } from '../types/anime';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  animeList: Anime[];
  onPlay: (anime: Anime) => void;
  onViewDetails: (anime: Anime) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  animeList,
  onPlay,
  onViewDetails,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = animeList.filter((a) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      a.title.toLowerCase().includes(q) ||
      a.titleJapanese.toLowerCase().includes(q) ||
      a.romajiTitle.toLowerCase().includes(q) ||
      a.studio.toLowerCase().includes(q) ||
      a.genres.some((g) => g.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-950">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search anime by title, Japanese name, studio, or genre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {query ? `Results (${results.length})` : 'Popular Anime'}
          </div>

          {results.map((anime) => (
            <div
              key={anime.id}
              onClick={() => {
                onViewDetails(anime);
                onClose();
              }}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/80 border border-slate-800/60 transition-colors cursor-pointer group"
            >
              <div className="w-14 sm:w-16 aspect-[3/4] rounded-lg overflow-hidden shrink-0 bg-slate-950">
                <img
                  src={anime.coverImage}
                  alt={anime.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white group-hover:text-rose-400 transition-colors text-sm truncate">
                    {anime.title}
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-400 text-xs font-semibold tabular-nums shrink-0">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {anime.score.toFixed(1)}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 mt-0.5 truncate font-mono">
                  {anime.titleJapanese}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>{anime.format}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{anime.totalEpisodes} Eps</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-500">{anime.genres.slice(0, 2).join(' / ')}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(anime);
                  onClose();
                }}
                className="w-9 h-9 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shrink-0 opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                title="Play Episode 1"
              >
                <Play className="w-4 h-4 fill-white translate-x-0.5" />
              </button>
            </div>
          ))}

          {results.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm">
              No anime found matching "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
