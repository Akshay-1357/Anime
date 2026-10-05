import React, { useState } from 'react';
import { Play, CheckCircle2, Clock } from 'lucide-react';
import { Episode, Anime } from '../types/anime';
import { formatDuration } from '../utils/storage';

interface EpisodeRailProps {
  anime: Anime;
  currentEpisodeId: string;
  onSelectEpisode: (episode: Episode) => void;
  progressMap?: Record<string, { progressSeconds: number; duration: number }>;
}

export const EpisodeRail: React.FC<EpisodeRailProps> = ({
  anime,
  currentEpisodeId,
  onSelectEpisode,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredEpisodes = anime.episodes.filter(
    (ep) =>
      ep.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      ep.episodeNumber.toString() === filterQuery.trim()
  );

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            Episodes ({anime.episodes.length})
          </h2>
          <div className="text-[11px] text-slate-400">
            Season {anime.season} {anime.releaseYear} · {anime.status}
          </div>
        </div>

        {anime.episodes.length > 3 && (
          <input
            type="text"
            placeholder="Ep # or title..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-32 sm:w-40 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
        )}
      </div>

      {/* Episode List */}
      <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
        {filteredEpisodes.map((ep) => {
          const isCurrent = ep.id === currentEpisodeId;

          return (
            <div
              key={ep.id}
              onClick={() => onSelectEpisode(ep)}
              className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all border ${
                isCurrent
                  ? 'bg-rose-950/30 border-rose-600/50 ring-1 ring-rose-500/20'
                  : 'bg-slate-900/40 hover:bg-slate-800/70 border-slate-800/60'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-28 sm:w-32 aspect-video rounded overflow-hidden shrink-0 bg-slate-950">
                <img
                  src={ep.thumbnail || anime.coverImage}
                  alt={ep.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                  {isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center shadow">
                      <Play className="w-3 h-3 fill-white translate-x-0.5" />
                    </div>
                  ) : (
                    <Play className="w-4 h-4 text-white/80 hover:text-white" />
                  )}
                </div>

                <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/80 rounded text-[9px] font-mono text-slate-300 tabular-nums">
                  {formatDuration(ep.duration)}
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className={isCurrent ? 'text-rose-400' : 'text-slate-400'}>
                    EP {ep.episodeNumber}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-white truncate font-medium">{ep.title}</span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                  {ep.synopsis}
                </p>

                {isCurrent && (
                  <div className="flex items-center gap-1 text-[10px] text-rose-400 font-semibold mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>Now Playing</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredEpisodes.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-500">
            No episodes matched "{filterQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
