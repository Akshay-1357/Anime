import React from 'react';
import { X, Play, Plus, Check, Star, Users, Film, Calendar, Building2 } from 'lucide-react';
import { Anime, Episode } from '../types/anime';
import { formatDuration } from '../utils/storage';

interface AnimeDetailModalProps {
  anime: Anime | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayEpisode: (anime: Anime, episodeIndex: number) => void;
  onToggleWatchlist: (animeId: string) => void;
  isInWatchlist: boolean;
}

export const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({
  anime,
  isOpen,
  onClose,
  onPlayEpisode,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  if (!isOpen || !anime) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Banner Hero */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-slate-950">
          <img
            src={anime.bannerImage || anime.coverImage}
            alt={anime.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Overlay Details */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs text-rose-400 font-mono mb-1">{anime.titleJapanese}</div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                {anime.title}
              </h1>

              {/* Anti-slop clean unboxed metadata */}
              <div className="flex items-center flex-wrap gap-2 text-xs text-slate-300 mt-2">
                <span className="flex items-center gap-1 text-amber-400 font-bold tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {anime.score.toFixed(2)}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-200">{anime.format}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{anime.totalEpisodes} Episodes</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{anime.season} {anime.releaseYear}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400">{anime.studio}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  onPlayEpisode(anime, 0);
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Ep 1</span>
              </button>

              <button
                onClick={() => onToggleWatchlist(anime.id)}
                className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                  isInWatchlist
                    ? 'bg-slate-800 text-rose-400 border-rose-500/50'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title={isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              >
                {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-sm">
          {/* Synopsis */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
              Synopsis
            </h2>
            <p className="leading-relaxed text-slate-200">{anime.synopsis}</p>
          </div>

          {/* Genres */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-display">
              Genres & Tags
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              {anime.genres.join('  ·  ')}
            </div>
          </div>

          {/* Episodes List Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-display">
                All Episodes ({anime.episodes.length})
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                {anime.subAvailable && 'Japanese Audio + Subtitles'}
                {anime.dubAvailable && ' · English Dub'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {anime.episodes.map((ep, idx) => (
                <div
                  key={ep.id}
                  onClick={() => {
                    onPlayEpisode(anime, idx);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer group"
                >
                  <div className="relative w-24 aspect-video rounded overflow-hidden shrink-0 bg-slate-900">
                    <img
                      src={ep.thumbnail || anime.coverImage}
                      alt={ep.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 fill-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white group-hover:text-rose-400 truncate">
                      Ep {ep.episodeNumber}: {ep.title}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                      {formatDuration(ep.duration)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Cast */}
          {anime.cast && anime.cast.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-display">
                Voice Actors (Seiyuu)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {anime.cast.map((c) => (
                  <div
                    key={c.characterName}
                    className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-200">{c.characterName}</div>
                      <div className="text-[11px] text-slate-400">{c.role} Character</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-300 font-medium">{c.japaneseVoice} (JP)</div>
                      <div className="text-[10px] text-slate-500">{c.englishVoice} (EN)</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
