import React, { useState } from 'react';
import { Play, Plus, Check, Star, Film } from 'lucide-react';
import { Anime } from '../types/anime';

interface AnimeCardProps {
  anime: Anime;
  onPlay: (anime: Anime) => void;
  onViewDetails: (anime: Anime) => void;
  onToggleWatchlist: (animeId: string) => void;
  isInWatchlist: boolean;
  priority?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  onPlay,
  onViewDetails,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="group relative flex flex-col bg-slate-900/40 rounded-xl overflow-hidden border border-slate-800/80 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-black/50">
      {/* Poster Image Container */}
      <div
        onClick={() => onViewDetails(anime)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950 cursor-pointer"
      >
        {!imageFailed ? (
          <img
            src={anime.coverImage}
            alt={anime.title}
            onError={() => setImageFailed(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
            <Film className="w-8 h-8 text-rose-500/70 mb-2" />
            <span className="text-xs font-bold text-slate-300">{anime.title}</span>
            <span className="text-[10px] text-slate-500 mt-1">{anime.studio}</span>
          </div>
        )}

        {/* Measured dark scrim for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay(anime);
            }}
            className="w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
            title="Watch Now"
          >
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(anime.id);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer border ${
              isInWatchlist
                ? 'bg-slate-800 text-rose-400 border-rose-500/50'
                : 'bg-slate-900/90 hover:bg-slate-800 text-white border-slate-700'
            }`}
            title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Rating and Audio availability overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded tabular-nums">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{anime.score.toFixed(1)}</span>
          </div>

          <div className="text-[10px] font-mono text-slate-300 bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded">
            {anime.subAvailable && anime.dubAvailable ? 'SUB / DUB' : 'SUB'}
          </div>
        </div>
      </div>

      {/* Card Body - Anti-Slop Clean Unboxed Typography */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Metadata Row with Typographic Dot Separators */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
            <span>{anime.format}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{anime.totalEpisodes} Eps</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{anime.releaseYear}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(anime)}
            className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1 cursor-pointer"
            title={anime.title}
          >
            {anime.title}
          </h3>

          <div className="text-[11px] text-slate-500 truncate mt-0.5 font-mono">
            {anime.titleJapanese}
          </div>
        </div>

        {/* Genre Tags (Quiet text) */}
        <div className="text-[11px] text-slate-400 line-clamp-1">
          {anime.genres.slice(0, 3).join(' / ')}
        </div>
      </div>
    </div>
  );
};
