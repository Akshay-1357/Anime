import React, { useState } from 'react';
import { X, Play, Radio, Check, Link as LinkIcon, Sparkles } from 'lucide-react';
import { DEMO_PRESET_STREAMS } from '../data/animeCatalog';

interface CustomStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadCustomStream: (streamUrl: string, title: string) => void;
}

export const CustomStreamModal: React.FC<CustomStreamModalProps> = ({
  isOpen,
  onClose,
  onLoadCustomStream,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please provide a video stream URL.');
      return;
    }

    try {
      new URL(url.trim());
    } catch {
      setError('Please enter a valid URL (starting with https://).');
      return;
    }

    onLoadCustomStream(url.trim(), title.trim() || 'Custom Anime Stream');
    onClose();
  };

  const handleSelectPreset = (preset: { name: string; url: string }) => {
    onLoadCustomStream(preset.url, preset.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-bold text-white font-display">
              Custom Anime Stream Player
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-400 leading-relaxed">
            Want to stream your own anime episode or test video file? Enter any direct MP4 or WebM video URL below to stream it with full player controls, Danmaku bullet comments, and speed adjustments.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Video Stream URL <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://example.com/anime-episode.mp4"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError('');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 pl-9 pr-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
              {error && <p className="text-rose-400 text-xs mt-1">{error}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Stream Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. My Anime Episode Special"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-lg shadow-rose-950/50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Custom Stream</span>
            </button>
          </form>

          {/* Presets */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Test Feeds (Direct High-Definition CDNs):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_PRESET_STREAMS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className="text-left p-2.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-xs transition-colors cursor-pointer group"
                >
                  <div className="font-semibold text-slate-200 group-hover:text-rose-400 truncate">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{preset.format}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
