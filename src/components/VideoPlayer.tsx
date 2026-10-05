import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  Settings,
  Tv,
  MessageSquare,
  SkipForward,
  FastForward,
  Check,
  AlertTriangle,
  Send,
  Sparkles
} from 'lucide-react';
import { Episode, Anime, DanmakuComment } from '../types/anime';
import { formatDuration, UserPreferences } from '../utils/storage';

interface VideoPlayerProps {
  anime: Anime;
  episode: Episode;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  hasNextEpisode: boolean;
  hasPrevEpisode: boolean;
  onProgressUpdate: (seconds: number, duration: number) => void;
  initialProgressSeconds?: number;
  danmakuList: DanmakuComment[];
  onAddDanmaku: (text: string, color?: string) => void;
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
  isTheaterMode: boolean;
  onToggleTheaterMode: () => void;
  onSelectServer?: (serverIdx: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  anime,
  episode,
  onNextEpisode,
  onPrevEpisode,
  hasNextEpisode,
  hasPrevEpisode,
  onProgressUpdate,
  initialProgressSeconds = 0,
  danmakuList,
  onAddDanmaku,
  preferences,
  onUpdatePreferences,
  isTheaterMode,
  onToggleTheaterMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(episode.duration || 0);
  const [bufferedPercent, setBufferedPercent] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeSubtitles, setActiveSubtitles] = useState<string>('English');
  const [currentSubtitleText, setCurrentSubtitleText] = useState<string>('');

  // Danmaku input in player
  const [danmakuInput, setDanmakuInput] = useState<string>('');
  const [selectedDanmakuColor, setSelectedDanmakuColor] = useState<string>('#ffffff');
  const [activeDanmakuItems, setActiveDanmakuItems] = useState<{ id: string; text: string; color: string; topPercent: number }[]>([]);

  // Hide controls timer
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // In-intro check
  const isInIntro =
    episode.introStart !== undefined &&
    episode.introEnd !== undefined &&
    currentTime >= episode.introStart &&
    currentTime < episode.introEnd;

  // Near end of episode check (last 30 seconds)
  const isNearEnd = duration > 60 && currentTime >= duration - 30;

  // Initialize playback & resume position
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setHasError(false);
    setErrorMessage('');

    const handleLoadedMetadata = () => {
      const dur = video.duration || episode.duration;
      setDuration(dur);

      if (initialProgressSeconds > 0 && initialProgressSeconds < dur - 5) {
        video.currentTime = initialProgressSeconds;
        setCurrentTime(initialProgressSeconds);
      } else {
        video.currentTime = 0;
        setCurrentTime(0);
      }
      video.volume = preferences.volume;
      video.muted = preferences.muted;
      video.playbackRate = playbackSpeed;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [episode.id, initialProgressSeconds]);

