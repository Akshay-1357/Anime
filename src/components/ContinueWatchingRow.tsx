import React from 'react';
import { Play, Clock } from 'lucide-react';
import { Anime, UserProgress } from '../types/anime';
import { formatDuration } from '../utils/storage';

interface ContinueWatchingRowProps {
  progressList: { anime: Anime; progress: UserProgress }[];
  onResume: (anime: Anime, episodeNumber: number) => void;
}

export const ContinueWatchingRow: React.FC<ContinueWatchingRowProps> = ({
  progressList,
  onResume,
}) => {
  if (progressList.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold text-white font-display flex items-center gap-2">
          <span>Continue Watching</span>
          <span className="text-xs font-normal text-slate-500 font-mono">
            ({progressList.length})
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {progressList.map(({ anime, progress }) => {
          const percent = progress.totalDurationSeconds > 0
            ? Math.min(100, Math.round((progress.progressSeconds / progress.totalDurationSeconds) * 100))
            : 0;

          const episode = anime.episodes.find((e) => e.id === progress.episodeId) || anime.episodes[0];

          return (
            <div
              key={anime.id}
              onClick={() => onResume(anime, progress.episodeNumber)}
              className="group relative bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden cursor-pointer hover:border-slate-700 transition-all hover:shadow-lg"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={episode?.thumbnail || anime.coverImage}
                  alt={anime.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white translate-x-0.5" />
                  </div>
                </div>

                {/* Progress bar overlay at bottom of thumbnail */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800">
                  <div
                    className="h-full bg-rose-600 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                {/* Time remaining */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300 tabular-nums">
                  {formatDuration(progress.progressSeconds)} / {formatDuration(progress.totalDurationSeconds)}
                </div>
              </div>

              {/* Information */}
              <div className="p-3">
                <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                  {anime.title}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>
                    Episode {progress.episodeNumber}: {episode?.title || 'Episode'}
                  </span>
                  <span className="font-mono text-slate-500 tabular-nums">{percent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
