import React, { useState, useEffect } from 'react';
import { HookVariation, Tweet, ThemeMode } from '../types';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  TrendingUp, 
  Flame, 
  Send,
  Zap,
  RefreshCw
} from 'lucide-react';
import { generateClientSideVariations } from '../utils/analytics';

interface HookRemixModalProps {
  sourceText: string;
  sourceTweet?: Tweet | null;
  onClose: () => void;
  onLoadIntoStudio: (hookText: string) => void;
  onPublishDirectly: (hookText: string) => void;
  theme: ThemeMode;
}

export const HookRemixModal: React.FC<HookRemixModalProps> = ({
  sourceText,
  sourceTweet,
  onClose,
  onLoadIntoStudio,
  onPublishDirectly,
  theme,
}) => {
  const isDark = theme === 'dark';
  // Instantly generate variations on client-side: 0ms latency, zero backend dependency!
  const [variations, setVariations] = useState<HookVariation[]>(() =>
    generateClientSideVariations(sourceText, sourceTweet?.category)
  );
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const refreshHooks = () => {
    setLoading(true);
    // Shuffle and regenerate instantly
    setTimeout(() => {
      setVariations(generateClientSideVariations(sourceText, sourceTweet?.category));
      setLoading(false);
    }, 200);
  };

  const handleCopy = (hook: string, index: number) => {
    navigator.clipboard.writeText(hook);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-xs transition-colors border ${
        isDark ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${
          isDark ? 'border-[#2f3336]' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#1d9bf0] flex items-center justify-center text-white font-black text-xs">
              ✨
            </div>
            <div>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Remix Post</h3>
              <p className={`text-[11px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>
                5 fresh angles to get more likes and bookmarks
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshHooks}
              disabled={loading}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'text-[#71767b] hover:text-white hover:bg-[#16181c]' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="Refresh variations"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#1d9bf0]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className={`p-1 rounded-full transition-colors ${
                isDark ? 'text-[#71767b] hover:text-white hover:bg-[#16181c]' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Source Idea preview */}
        <div className={`px-5 py-2.5 border-b flex items-center gap-2 ${
          isDark ? 'bg-[#080808] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
        }`}>
          <span className={`text-[10px] uppercase font-mono shrink-0 font-bold ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>
            Source:
          </span>
          <p className={`text-[11px] truncate italic ${isDark ? 'text-[#eff3f4]' : 'text-gray-800'}`}>
            "{sourceText.replace(/\n/g, ' ')}"
          </p>
        </div>

        {/* Variations List */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-3.5">
          {variations.map((v, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-3.5 space-y-2.5 border transition-all ${
                isDark 
                  ? 'bg-[#16181c] border-[#2f3336] hover:border-[#1d9bf0]/50' 
                  : 'bg-white border-gray-200 hover:border-[#1d9bf0] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>{v.style}</span>
                  <span className={`text-[10px] ${isDark ? 'text-[#71767b]' : 'text-gray-400'}`}>Angle #{idx + 1}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Zap className="w-3 h-3" />
                  <span>{v.projectedScore}% Reach</span>
                </div>
              </div>

              <div className={`p-2.5 rounded-lg border text-xs font-mono whitespace-pre-wrap leading-relaxed ${
                isDark ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}>
                {v.hook}
              </div>

              <div className={`text-[11px] flex items-center gap-1.5 ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>
                <span className="text-[#1d9bf0] font-semibold">Why this works:</span>
                <span>{v.reasoning}</span>
              </div>

              <div className={`flex items-center justify-end gap-2 pt-1 border-t ${
                isDark ? 'border-[#2f3336]/60' : 'border-gray-100'
              }`}>
                <button
                  onClick={() => handleCopy(v.hook, idx)}
                  className={`px-2.5 py-1 rounded border flex items-center gap-1 text-[11px] transition-colors ${
                    isDark
                      ? 'bg-[#000000] hover:bg-[#2f3336] border-[#2f3336] text-[#eff3f4]'
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800'
                  }`}
                >
                  {copiedIndex === idx ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => {
                    onLoadIntoStudio(v.hook);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <span>Use in Writer</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <button
                  onClick={() => {
                    onPublishDirectly(v.hook);
                    onClose();
                  }}
                  className={`px-2.5 py-1 rounded border text-[#1d9bf0] font-semibold text-[11px] flex items-center gap-1 transition-colors ${
                    isDark
                      ? 'bg-[#16181c] hover:bg-[#2f3336] border-[#2f3336]'
                      : 'bg-blue-50 hover:bg-blue-100 border-blue-200'
                  }`}
                  title="Publish directly into feed simulator"
                >
                  <Send className="w-3 h-3" />
                  <span>Post to Feed</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-5 py-3 border-t ${
          isDark ? 'bg-[#000000] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
        }`}>
          <span className={`text-[11px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>
            Zero-latency client heuristics calibrated to modern X algorithm
          </span>
          <button
            onClick={onClose}
            className={`px-3.5 py-1.5 rounded-lg font-medium text-xs transition-colors border ${
              isDark ? 'bg-[#16181c] hover:bg-[#2f3336] text-[#eff3f4] border-[#2f3336]' : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-200 shadow-xs'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