  // Handle Danmaku items appearing at current playback second
  useEffect(() => {
    if (!preferences.danmakuEnabled) {
      setActiveDanmakuItems([]);
      return;
    }

    const currentSec = Math.floor(currentTime);
    const matching = danmakuList.filter(
      (d) => d.episodeId === episode.id && Math.floor(d.time) === currentSec
    );

    if (matching.length > 0) {
      const newItems = matching.map((item, idx) => ({
        id: `${item.id}-${Date.now()}-${idx}`,
        text: item.text,
        color: item.color || '#ffffff',
        topPercent: item.topOffsetPercent || (15 + (Math.floor(Math.random() * 5) * 14)),
      }));

      setActiveDanmakuItems((prev) => [...prev.slice(-15), ...newItems]);

      // Remove after 8 seconds (animation duration)
      const timer = setTimeout(() => {
        setActiveDanmakuItems((prev) => prev.filter((p) => !newItems.some((n) => n.id === p.id)));
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [Math.floor(currentTime), episode.id, preferences.danmakuEnabled, danmakuList]);

  // Mock live subtitle track based on anime dialogue timestamps
  useEffect(() => {
    if (activeSubtitles === 'Off') {
      setCurrentSubtitleText('');
      return;
    }

    const sec = Math.floor(currentTime);
    if (sec >= 12 && sec <= 18) {
      setCurrentSubtitleText(
        activeSubtitles === 'Romaji'
          ? 'Kore ga... Seikai no chikara ka?'
          : 'Is this... the power of the Astral Realm?'
      );
    } else if (sec >= 22 && sec <= 28) {
      setCurrentSubtitleText(
        activeSubtitles === 'Romaji'
          ? 'Akirameru na! Mada owatte inai!'
          : "Don't give up! It isn't over yet!"
      );
    } else if (sec >= 45 && sec <= 52) {
      setCurrentSubtitleText(
        activeSubtitles === 'Romaji'
          ? 'Ano hoshi ga kagayaku kagiri, wareware wa susumu.'
          : 'As long as that celestial star shines, we forge ahead.'
      );
    } else if (sec >= 120 && sec <= 126) {
      setCurrentSubtitleText(
        activeSubtitles === 'Romaji'
          ? 'Katana wo tsunage. Hoshizora no kizuna wo shinjite.'
          : 'Unsheathe the blade. Trust in the bond of the starlight.'
      );
    } else {
      setCurrentSubtitleText('');
    }
  }, [Math.floor(currentTime), activeSubtitles]);

  // Track progress update
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const cur = video.currentTime;
    setCurrentTime(cur);
    onProgressUpdate(cur, video.duration || duration);

    // Update buffer progress
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const percent = (bufferedEnd / (video.duration || duration)) * 100;
      setBufferedPercent(Math.min(100, Math.max(0, percent)));
    }
  };

  // User mouse activity resets controls fade timer
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSettingsMenu(false);
      }, 2800);
    }
  }, [isPlaying]);

  // Video error handler
  const handleVideoError = () => {
    setHasError(true);
    setErrorMessage('Primary stream stream encountered an error. Click below to retry or switch server.');
    setIsPlaying(false);
  };

  // Play / Pause toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((err) => {
          console.warn('Playback play request prevented:', err);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Seek time
  const handleSeek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    const target = Math.max(0, Math.min(duration, seconds));
    video.currentTime = target;
    setCurrentTime(target);
  };

  // Skip 10 seconds
  const handleSkipSeconds = (delta: number) => {
    handleSeek(currentTime + delta);
  };

  // Skip Intro
  const handleSkipIntro = () => {
    if (episode.introEnd !== undefined) {
      handleSeek(episode.introEnd);
    }
  };

  // Volume change
  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    const vol = Math.max(0, Math.min(1, newVolume));
    video.volume = vol;
    video.muted = vol === 0;
    onUpdatePreferences({ volume: vol, muted: vol === 0 });
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    onUpdatePreferences({ muted: nextMuted });
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error(err));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error(err));
    }
  };

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowleft':
          e.preventDefault();
          handleSkipSeconds(-5);
          break;
        case 'arrowright':
          e.preventDefault();
          handleSkipSeconds(5);
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange(preferences.volume + 0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange(preferences.volume - 0.1);
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 't':
          e.preventDefault();
          onToggleTheaterMode();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'c':
          e.preventDefault();
          setActiveSubtitles((prev) => (prev === 'Off' ? 'English' : 'Off'));
          break;
        case 'd':
          e.preventDefault();
          onUpdatePreferences({ danmakuEnabled: !preferences.danmakuEnabled });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, duration, preferences, isPlaying]);

  // Scrub bar hover and click
  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);

    if (isScrubbing) {
      handleSeek(pos * duration);
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    const bar = progressBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    handleSeek(pos * duration);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (isScrubbing) setIsScrubbing(false);
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isScrubbing]);

  // Submit Danmaku comment
  const handleSendDanmaku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!danmakuInput.trim()) return;
    onAddDanmaku(danmakuInput.trim(), selectedDanmakuColor);
    setDanmakuInput('');
  };

  const currentProgressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
        setHoverTime(null);
      }}
      className={`relative w-full bg-black select-none overflow-hidden group ${
        isTheaterMode
          ? 'h-[75vh] md:h-[82vh] max-h-[880px]'
          : 'aspect-video max-h-[700px] rounded-xl border border-slate-800'
      }`}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={episode.videoUrl}
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          if (preferences.autoPlayNext && hasNextEpisode && onNextEpisode) {
            onNextEpisode();
          }
        }}
        onError={handleVideoError}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Danmaku Bullet Comments Layer */}
      {preferences.danmakuEnabled && (
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none z-10"
          style={{ opacity: preferences.danmakuOpacity }}
        >
          {activeDanmakuItems.map((item) => (
            <div
              key={item.id}
              className="danmaku-item font-bold text-sm sm:text-base md:text-lg tracking-wide drop-shadow-md"
              style={{
                top: `${item.topPercent}%`,
                color: item.color,
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
      )}

      {/* Live Subtitle Overlay */}
      {currentSubtitleText && (
        <div className="absolute bottom-20 inset-x-0 flex justify-center pointer-events-none z-20 px-4">
          <div className="bg-black/75 px-4 py-1.5 rounded text-white text-base md:text-lg font-medium text-center shadow-lg backdrop-blur-xs max-w-2xl leading-snug">
            {currentSubtitleText}
          </div>
        </div>
      )}

      {/* Skip Intro Button */}
      {isInIntro && (
        <button
          onClick={handleSkipIntro}
          className="absolute bottom-24 right-6 z-30 flex items-center gap-2 px-4 py-2 bg-rose-600/95 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer border border-rose-400/40"
        >
          <FastForward className="w-4 h-4" />
          <span>Skip Intro</span>
        </button>
      )}

      {/* Next Episode Auto-Prompt Banner */}
      {isNearEnd && hasNextEpisode && (
        <div className="absolute top-6 right-6 z-30 flex items-center gap-3 p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <div className="text-left">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Up Next</div>
            <div className="text-xs font-bold text-white">Episode {episode.episodeNumber + 1}</div>
          </div>
          <button
            onClick={onNextEpisode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Play Now</span>
          </button>
        </div>
      )}

      {/* Stream Error Fallback Notice */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center z-30">
          <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Playback Interrupted</h3>
          <p className="text-xs text-slate-400 max-w-md mb-4">{errorMessage}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const video = videoRef.current;
                if (video) {
                  video.load();
                  video.play();
                  setHasError(false);
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
            >
              Retry Playback
            </button>
            {episode.backupUrl && (
              <button
                onClick={() => {
                  const video = videoRef.current;
                  if (video) {
                    video.src = episode.backupUrl!;
                    video.load();
                    video.play();
                    setHasError(false);
                  }
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-700"
              >
                Switch to Mirror Server
              </button>
            )}
          </div>
        </div>
      )}

      {/* Center Large Play Pause Feedback Button (visible on pause) */}
      {!isPlaying && !hasError && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-20 bg-black/20"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 border border-white/20">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Player Header Title Bar (when controls visible) */}
      <div
        className={`absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-xs sm:text-sm text-slate-200 transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-4">
          <span className="font-bold text-white truncate">{anime.title}</span>
          <span className="text-slate-400">·</span>
          <span className="text-rose-400 font-semibold shrink-0">
            EP {episode.episodeNumber}: {episode.title}
          </span>
        </div>

        {/* Audio Track Tag & Auto Play status */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() =>
              onUpdatePreferences({ audioTrack: preferences.audioTrack === 'sub' ? 'dub' : 'sub' })
            }
            className="px-2.5 py-1 text-[11px] font-bold uppercase rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
          >
            {preferences.audioTrack === 'sub' ? 'Sub (JP)' : 'Dub (EN)'}
          </button>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-8 pb-3 px-4 transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Timeline Scrubber */}
        <div
          ref={progressBarRef}
          onMouseMove={handleProgressMouseMove}
          onMouseDown={handleProgressMouseDown}
          onMouseLeave={() => setHoverTime(null)}
          className="relative w-full h-2.5 hover:h-4 group/bar cursor-pointer flex items-center transition-all"
        >
          {/* Track background */}
          <div className="absolute inset-x-0 h-1.5 group-hover/bar:h-2 bg-slate-800/90 rounded-full overflow-hidden transition-all">
            {/* Buffered progress */}
            <div
              className="h-full bg-slate-600/70 transition-all duration-200"
              style={{ width: `${bufferedPercent}%` }}
            />
          </div>

          {/* Current Played Bar */}
          <div
            className="absolute left-0 h-1.5 group-hover/bar:h-2 bg-rose-600 rounded-full transition-all"
            style={{ width: `${currentProgressPercent}%` }}
          />

          {/* Scrubber Knob */}
          <div
            className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-md -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity"
            style={{ left: `${currentProgressPercent}%` }}
          />

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-7 px-2 py-0.5 bg-slate-900 border border-slate-700 text-white text-[11px] font-mono rounded shadow pointer-events-none -translate-x-1/2"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatDuration(hoverTime)}
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-1 text-slate-300">
          {/* Left Controls: Play, Skips, Episode Jumps, Volume, Time */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={togglePlay}
              className="hover:text-white transition-colors cursor-pointer"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {hasPrevEpisode && onPrevEpisode && (
              <button
                onClick={onPrevEpisode}
                className="hover:text-white transition-colors cursor-pointer hidden sm:block"
                title="Previous Episode"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => handleSkipSeconds(-10)}
              className="hover:text-white transition-colors cursor-pointer text-xs font-semibold flex items-center"
              title="Rewind 10s (Left Arrow)"
            >
              <RotateCcw className="w-4 h-4 mr-0.5" />
              <span className="text-[10px]">10</span>
            </button>

            <button
              onClick={() => handleSkipSeconds(10)}
              className="hover:text-white transition-colors cursor-pointer text-xs font-semibold flex items-center"
              title="Fast Forward 10s (Right Arrow)"
            >
              <RotateCw className="w-4 h-4 mr-0.5" />
              <span className="text-[10px]">10</span>
            </button>

            {hasNextEpisode && onNextEpisode && (
              <button
                onClick={onNextEpisode}
                className="hover:text-white transition-colors cursor-pointer"
                title="Next Episode"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/vol">
              <button onClick={toggleMute} className="hover:text-white transition-colors cursor-pointer">
                {preferences.muted || preferences.volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : preferences.volume < 0.5 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={preferences.muted ? 0 : preferences.volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 sm:w-20 accent-rose-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Time display: Tabular numerals */}
            <div className="text-xs font-mono tabular-nums text-slate-400">
              <span className="text-slate-200">{formatDuration(currentTime)}</span>
              <span className="mx-1">/</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Danmaku Toggle, Speed/Settings, Theater, Fullscreen */}
          <div className="flex items-center gap-3 relative">
            {/* Danmaku Toggle Button */}
            <button
              onClick={() =>
                onUpdatePreferences({ danmakuEnabled: !preferences.danmakuEnabled })
              }
              className={`flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                preferences.danmakuEnabled
                  ? 'bg-rose-600/90 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle Danmaku Bullet Comments (D)"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Danmaku</span>
            </button>

            {/* Subtitles Toggle */}
            <button
              onClick={() =>
                setActiveSubtitles((prev) => (prev === 'Off' ? 'English' : prev === 'English' ? 'Romaji' : 'Off'))
              }
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors cursor-pointer border ${
                activeSubtitles !== 'Off'
                  ? 'border-rose-500/60 text-rose-400 bg-rose-950/30'
                  : 'border-slate-700 text-slate-400 bg-slate-800/80 hover:text-white'
              }`}
              title="Subtitle Language (C)"
            >
              CC: {activeSubtitles}
            </button>

            {/* Settings Button */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="hover:text-white transition-colors cursor-pointer p-1"
                title="Playback Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              {/* Settings Dropdown Popover */}
              {showSettingsMenu && (
                <div className="absolute right-0 bottom-10 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs space-y-3">
                  <div className="font-semibold text-white border-b border-slate-800 pb-2">
                    Playback Options
                  </div>

                  {/* Speed selection */}
                  <div>
                    <label className="text-slate-400 block mb-1">Speed</label>
                    <div className="grid grid-cols-4 gap-1">
                      {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => {
                            setPlaybackSpeed(speed);
                            if (videoRef.current) videoRef.current.playbackRate = speed;
                          }}
                          className={`py-1 rounded font-mono text-[11px] cursor-pointer ${
                            playbackSpeed === speed
                              ? 'bg-rose-600 text-white font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality selector */}
                  <div>
                    <label className="text-slate-400 block mb-1">Quality</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['1080p', '720p', 'auto'] as const).map((q) => (
                        <button
                          key={q}
                          onClick={() => onUpdatePreferences({ quality: q })}
                          className={`py-1 rounded uppercase text-[11px] cursor-pointer ${
                            preferences.quality === q
                              ? 'bg-rose-600 text-white font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto Play Next */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-300">Autoplay Next</span>
                    <button
                      onClick={() =>
                        onUpdatePreferences({ autoPlayNext: !preferences.autoPlayNext })
                      }
                      className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                        preferences.autoPlayNext ? 'bg-rose-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                          preferences.autoPlayNext ? 'left-4' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theater Mode Button */}
            <button
              onClick={onToggleTheaterMode}
              className={`hover:text-white transition-colors cursor-pointer hidden md:block ${
                isTheaterMode ? 'text-rose-500' : ''
              }`}
              title="Theater Mode (T)"
            >
              <Tv className="w-5 h-5" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="hover:text-white transition-colors cursor-pointer"
              title="Fullscreen (F)"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Danmaku Input Bar (Overlay on bottom when danmaku enabled) */}
      {preferences.danmakuEnabled && showControls && (
        <form
          onSubmit={handleSendDanmaku}
          className="absolute bottom-14 left-4 right-4 z-20 flex items-center gap-2 max-w-lg bg-slate-900/90 border border-slate-700/80 rounded-lg p-1.5 backdrop-blur-md"
        >
          {/* Color picker dot */}
          <div className="flex items-center gap-1 px-1">
            {['#ffffff', '#ff4d4f', '#40a9ff', '#52c41a', '#faad14'].map((col) => (
              <button
                type="button"
                key={col}
                onClick={() => setSelectedDanmakuColor(col)}
                className="w-3.5 h-3.5 rounded-full border border-black/40 cursor-pointer transition-transform"
                style={{
                  backgroundColor: col,
                  transform: selectedDanmakuColor === col ? 'scale(1.25)' : 'scale(1)',
                }}
              />
            ))}
          </div>

          <input
            type="text"
            placeholder="Send a bullet comment at this moment..."
            value={danmakuInput}
            onChange={(e) => setDanmakuInput(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none px-2"
          />

          <button
            type="submit"
            disabled={!danmakuInput.trim()}
            className="p-1 text-rose-500 hover:text-rose-400 disabled:opacity-40 transition-opacity cursor-pointer"
            title="Shoot Comment"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
