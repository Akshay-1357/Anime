import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Eye, EyeOff, Send, Clock } from 'lucide-react';
import { EpisodeComment } from '../types/anime';

interface CommentSectionProps {
  episodeId: string;
  comments: EpisodeComment[];
  onAddComment: (comment: { text: string; isSpoiler: boolean; videoTimecode?: string }) => void;
  currentTimeSeconds: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  episodeId,
  comments,
  onAddComment,
  currentTimeSeconds,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [includeTimecode, setIncludeTimecode] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  const [upvotesMap, setUpvotesMap] = useState<Record<string, number>>({});

  const episodeComments = comments.filter((c) => c.episodeId === episodeId);

  const formatSecs = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment({
      text: commentText.trim(),
      isSpoiler,
      videoTimecode: includeTimecode ? formatSecs(currentTimeSeconds) : undefined,
    });

    setCommentText('');
    setIsSpoiler(false);
    setIncludeTimecode(false);
  };

  const toggleSpoiler = (commentId: string) => {
    setRevealedSpoilers((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleUpvote = (commentId: string, current: number) => {
    setUpvotesMap((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] !== undefined ? prev[commentId] : current) + 1,
    }));
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-rose-500" />
          <h2 className="text-base font-bold text-white font-display">
            Episode Discussion
          </h2>
          <span className="text-xs text-slate-500 font-mono">({episodeComments.length})</span>
        </div>
        <div className="text-xs text-slate-400">Be respectful and tag spoilers!</div>
      </div>

      {/* New Comment Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          rows={3}
          placeholder="Share your thoughts on this episode..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
        />

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
              <input
                type="checkbox"
                checked={isSpoiler}
                onChange={(e) => setIsSpoiler(e.target.checked)}
                className="accent-rose-600 rounded cursor-pointer"
              />
              <span>Mark as Spoiler</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
              <input
                type="checkbox"
                checked={includeTimecode}
                onChange={(e) => setIncludeTimecode(e.target.checked)}
                className="accent-rose-600 rounded cursor-pointer"
              />
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Timestamp ({formatSecs(currentTimeSeconds)})</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!commentText.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Comment</span>
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-4 pt-2">
        {episodeComments.map((comment) => {
          const isRevealed = revealedSpoilers[comment.id];
          const upvotes = upvotesMap[comment.id] !== undefined ? upvotesMap[comment.id] : comment.upvotes;

          return (
            <div key={comment.id} className="flex gap-3 text-sm pb-4 border-b border-slate-800/60 last:border-b-0">
              {/* User Avatar */}
              <div
                className={`w-8 h-8 rounded-full ${comment.avatarColor} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm`}
              >
                {comment.userName.charAt(0).toUpperCase()}
              </div>

              {/* Comment Content */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-200 text-xs">{comment.userName}</span>
                  <span className="text-[11px] text-slate-500">{comment.timestamp}</span>

                  {comment.videoTimecode && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-rose-400 text-[10px] font-mono">
                      @{comment.videoTimecode}
                    </span>
                  )}

                  {comment.isSpoiler && (
                    <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                      Spoiler
                    </span>
                  )}
                </div>

                {comment.isSpoiler && !isRevealed ? (
                  <div
                    onClick={() => toggleSpoiler(comment.id)}
                    className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg cursor-pointer flex items-center justify-between text-xs text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    <span>This comment contains spoilers. Click to reveal.</span>
                    <Eye className="w-4 h-4 ml-2 shrink-0" />
                  </div>
                ) : (
                  <div>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{comment.text}</p>
                    {comment.isSpoiler && isRevealed && (
                      <button
                        onClick={() => toggleSpoiler(comment.id)}
                        className="text-[10px] text-slate-500 hover:text-slate-400 mt-1 flex items-center gap-1 cursor-pointer"
                      >
                        <EyeOff className="w-3 h-3" /> Hide spoiler
                      </button>
                    )}
                  </div>
                )}

                {/* Upvotes row */}
                <div className="flex items-center gap-4 pt-1">
                  <button
                    onClick={() => handleUpvote(comment.id, comment.upvotes)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span className="tabular-nums">{upvotes}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {episodeComments.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-500">
            No comments yet. Be the first to share your thoughts on this episode!
          </div>
        )}
      </div>
    </div>
  );
};
