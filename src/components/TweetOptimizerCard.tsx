import React, { useState } from 'react';
import { 
  Wand2, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Bookmark, 
  Plus, 
  ArrowRight, 
  RotateCcw, 
  SpellCheck, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ThemeMode, AddOnSuggestion } from '../types';
import { optimizeTweet, generateOptimizedHooks } from '../utils/tweetOptimizer';

interface TweetOptimizerCardProps {
  draftText: string;
  onApplyPolishedText: (polished: string) => void;
  theme: ThemeMode;
}

export const TweetOptimizerCard: React.FC<TweetOptimizerCardProps> = ({
  draftText,
  onApplyPolishedText,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [previousDraft, setPreviousDraft] = useState<string | null>(null);
  const [appliedNotice, setAppliedNotice] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedHookIndex, setSelectedHookIndex] = useState(0);

  if (!draftText || draftText.trim().length < 8) {
    return null;
  }

  const result = optimizeTweet(draftText);
  const alternativeHooks = generateOptimizedHooks(draftText);
  const currentAlternativeHook = alternativeHooks[selectedHookIndex]?.hook || result.improvedHook;

  // Build the complete optimized draft with the currently selected hook
  const lines = result.polishedText.split('\n');
  const polishedWithChosenHook = [currentAlternativeHook, ...lines.slice(1)].join('\n');

  const handleApply = (textToApply: string) => {
    setPreviousDraft(draftText);
    onApplyPolishedText(textToApply);
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 3000);
  };

  const handleRevert = () => {
    if (previousDraft) {
      onApplyPolishedText(previousDraft);
      setPreviousDraft(null);
    }
  };

  const handleAddSnippet = (addon: AddOnSuggestion) => {
    const updated = `${draftText.trim()}${addon.textToAdd}`;
    onApplyPolishedText(updated);
  };

  const hasIssuesToFix = result.fixedGrammarCount > 0 || result.formattingImproved;

  return (
    <div
      className={`rounded-xl border transition-all overflow-hidden ${
        isDark ? 'bg-[#0a0c10] border-[#2f3336]' : 'bg-gray-50/90 border-gray-200'
      }`}
    >
      {/* Header Summary Bar */}
      <div className="p-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#1d9bf0]/15 text-[#1d9bf0] flex items-center justify-center shrink-0">
            <Wand2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs truncate">Smart Optimizer & Polish</span>
              {hasIssuesToFix ? (
                <span className="text-[10px] text-amber-500 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {result.fixedGrammarCount} issue{result.fixedGrammarCount !== 1 ? 's' : ''} detected
                </span>
              ) : (
                <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  ✓ Grammar Clean
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-400 truncate">
              Predicted Reach: <strong className="text-emerald-500">+{result.predictedReachMultiplier}x</strong> · Bookmarks: <strong className="text-[#1d9bf0]">+{result.potentialBookmarksBoost}%</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleApply(polishedWithChosenHook)}
            className="px-3 py-1.5 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title="Auto-replace draft with proper formatting, grammar fixes, and high-retention hook"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Polish</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-lg border text-gray-400 hover:text-white transition-colors cursor-pointer ${
              isDark ? 'border-[#2f3336] hover:bg-white/5' : 'border-gray-200 hover:bg-gray-100'
            }`}
            title="Toggle optimizer details"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Applied Success Toast */}
      {appliedNotice && (
        <div className="px-3 py-1.5 bg-emerald-500/15 border-t border-b border-emerald-500/30 text-emerald-500 text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Draft replaced with polished hook & format!</span>
          </div>
          {previousDraft && (
            <button
              onClick={handleRevert}
              className="text-[11px] underline font-bold hover:text-emerald-400 cursor-pointer"
            >
              Undo
            </button>
          )}
        </div>
      )}

      {/* Expanded Optimizer Panel */}
      {isExpanded && (
        <div className={`p-3 border-t space-y-3.5 ${isDark ? 'border-[#2f3336]' : 'border-gray-200'}`}>
          {/* 1. Algorithmic Impact Prediction */}
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#1d9bf0]" />
              <span>How Much It Will Work (Predicted Algorithmic Lift)</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className={`p-2 rounded-lg border ${isDark ? 'bg-black/40 border-[#2f3336]' : 'bg-white border-gray-200'}`}>
                <div className="text-[10px] text-gray-400">Reach Multiplier</div>
                <div className="font-mono font-bold text-xs text-emerald-500">
                  {result.predictedReachMultiplier}x
                </div>
              </div>

              <div className={`p-2 rounded-lg border ${isDark ? 'bg-black/40 border-[#2f3336]' : 'bg-white border-gray-200'}`}>
                <div className="text-[10px] text-gray-400">Bookmark Lift</div>
                <div className="font-mono font-bold text-xs text-[#1d9bf0]">
                  +{result.potentialBookmarksBoost}%
                </div>
              </div>

              <div className={`p-2 rounded-lg border ${isDark ? 'bg-black/40 border-[#2f3336]' : 'bg-white border-gray-200'}`}>
                <div className="text-[10px] text-gray-400">Score Impact</div>
                <div className="font-mono font-bold text-xs text-amber-500">
                  +{result.projectedScoreDiff} pts
                </div>
              </div>
            </div>
          </div>

          {/* 2. Right Hook Selector */}
          <div>
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#ff7a00]" />
              <span>Right Hook Replacement</span>
            </div>

            <div className="space-y-1.5">
              {alternativeHooks.map((h, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedHookIndex(i)}
                  className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedHookIndex === i
                      ? isDark
                        ? 'border-[#1d9bf0] bg-[#1d9bf0]/10 text-white'
                        : 'border-[#1d9bf0] bg-blue-50 text-gray-900'
                      : isDark
                      ? 'border-[#2f3336] bg-black/20 text-gray-300 hover:border-gray-600'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold text-[#1d9bf0]">{h.formula}</span>
                    <span className="text-emerald-500 font-semibold">{h.impact}</span>
                  </div>
                  <p className="line-clamp-2 leading-relaxed">{h.hook}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Things to Add (1-Click Enhancements) */}
          {result.addOnSuggestions.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Plus className="w-3 h-3 text-cyan-400" />
                <span>Things You Can Add (High-Yield Add-Ons)</span>
              </div>

              <div className="space-y-1.5">
                {result.addOnSuggestions.map((addon) => (
                  <div
                    key={addon.id}
                    className={`p-2 rounded-lg border flex items-center justify-between gap-2 text-xs ${
                      isDark ? 'bg-black/30 border-[#2f3336]' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-[11px] flex items-center gap-1.5">
                        <span>{addon.label}</span>
                        <span className="text-[10px] text-emerald-500 font-normal">{addon.impact}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                        {addon.textToAdd.trim()}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddSnippet(addon)}
                      className="px-2 py-1 rounded-md text-[11px] font-bold bg-[#1d9bf0]/15 hover:bg-[#1d9bf0] text-[#1d9bf0] hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Action Buttons Inside Drawer */}
          <div className="pt-1 flex items-center justify-between gap-2">
            {previousDraft ? (
              <button
                onClick={handleRevert}
                className="text-xs text-gray-400 hover:text-white underline cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Revert to original</span>
              </button>
            ) : <span />}

            <button
              onClick={() => handleApply(polishedWithChosenHook)}
              className="px-4 py-2 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-auto"
            >
              <span>Replace Draft with Polished Version</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
