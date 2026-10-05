import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_ANIME_CATALOG,
  INITIAL_DANMAKU_COMMENTS,
  INITIAL_EPISODE_COMMENTS,
  DEMO_PRESET_STREAMS
} from './data/animeCatalog';
import { Anime, Episode, DanmakuComment, EpisodeComment, WatchlistStatus, UserProgress } from './types/anime';
import {
  getStoredProgress,
  saveEpisodeProgress,
  getStoredWatchlist,
  saveWatchlistItem,
  removeWatchlistItem,
  getStoredDanmaku,
  addStoredDanmaku,
  getStoredComments,
  addStoredComment,
  getStoredPreferences,
  savePreferences,
  UserPreferences,
} from './utils/storage';

import { Navbar, NavTab } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { VideoPlayer } from './components/VideoPlayer';
import { EpisodeRail } from './components/EpisodeRail';
import { AnimeCard } from './components/AnimeCard';
import { ContinueWatchingRow } from './components/ContinueWatchingRow';
import { CommentSection } from './components/CommentSection';
import { SearchModal } from './components/SearchModal';
import { CustomStreamModal } from './components/CustomStreamModal';
import { AnimeDetailModal } from './components/AnimeDetailModal';
import { FilterBar } from './components/FilterBar';
import { MyListView } from './components/MyListView';

