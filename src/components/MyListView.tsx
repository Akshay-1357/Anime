import React, { useState } from 'react';
import { Bookmark, Play, Trash2, Star, CheckCircle } from 'lucide-react';
import { Anime, WatchlistItem, WatchlistStatus } from '../types/anime';
import { AnimeCard } from './AnimeCard';

interface MyListViewProps {
  watchlistMap: Record<string, WatchlistItem>;
  animeList: Anime[];
  onPlay: (anime: Anime) => void;
  onViewDetails: (anime: Anime) => void;
  onRemoveFromWatchlist: (animeId: string) => void;
  onUpdateStatus: (animeId: string, status: WatchlistStatus) => void;
}

export const MyListView: React.FC<MyListViewProps> = ({
  watchlistMap,
  animeList,
  onPlay,
  onViewDetails,
  onRemoveFromWatchlist,
  onUpdateStatus,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | WatchlistStatus>('all');

  const bookmarkedItems = Object.values(watchlistMap);

  const filteredItems = bookmarkedItems.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-display flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-rose-500" />
            <span>My Anime Watchlist</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track shows you're watching, plan to watch, or completed.
          </p>
        </div>

        {/* Status segmented controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
          {[
            { id: 'all', label: `All (${bookmarkedItems.length})` },
            { id: 'watching', label: 'Watching' },
            { id: 'plan_to_watch', label: 'Plan to Watch' },
            { id: 'favorite', label: 'Favorites' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as 'all' | WatchlistStatus)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of bookmarked anime */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const anime = animeList.find((a) => a.id === item.animeId);
            if (!anime) return null;

            return (
              <div key={anime.id} className="relative group">
                <AnimeCard
                  anime={anime}
                  onPlay={onPlay}
                  onViewDetails={onViewDetails}
                  onToggleWatchlist={onRemoveFromWatchlist}
                  isInWatchlist={true}
                />

                {/* Status Switcher & Remove button underneath */}
                <div className="mt-2 flex items-center justify-between text-xs px-1">
                  <select
                    value={item.status}
                    onChange={(e) => onUpdateStatus(anime.id, e.target.value as WatchlistStatus)}
                    aria-label={`Watch status for ${anime.title}`}
                    className="bg-slate-900 border border-slate-800 text-[11px] text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="watching">Watching</option>
                    <option value="plan_to_watch">Plan to Watch</option>
                    <option value="favorite">Favorite</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    onClick={() => onRemoveFromWatchlist(anime.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                    title="Remove from list"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/30 border border-slate-800/60 rounded-2xl p-8">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Your Watchlist is Empty</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse our anime catalog and click the "+" button on any series to save it to your personal watchlist!
          </p>
        </div>
      )}
    </div>
  );
};
