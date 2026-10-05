export type AnimeGenre =
  | 'Action'
  | 'Adventure'
  | 'Fantasy'
  | 'Sci-Fi'
  | 'Cyberpunk'
  | 'Romance'
  | 'Slice of Life'
  | 'Supernatural'
  | 'Mystery'
  | 'Drama'
  | 'Comedy';

export interface Episode {
  id: string;
  episodeNumber: number;
  title: string;
  duration: number; // in seconds
  videoUrl: string;
  backupUrl?: string;
  thumbnail: string;
  synopsis: string;
  introStart?: number; // seconds
  introEnd?: number; // seconds
}

export interface CastMember {
  characterName: string;
  japaneseVoice: string;
  englishVoice: string;
  role: 'Main' | 'Supporting';
}

export interface Anime {
  id: string;
  title: string;
  titleJapanese: string;
  romajiTitle: string;
  coverImage: string;
  bannerImage: string;
  score: number;
  popularityRank: number;
  totalEpisodes: number;
  currentEpisodeAiring?: number;
  season: string;
  releaseYear: number;
  status: 'Airing' | 'Completed' | 'Upcoming';
  studio: string;
  format: 'TV' | 'Movie' | 'OVA' | 'Special';
  genres: AnimeGenre[];
  synopsis: string;
  subAvailable: boolean;
  dubAvailable: boolean;
  episodes: Episode[];
  cast: CastMember[];
  featured?: boolean;
  trending?: boolean;
}

export interface DanmakuComment {
  id: string;
  episodeId: string;
  time: number; // timestamp in video seconds
  text: string;
  color?: string;
  topOffsetPercent?: number;
}

export interface UserProgress {
  animeId: string;
  episodeId: string;
  episodeNumber: number;
  progressSeconds: number;
  totalDurationSeconds: number;
  updatedAt: number;
}

export type WatchlistStatus = 'watching' | 'plan_to_watch' | 'completed' | 'favorite';

export interface WatchlistItem {
  animeId: string;
  status: WatchlistStatus;
  addedAt: number;
}

export interface EpisodeComment {
  id: string;
  episodeId: string;
  userName: string;
  avatarColor: string;
  timestamp: string;
  videoTimecode?: string;
  text: string;
  upvotes: number;
  isSpoiler?: boolean;
}