import {
  Play,
  Flame,
  Calendar,
  Sparkles,
  ArrowLeft,
  Share2,
  Tv,
  Star,
  Users,
  Compass,
  Radio
} from 'lucide-react';

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<NavTab>('browse');
  const [watchingState, setWatchingState] = useState<{
    anime: Anime;
    episodeIndex: number;
  } | null>(null);

  // Modals & Panels
  const [selectedAnimeForModal, setSelectedAnimeForModal] = useState<Anime | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCustomStreamOpen, setIsCustomStreamOpen] = useState<boolean>(false);
  const [activeWatchTab, setActiveWatchTab] = useState<'episodes' | 'comments' | 'overview'>('episodes');

  // Filters & Sorting
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('score');

  // Persistent States
  const [progressMap, setProgressMap] = useState(getStoredProgress);
  const [watchlistMap, setWatchlistMap] = useState(getStoredWatchlist);
  const [danmakuList, setDanmakuList] = useState<DanmakuComment[]>(getStoredDanmaku);
  const [commentsList, setCommentsList] = useState<EpisodeComment[]>(getStoredComments);
  const [preferences, setPreferences] = useState<UserPreferences>(getStoredPreferences);
  const [copyNotice, setCopyNotice] = useState<string>('');

  // Save preferences when changed
  const handleUpdatePreferences = (newPrefs: Partial<UserPreferences>) => {
    const updated = savePreferences(newPrefs);
    setPreferences(updated);
  };

  // Watchlist Actions
  const handleToggleWatchlist = (animeId: string) => {
    if (watchlistMap[animeId]) {
      const updated = removeWatchlistItem(animeId);
      setWatchlistMap({ ...updated });
    } else {
      const updated = saveWatchlistItem({
        animeId,
        status: 'watching',
        addedAt: Date.now(),
      });
      setWatchlistMap({ ...updated });
    }
  };

  const handleUpdateWatchlistStatus = (animeId: string, status: WatchlistStatus) => {
    const existing = watchlistMap[animeId] || { animeId, addedAt: Date.now() };
    const updated = saveWatchlistItem({ ...existing, status });
    setWatchlistMap({ ...updated });
  };

  // Play Actions
  const handlePlayAnime = (anime: Anime, episodeIndex: number = 0) => {
    const safeIndex = Math.max(0, Math.min(anime.episodes.length - 1, episodeIndex));
    setWatchingState({ anime, episodeIndex: safeIndex });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEpisode = (ep: Episode) => {
    if (!watchingState) return;
    const idx = watchingState.anime.episodes.findIndex((e) => e.id === ep.id);
    if (idx !== -1) {
      setWatchingState({
        anime: watchingState.anime,
        episodeIndex: idx,
      });
    }
  };

  // Video Progress Update handler
  const handleProgressUpdate = (seconds: number, duration: number) => {
    if (!watchingState) return;
    const currentEp = watchingState.anime.episodes[watchingState.episodeIndex];
    if (!currentEp) return;

    const progressObj = {
      animeId: watchingState.anime.id,
      episodeId: currentEp.id,
      episodeNumber: currentEp.episodeNumber,
      progressSeconds: Math.floor(seconds),
      totalDurationSeconds: Math.floor(duration),
      updatedAt: Date.now(),
    };

    saveEpisodeProgress(progressObj);
    setProgressMap((prev) => ({
      ...prev,
      [watchingState.anime.id]: progressObj,
    }));
  };

  // Add Danmaku Comment
  const handleAddDanmaku = (text: string, color: string = '#ffffff') => {
    if (!watchingState) return;
    const currentEp = watchingState.anime.episodes[watchingState.episodeIndex];
    if (!currentEp) return;

    const currentSec = progressMap[watchingState.anime.id]?.progressSeconds || 10;
    const newDanmaku: DanmakuComment = {
      id: `user-d-${Date.now()}`,
      episodeId: currentEp.id,
      time: currentSec,
      text,
      color,
      topOffsetPercent: 20 + Math.floor(Math.random() * 50),
    };

    const updated = addStoredDanmaku(newDanmaku);
    setDanmakuList([...updated]);
  };

  // Add Episode Comment
  const handleAddComment = ({
    text,
    isSpoiler,
    videoTimecode,
  }: {
    text: string;
    isSpoiler: boolean;
    videoTimecode?: string;
  }) => {
    if (!watchingState) return;
    const currentEp = watchingState.anime.episodes[watchingState.episodeIndex];
    if (!currentEp) return;

    const newComment: EpisodeComment = {
      id: `user-c-${Date.now()}`,
      episodeId: currentEp.id,
      userName: 'AnimeLover',
      avatarColor: 'bg-rose-500',
      timestamp: 'Just now',
      videoTimecode,
      text,
      upvotes: 1,
      isSpoiler,
    };

    const updated = addStoredComment(newComment);
    setCommentsList([...updated]);
  };

  // Custom Stream Launch
  const handleLoadCustomStream = (streamUrl: string, title: string) => {
    const customAnime: Anime = {
      id: `custom-${Date.now()}`,
      title: title || 'Custom Anime Feed',
      titleJapanese: 'カスタムストリーム',
      romajiTitle: 'Custom Stream',
      coverImage: INITIAL_ANIME_CATALOG[0].coverImage,
      bannerImage: INITIAL_ANIME_CATALOG[0].bannerImage,
      score: 9.0,
      popularityRank: 999,
      totalEpisodes: 1,
      season: 'Current',
      releaseYear: 2026,
      status: 'Airing',
      studio: 'Direct Web Stream',
      format: 'Special',
      genres: ['Action', 'Sci-Fi'],
      synopsis: `Custom direct video stream playing from source: ${streamUrl}`,
      subAvailable: true,
      dubAvailable: false,
      cast: [],
      episodes: [
        {
          id: `custom-ep-1-${Date.now()}`,
          episodeNumber: 1,
          title: title || 'Stream Feed',
          duration: 600,
          videoUrl: streamUrl,
          thumbnail: INITIAL_ANIME_CATALOG[0].coverImage,
          synopsis: 'Custom user provided media URL.',
        },
      ],
    };

    setWatchingState({ anime: customAnime, episodeIndex: 0 });
    setActiveTab('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Continue Watching List
  const continueWatchingItems = useMemo(() => {
    return Object.values(progressMap)
      .map((prog) => {
        const anime = INITIAL_ANIME_CATALOG.find((a) => a.id === prog.animeId);
        return anime ? { anime, progress: prog } : null;
      })
      .filter((item): item is { anime: Anime; progress: UserProgress } => item !== null)
      .sort((a, b) => b.progress.updatedAt - a.progress.updatedAt);
  }, [progressMap]);

  // Catalog Filtering & Sorting
  const filteredCatalog = useMemo(() => {
    let list = [...INITIAL_ANIME_CATALOG];

    if (activeTab === 'trending') {
      list = list.filter((a) => a.trending);
    } else if (activeTab === 'seasonal') {
      list = list.filter((a) => a.season === 'Fall' || a.season === 'Summer');
    }

    if (selectedGenre !== 'All') {
      list = list.filter((a) => a.genres.includes(selectedGenre as any));
    }

    if (selectedFormat !== 'All') {
      list = list.filter((a) => a.format === selectedFormat);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'popularity') return a.popularityRank - b.popularityRank;
      if (sortBy === 'year') return b.releaseYear - a.releaseYear;
      if (sortBy === 'episodes') return b.totalEpisodes - a.totalEpisodes;
      return 0;
    });

    return list;
  }, [activeTab, selectedGenre, selectedFormat, sortBy]);

  const featuredAnime = INITIAL_ANIME_CATALOG[0];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Strict Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setWatchingState(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCustomStream={() => setIsCustomStreamOpen(true)}
        isWatching={!!watchingState}
        onBackToHome={() => {
          setWatchingState(null);
          setActiveTab('browse');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        {/* WATCHING VIEW (Active when an episode is selected) */}
        {watchingState ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
            {/* Back Button & Breadcrumbs */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setWatchingState(null)}
                className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Catalog</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleWatchlist(watchingState.anime.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    watchlistMap[watchingState.anime.id]
                      ? 'bg-slate-800 text-rose-400 border-rose-500/50'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {watchlistMap[watchingState.anime.id] ? 'In Watchlist' : '+ Watchlist'}
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    setCopyNotice('Link copied!');
                    setTimeout(() => setCopyNotice(''), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                  title="Share Anime"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copyNotice || 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Main Player Component */}
            {(() => {
              const currentEpisode =
                watchingState.anime.episodes[watchingState.episodeIndex] ||
                watchingState.anime.episodes[0];
              const hasNext = watchingState.episodeIndex < watchingState.anime.episodes.length - 1;
              const hasPrev = watchingState.episodeIndex > 0;
              const savedSecs = progressMap[watchingState.anime.id]?.progressSeconds || 0;

              return (
                <div className="space-y-6">
                  {/* High Definition Video Player */}
                  <VideoPlayer
                    anime={watchingState.anime}
                    episode={currentEpisode}
                    hasNextEpisode={hasNext}
                    hasPrevEpisode={hasPrev}
                    onNextEpisode={() =>
                      hasNext &&
                      setWatchingState({
                        anime: watchingState.anime,
                        episodeIndex: watchingState.episodeIndex + 1,
                      })
                    }
                    onPrevEpisode={() =>
                      hasPrev &&
                      setWatchingState({
                        anime: watchingState.anime,
                        episodeIndex: watchingState.episodeIndex - 1,
                      })
                    }
                    onProgressUpdate={handleProgressUpdate}
                    initialProgressSeconds={savedSecs}
                    danmakuList={danmakuList}
                    onAddDanmaku={handleAddDanmaku}
                    preferences={preferences}
                    onUpdatePreferences={handleUpdatePreferences}
                    isTheaterMode={preferences.theaterMode}
                    onToggleTheaterMode={() =>
                      handleUpdatePreferences({ theaterMode: !preferences.theaterMode })
                    }
                  />

                  {/* Watching Layout: Player Metadata & Episode Switcher */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left 2 Cols: Anime Title, Tabs (Episodes / Discussion / Overview) */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="p-4 sm:p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                        {/* Unboxed Metadata with Typographic Separator */}
                        <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400">
                          <span className="text-amber-400 font-bold tabular-nums">
                            ★ {watchingState.anime.score.toFixed(1)}
                          </span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span>{watchingState.anime.format}</span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span>{watchingState.anime.studio}</span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-rose-400">
                            Ep {currentEpisode.episodeNumber} of {watchingState.anime.totalEpisodes}
                          </span>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                          {currentEpisode.title}
                        </h1>

                        <div className="text-xs text-slate-400 font-mono">
                          {watchingState.anime.title} ({watchingState.anime.titleJapanese})
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                          {currentEpisode.synopsis}
                        </p>
                      </div>

                      {/* Interactive Watch Sub-Tabs */}
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                        <button
                          onClick={() => setActiveWatchTab('episodes')}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            activeWatchTab === 'episodes'
                              ? 'bg-rose-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          Episodes ({watchingState.anime.episodes.length})
                        </button>
                        <button
                          onClick={() => setActiveWatchTab('comments')}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            activeWatchTab === 'comments'
                              ? 'bg-rose-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          Discussion ({commentsList.filter((c) => c.episodeId === currentEpisode.id).length})
                        </button>
                        <button
                          onClick={() => setActiveWatchTab('overview')}
                          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            activeWatchTab === 'overview'
                              ? 'bg-rose-600 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                          }`}
                        >
                          Cast & Details
                        </button>
                      </div>

                      {/* Sub-Tab Contents */}
                      {activeWatchTab === 'episodes' && (
                        <EpisodeRail
                          anime={watchingState.anime}
                          currentEpisodeId={currentEpisode.id}
                          onSelectEpisode={handleSelectEpisode}
                        />
                      )}

                      {activeWatchTab === 'comments' && (
                        <CommentSection
                          episodeId={currentEpisode.id}
                          comments={commentsList}
                          onAddComment={handleAddComment}
                          currentTimeSeconds={savedSecs}
                        />
                      )}

                      {activeWatchTab === 'overview' && (
                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 text-xs text-slate-300">
                          <div>
                            <div className="text-slate-400 font-semibold mb-1">Full Story</div>
                            <p className="leading-relaxed">{watchingState.anime.synopsis}</p>
                          </div>

                          <div className="pt-2">
                            <div className="text-slate-400 font-semibold mb-2">Voice Cast</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {watchingState.anime.cast?.map((c) => (
                                <div key={c.characterName} className="p-2 bg-slate-950/60 rounded border border-slate-800 flex justify-between">
                                  <span className="font-bold text-white">{c.characterName}</span>
                                  <span className="text-slate-400">{c.japaneseVoice}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right 1 Col: Quick Next Up & Recommended Series */}
                    <div className="space-y-5">
                      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-display">
                          More Like This
                        </div>

                        <div className="space-y-3">
                          {INITIAL_ANIME_CATALOG.filter((a) => a.id !== watchingState.anime.id)
                            .slice(0, 3)
                            .map((rec) => (
                              <div
                                key={rec.id}
                                onClick={() => handlePlayAnime(rec, 0)}
                                className="flex items-center gap-3 p-2 rounded-lg bg-slate-950/50 hover:bg-slate-800 border border-slate-800/80 transition-all cursor-pointer group"
                              >
                                <div className="w-14 aspect-[3/4] rounded overflow-hidden shrink-0 bg-slate-900">
                                  <img
                                    src={rec.coverImage}
                                    alt={rec.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-semibold text-white group-hover:text-rose-400 truncate">
                                    {rec.title}
                                  </div>
                                  <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                                    ★ {rec.score.toFixed(1)}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                    {rec.genres.slice(0, 2).join(' / ')}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : activeTab === 'mylist' ? (
          /* MY LIST VIEW */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
            <MyListView
              watchlistMap={watchlistMap}
              animeList={INITIAL_ANIME_CATALOG}
              onPlay={(anime) => handlePlayAnime(anime, 0)}
              onViewDetails={(anime) => setSelectedAnimeForModal(anime)}
              onRemoveFromWatchlist={(id) => handleToggleWatchlist(id)}
              onUpdateStatus={handleUpdateWatchlistStatus}
            />
          </div>
        ) : (
          /* BROWSE / TRENDING / SEASONAL / GENRES VIEW */
          <div className="space-y-10">
            {/* Hero Showcase Banner */}
            <HeroBanner
              anime={featuredAnime}
              onPlay={(anime, idx) => handlePlayAnime(anime, idx)}
              onToggleWatchlist={handleToggleWatchlist}
              isInWatchlist={!!watchlistMap[featuredAnime.id]}
              onViewDetails={(anime) => setSelectedAnimeForModal(anime)}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
              {/* Continue Watching Row (if user has active in-progress anime) */}
              <ContinueWatchingRow
                progressList={continueWatchingItems}
                onResume={(anime, epNum) => {
                  const idx = anime.episodes.findIndex((e) => e.episodeNumber === epNum);
                  handlePlayAnime(anime, idx !== -1 ? idx : 0);
                }}
              />

              {/* Genre / Format / Sorting Filter Bar */}
              <FilterBar
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
                selectedFormat={selectedFormat}
                onSelectFormat={setSelectedFormat}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />

              {/* Anime Catalog Grid */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                    {activeTab === 'trending'
                      ? 'Trending Anime This Week'
                      : activeTab === 'seasonal'
                      ? 'Fall & Summer Seasonal Anime'
                      : selectedGenre !== 'All'
                      ? `${selectedGenre} Anime`
                      : 'All Anime Series'}
                  </h2>

                  <div className="text-xs text-slate-400 font-mono tabular-nums">
                    Showing {filteredCatalog.length} series
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                  {filteredCatalog.map((anime) => (
                    <AnimeCard
                      key={anime.id}
                      anime={anime}
                      onPlay={(a) => handlePlayAnime(a, 0)}
                      onViewDetails={(a) => setSelectedAnimeForModal(a)}
                      onToggleWatchlist={handleToggleWatchlist}
                      isInWatchlist={!!watchlistMap[anime.id]}
                    />
                  ))}
                </div>

                {filteredCatalog.length === 0 && (
                  <div className="text-center py-16 bg-slate-900/30 border border-slate-800 rounded-xl">
                    <p className="text-sm text-slate-400">
                      No anime found for genre "{selectedGenre}". Try selecting "All" or a different category.
                    </p>
                  </div>
                )}
              </section>

              {/* Quick Stream Features Info */}
              <section className="bg-gradient-to-r from-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <h3 className="text-lg font-bold text-white font-display">
                    Have your own video or anime clip link?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Paste any custom MP4 or WebM stream URL to watch it with full theater mode, Danmaku bullet comments, and speed adjustments.
                  </p>
                </div>
                <button
                  onClick={() => setIsCustomStreamOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shrink-0 shadow-lg shadow-rose-950/60 cursor-pointer"
                >
                  <Radio className="w-4 h-4" />
                  <span>Launch Custom Stream</span>
                </button>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        animeList={INITIAL_ANIME_CATALOG}
        onPlay={(anime) => handlePlayAnime(anime, 0)}
        onViewDetails={(anime) => setSelectedAnimeForModal(anime)}
      />

      <CustomStreamModal
        isOpen={isCustomStreamOpen}
        onClose={() => setIsCustomStreamOpen(false)}
        onLoadCustomStream={handleLoadCustomStream}
      />

      <AnimeDetailModal
        anime={selectedAnimeForModal}
        isOpen={!!selectedAnimeForModal}
        onClose={() => setSelectedAnimeForModal(null)}
        onPlayEpisode={(anime, idx) => handlePlayAnime(anime, idx)}
        onToggleWatchlist={handleToggleWatchlist}
        isInWatchlist={!!selectedAnimeForModal && !!watchlistMap[selectedAnimeForModal.id]}
      />

      {/* Quiet Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#090d14] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300 font-display">KuroNami Anime</span>
            <span>·</span>
            <span>Stream anime in high definition</span>
          </div>
          <div>
            Built with modern web media standards, Danmaku commentary & progress tracking.
          </div>
        </div>
      </footer>
    </div>
  );
}
