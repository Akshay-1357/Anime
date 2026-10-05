import { UserProgress, WatchlistItem, DanmakuComment, EpisodeComment } from '../types/anime';
import { INITIAL_DANMAKU_COMMENTS, INITIAL_EPISODE_COMMENTS } from '../data/animeCatalog';

const STORAGE_KEYS = {
  PROGRESS: 'kuronami_watch_progress_v1',
  WATCHLIST: 'kuronami_watchlist_v1',
  DANMAKU: 'kuronami_danmaku_v1',
  COMMENTS: 'kuronami_comments_v1',
  PREFERENCES: 'kuronami_preferences_v1',
};

export interface UserPreferences {
  audioTrack: 'sub' | 'dub';
  quality: '1080p' | '720p' | '480p' | 'auto';
  autoPlayNext: boolean;
  danmakuEnabled: boolean;
  danmakuOpacity: number;
  theaterMode: boolean;
  volume: number;
  muted: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  audioTrack: 'sub',
  quality: '1080p',
  autoPlayNext: true,
  danmakuEnabled: true,
  danmakuOpacity: 0.85,
  theaterMode: false,
  volume: 0.9,
  muted: false,
};

export const getStoredProgress = (): Record<string, UserProgress> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const saveEpisodeProgress = (progress: UserProgress): void => {
  try {
    const existing = getStoredProgress();
    existing[progress.animeId] = progress;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save progress to localStorage', e);
  }
};

export const getStoredWatchlist = (): Record<string, WatchlistItem> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    if (!raw) {
      // Seed default item in watching
      const initial: Record<string, WatchlistItem> = {
        'chronicles-of-astralis': {
          animeId: 'chronicles-of-astralis',
          status: 'watching',
          addedAt: Date.now() - 86400000 * 2,
        },
        'soul-ignite-valkyrie': {
          animeId: 'soul-ignite-valkyrie',
          status: 'favorite',
          addedAt: Date.now() - 86400000 * 5,
        },
      };
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
};

export const saveWatchlistItem = (item: WatchlistItem): Record<string, WatchlistItem> => {
  try {
    const existing = getStoredWatchlist();
    existing[item.animeId] = item;
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(existing));
    return existing;
  } catch (e) {
    return {};
  }
};

export const removeWatchlistItem = (animeId: string): Record<string, WatchlistItem> => {
  try {
    const existing = getStoredWatchlist();
    delete existing[animeId];
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(existing));
    return existing;
  } catch (e) {
    return {};
  }
};

export const getStoredDanmaku = (): DanmakuComment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DANMAKU);
    return raw ? JSON.parse(raw) : INITIAL_DANMAKU_COMMENTS;
  } catch (e) {
    return INITIAL_DANMAKU_COMMENTS;
  }
};

export const addStoredDanmaku = (danmaku: DanmakuComment): DanmakuComment[] => {
  try {
    const list = getStoredDanmaku();
    const updated = [...list, danmaku];
    localStorage.setItem(STORAGE_KEYS.DANMAKU, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [danmaku];
  }
};

export const getStoredComments = (): EpisodeComment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    return raw ? JSON.parse(raw) : INITIAL_EPISODE_COMMENTS;
  } catch (e) {
    return INITIAL_EPISODE_COMMENTS;
  }
};

export const addStoredComment = (comment: EpisodeComment): EpisodeComment[] => {
  try {
    const list = getStoredComments();
    const updated = [comment, ...list];
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return [comment];
  }
};

export const getStoredPreferences = (): UserPreferences => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    return raw ? { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_PREFERENCES;
  } catch (e) {
    return DEFAULT_PREFERENCES;
  }
};

export const savePreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  try {
    const current = getStoredPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return DEFAULT_PREFERENCES;
  }
};

export const formatDuration = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
