import React from 'react';
import { Play, Plus, Check, Star } from 'lucide-react';
import { Anime } from '../types/anime';

interface HeroBannerProps {
  anime: Anime;
  onPlay: (anime: Anime, episodeIndex?: number) => void;
  onToggleWatchlist: (animeId: string) => void;
  isInWatchlist: boolean;
  onViewDetails: (anime: Anime) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  anime,
  onPlay,
  onToggleWatchlist,
  isInWatchlist,
  onViewDetails,
}) => {
  return (
    <section className="relative w-full min-h-[520px] md:min-h-[580px] lg:h-[68vh] max-h-[720px] flex items-end overflow-hidden border-b border-slate-800/60">
      {/* Background Image with Fallback and Gradients */}
      <div className="absolute inset-0 bg-slate-950">
        <img
          src={anime.bannerImage || anime.coverImage}
          alt={anime.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 duration-1000 ease-out"
        />
        {/* Measured Optical Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f17] via-[#0b0f17]/50 to-transparent" />
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#0b0f17]/70 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 pt-28 w-full">
        <div className="max-w-2xl space-y-4">
          {/* Clean Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center flex-wrap gap-2 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1 text-amber-400 font-semibold tabular-nums">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {anime.score.toFixed(2)}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-rose-400 font-semibold">{anime.format} Series</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{anime.totalEpisodes} Episodes</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{anime.season} {anime.releaseYear}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">{anime.genres.join(' / ')}</span>
          </div>

          {/* Title */}
          <div>
            <div className="text-xs tracking-wider text-slate-400 mb-1 font-mono">
              {anime.titleJapanese}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] font-display">
              {anime.title}
            </h1>
          </div>

          {/* Synopsis with line clamp */}
          <p className="text-sm md:text-base text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
            {anime.synopsis}
          </p>

          {/* Action Row */}
          <div className="flex items-center flex-wrap gap-3 pt-2">
            <button
              onClick={() => onPlay(anime, 0)}
              className="flex items-center gap-2.5 px-6 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all shadow-lg shadow-rose-950/50 hover:shadow-rose-900/60 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Watch Episode 1</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(anime.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors border cursor-pointer ${
                isInWatchlist
                  ? 'bg-slate-800/90 text-rose-400 border-rose-500/40 hover:bg-slate-800'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/80'
              }`}
            >
              {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isInWatchlist ? 'In Watchlist' : 'Add to List'}</span>
            </button>

            <button
              onClick={() => onViewDetails(anime)}
              className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 rounded-lg transition-colors border border-slate-800 cursor-pointer"
            >
              Details & Episodes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
