import React from 'react';
import { AnimeGenre } from '../types/anime';

interface FilterBarProps {
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  selectedFormat: string;
  onSelectFormat: (format: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const GENRES: (string | AnimeGenre)[] = [
  'All',
  'Action',
  'Fantasy',
  'Sci-Fi',
  'Cyberpunk',
  'Adventure',
  'Romance',
  'Slice of Life',
  'Supernatural',
  'Mystery',
];

const FORMATS = ['All', 'TV', 'Movie', 'OVA'];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedGenre,
  onSelectGenre,
  selectedFormat,
  onSelectFormat,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-slate-800/80">
      {/* Genre Segmented Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        {GENRES.map((genre) => {
          const isActive = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onSelectGenre(genre)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Format & Sort Controls */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
        {/* Format Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
          {FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => onSelectFormat(fmt)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                selectedFormat === fmt
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort anime by"
          className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500 cursor-pointer"
        >
          <option value="score">Highest Rated</option>
          <option value="popularity">Most Popular</option>
          <option value="year">Newest Releases</option>
          <option value="episodes">Most Episodes</option>
        </select>
      </div>
    </div>
  );
};
