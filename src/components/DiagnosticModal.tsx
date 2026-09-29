import React, { useState, useEffect } from 'react';
import { Tweet, AlgorithmWeights, ViralAnalysis, ThemeMode } from '../types';
import { 
  X, 
  BarChart2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Copy, 
  Check, 
  Share2,
  Zap
} from 'lucide-react';
import { generateDiagnostic } from '../utils/analytics';

interface DiagnosticModalProps {
  tweet: Tweet | null;
  onClose: () => void;
  weights: AlgorithmWeights;
  onLoadIntoStudio: (text: string) => void;
  onOpenRemix: (tweet: Tweet) => void;
  theme: ThemeMode;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  tweet,
  onClose,
  weights,
  onLoadIntoStudio,
  onOpenRemix,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [analysis, setAnalysis] = useState<ViralAnalysis | null>(() =>
    tweet ? generateDiagnostic(tweet, weights) : null
  );

  useEffect(() => {
    if (!tweet) return;
    // Always compute instantaneously on client
    setAnalysis(generateDiagnostic(tweet, weights));
  }, [tweet, weights]);

  if (!tweet || !analysis) return null;

  const isViral = analysis.viralScore >= 90;
  const isSolid = analysis.viralScore >= 75 && analysis.viralScore < 90;

  const handleCopyRewrite = () => {
    if (!analysis.bestAlternativeHook) return;
    navigator.clipboard.writeText(analysis.bestAlternativeHook);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-xs transition-colors border ${
        isDark ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b ${
          isDark ? 'border-[#2f3336]' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#1d9bf0] flex items-center justify-center text-white font-black text-xs">
              ⚡
            </div>
            <div>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Post Performance &amp; Tips</h3>
              <p className={`text-[11px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>Stats and reach tips for @{tweet.author.handle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              isDark ? 'text-[#71767b] hover:text-white hover:bg-[#16181c]' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
          {/* Main Score Banner */}
          <div className={`rounded-xl p-4 flex items-center justify-between border ${
            isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center font-mono font-black ${
                  isViral
                    ? isDark ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : isSolid
                    ? isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-700 border border-amber-300'
                    : isDark ? 'bg-slate-500/15 text-slate-400 border border-slate-500/30' : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                <span className="text-2xl leading-none">{analysis.viralScore}</span>
                <span className="text-[9px] font-sans opacity-70">/100</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {isViral
                      ? 'Viral Reach (Top 1%)'
                      : isSolid
                      ? 'High Engagement'
                      : 'Standard Reach'}
                  </h4>
                  <span className="text-xs text-[#1d9bf0] font-mono font-bold">
                    Grade {analysis.hookGrade}
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 leading-snug ${isDark ? 'text-[#71767b]' : 'text-gray-600'}`}>
                  {analysis.hookSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Tweet snippet preview */}
          <div className={`p-3 rounded-lg border ${
            isDark ? 'bg-[#080808] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
          }`}>
            <span className={`text-[10px] font-mono block mb-1 uppercase tracking-wider font-bold ${
              isDark ? 'text-[#71767b]' : 'text-gray-400'
            }`}>
              Analyzed Text
            </span>
            <p className={`text-xs italic line-clamp-3 leading-relaxed ${isDark ? 'text-[#eff3f4]' : 'text-gray-800'}`}>
              "{tweet.text}"
            </p>
          </div>

          {/* Algorithmic Factor Breakdown */}
          {analysis.algorithmBreakdown && (
            <div className={`rounded-xl p-3.5 space-y-2 border ${
              isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              <h5 className={`font-bold text-xs flex items-center justify-between ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <span>Why It Scored This Way</span>
                <span className={`text-[10px] font-normal ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>Key Factors</span>
              </h5>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className={`p-2 rounded border ${isDark ? 'bg-[#000000] border-[#2f3336]' : 'bg-white border-gray-200 shadow-xs'}`}>
                  <span className={`block text-[10px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>Saves &amp; Bookmarks</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{analysis.algorithmBreakdown.bookmarkBonus} pts
                  </span>
                </div>
                <div className={`p-2 rounded border ${isDark ? 'bg-[#000000] border-[#2f3336]' : 'bg-white border-gray-200 shadow-xs'}`}>
                  <span className={`block text-[10px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>Reposts &amp; Shares</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{analysis.algorithmBreakdown.repostMultiplier} pts
                  </span>
                </div>
                <div className={`p-2 rounded border ${isDark ? 'bg-[#000000] border-[#2f3336]' : 'bg-white border-gray-200 shadow-xs'}`}>
                  <span className={`block text-[10px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>Easy-to-Read Spacing</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{analysis.algorithmBreakdown.formattingScore} pts
                  </span>
                </div>
                <div className={`p-2 rounded border ${isDark ? 'bg-[#000000] border-[#2f3336]' : 'bg-white border-gray-200 shadow-xs'}`}>
                  <span className={`block text-[10px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>Links in Main Post</span>
                  <span
                    className={`font-mono font-bold ${
                      analysis.algorithmBreakdown.linkPenalty < 0
                        ? 'text-red-500'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {analysis.algorithmBreakdown.linkPenalty < 0
                      ? `${analysis.algorithmBreakdown.linkPenalty} pts (Avoid links)`
                      : '0 (Clean)'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className={`p-3 rounded-xl space-y-1.5 border ${
              isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>What Worked Well</span>
              </span>
              <ul className={`space-y-1 ${isDark ? 'text-[#eff3f4]' : 'text-gray-700'}`}>
                {analysis.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`p-3 rounded-xl space-y-1.5 border ${
              isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Tips to Improve</span>
              </span>
              <ul className={`space-y-1 ${isDark ? 'text-[#eff3f4]' : 'text-gray-700'}`}>
                {analysis.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Growth Action */}
          <div className={`p-3.5 rounded-xl space-y-1 text-xs border ${
            isDark ? 'bg-[#1d9bf0]/10 border-[#1d9bf0]/30' : 'bg-blue-50/80 border-blue-200'
          }`}>
            <span className="font-bold text-[#1d9bf0] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Recommended Action to 3x Reach</span>
            </span>
            <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#eff3f4]' : 'text-gray-800'}`}>
              {analysis.recommendedAction}
            </p>
          </div>

          {/* Alternative Hook Rewrite */}
          {analysis.bestAlternativeHook && (
            <div className={`rounded-xl p-3.5 space-y-2 border ${
              isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className={`font-bold flex items-center gap-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <Sparkles className="w-3.5 h-3.5 text-[#1d9bf0]" />
                  <span>Optimized Alternative Hook</span>
                </span>
                <button
                  onClick={handleCopyRewrite}
                  className="text-[11px] text-[#1d9bf0] hover:underline flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Rewrite'}</span>
                </button>
              </div>

              <p className={`p-2.5 rounded border text-[11px] font-mono leading-relaxed whitespace-pre-line ${
                isDark ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' : 'bg-white border-gray-200 text-gray-800'
              }`}>
                {analysis.bestAlternativeHook}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`flex items-center justify-between px-5 py-3 border-t ${
          isDark ? 'bg-[#000000] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
        }`}>
          <button
            onClick={() => onOpenRemix(tweet)}
            className="px-3.5 py-1.5 rounded-lg bg-[#1d9bf0]/10 hover:bg-[#1d9bf0]/20 border border-[#1d9bf0]/30 text-[#1d9bf0] font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate 5 Variations</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLoadIntoStudio(analysis.bestAlternativeHook || tweet.text);
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Load into Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
