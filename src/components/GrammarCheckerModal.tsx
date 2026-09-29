import React, { useState } from 'react';
import { GrammarCheckResult, GrammarIssue, ThemeMode } from '../types';
import { 
  X, 
  CheckCheck, 
  Sparkles, 
  Check, 
  Copy, 
  ArrowRight, 
  AlertCircle, 
  SpellCheck,
  Zap,
  RefreshCw,
  Sliders,
  Scissors
} from 'lucide-react';
import { checkGrammarAndClarity, applyGrammarFix, applyAllGrammarFixes } from '../utils/analytics';

interface GrammarCheckerModalProps {
  initialText: string;
  onClose: () => void;
  onApplyText: (fixedText: string) => void;
  theme: ThemeMode;
}

export const GrammarCheckerModal: React.FC<GrammarCheckerModalProps> = ({
  initialText,
  onClose,
  onApplyText,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [currentText, setCurrentText] = useState(initialText);
  const [result, setResult] = useState<GrammarCheckResult>(() => checkGrammarAndClarity(initialText));
  const [copied, setCopied] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'spelling' | 'grammar' | 'punctuation' | 'wordiness'>('all');

  // Run deep AI scan via Gemini API
  const handleDeepAiScan = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/check-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentText }),
      });
      const data = await res.json();
      if (data && data.success && data.result) {
        setResult(data.result);
      } else {
        // Fallback to local rule engine
        setResult(checkGrammarAndClarity(currentText));
      }
    } catch {
      setResult(checkGrammarAndClarity(currentText));
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplySingleIssue = (issue: GrammarIssue) => {
    const updated = applyGrammarFix(currentText, issue);
    setCurrentText(updated);
    // Re-check remaining issues
    setResult(checkGrammarAndClarity(updated));
  };

  const handleApplyAll = () => {
    const updated = applyAllGrammarFixes(currentText, result.issues);
    setCurrentText(updated);
    setResult(checkGrammarAndClarity(updated));
  };

  const handleSaveAndClose = () => {
    onApplyText(currentText);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredIssues = result.issues.filter((iss) => {
    if (activeFilter === 'all') return true;
    return iss.type === activeFilter;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 75) return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
    if (score >= 60) return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-500 border-rose-500/30 bg-rose-500/10';
  };

  const getTypeBadge = (type: GrammarIssue['type']) => {
    switch (type) {
      case 'spelling':
        return { label: 'Spelling', bg: 'bg-rose-500/15 text-rose-500 border-rose-500/30' };
      case 'grammar':
        return { label: 'Grammar', bg: 'bg-amber-500/15 text-amber-500 border-amber-500/30' };
      case 'punctuation':
        return { label: 'Punctuation', bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' };
      case 'wordiness':
        return { label: 'Conciseness', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      default:
        return { label: 'Clarity', bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors border ${
        isDark ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-3.5 border-b shrink-0 ${
          isDark ? 'border-[#2f3336]' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1d9bf0]/15 flex items-center justify-center text-[#1d9bf0]">
              <SpellCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Grammar & Clarity Checker</h3>
              <p className="text-[11px] text-gray-400">Proofread typos, homophones, punctuation & wordiness for high-reach posts</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Clarity Score Pill */}
            <div className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1.5 ${getScoreColor(result.score)}`}>
              <Zap className="w-3.5 h-3.5" />
              <span>{result.score}/100 Clarity</span>
            </div>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-full transition-colors ${
                isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Toolbar & Filters */}
        <div className={`px-5 py-2.5 border-b flex items-center justify-between gap-3 text-xs shrink-0 flex-wrap ${
          isDark ? 'bg-[#0c0d10] border-[#2f3336]' : 'bg-gray-50 border-gray-100'
        }`}>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                activeFilter === 'all'
                  ? 'bg-[#1d9bf0] text-white'
                  : isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({result.issues.length})
            </button>
            <button
              onClick={() => setActiveFilter('spelling')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                activeFilter === 'spelling'
                  ? 'bg-rose-500 text-white'
                  : isDark ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              Spelling ({result.issues.filter(i => i.type === 'spelling').length})
            </button>
            <button
              onClick={() => setActiveFilter('grammar')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                activeFilter === 'grammar'
                  ? 'bg-amber-500 text-white'
                  : isDark ? 'text-amber-400 hover:bg-amber-500/10' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              Grammar ({result.issues.filter(i => i.type === 'grammar').length})
            </button>
            <button
              onClick={() => setActiveFilter('punctuation')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                activeFilter === 'punctuation'
                  ? 'bg-cyan-500 text-white'
                  : isDark ? 'text-cyan-400 hover:bg-cyan-500/10' : 'text-cyan-700 hover:bg-cyan-50'
              }`}
            >
              Punctuation ({result.issues.filter(i => i.type === 'punctuation').length})
            </button>
            <button
              onClick={() => setActiveFilter('wordiness')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                activeFilter === 'wordiness'
                  ? 'bg-emerald-500 text-white'
                  : isDark ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Conciseness ({result.issues.filter(i => i.type === 'wordiness').length})
            </button>
          </div>

          <button
            onClick={handleDeepAiScan}
            disabled={isAiLoading}
            className="px-2.5 py-1 rounded-md bg-[#1d9bf0]/10 hover:bg-[#1d9bf0]/20 border border-[#1d9bf0]/30 text-[#1d9bf0] font-semibold text-[11px] flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Sparkles className={`w-3 h-3 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'Analyzing...' : 'Deep AI Proofread'}</span>
          </button>
        </div>

        {/* Content Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Status Message */}
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
            result.issues.length === 0
              ? isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : isDark ? 'bg-[#16181c] border-[#2f3336] text-gray-300' : 'bg-blue-50/50 border-blue-100 text-gray-700'
          }`}>
            <div className="flex items-center gap-2">
              {result.issues.length === 0 ? (
                <CheckCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#1d9bf0] shrink-0" />
              )}
              <span>{result.summary}</span>
            </div>

            {result.issues.length > 0 && (
              <button
                onClick={handleApplyAll}
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shrink-0 transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Fix All ({result.issues.length})</span>
              </button>
            )}
          </div>

          {/* Current Working Draft with Highlights */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Current Post Draft</span>
              <span>{currentText.length}/280 characters</span>
            </div>
            <textarea
              value={currentText}
              onChange={(e) => {
                setCurrentText(e.target.value);
                setResult(checkGrammarAndClarity(e.target.value));
              }}
              className={`w-full p-3 rounded-xl border text-sm font-sans focus:outline-none min-h-[90px] resize-none transition-colors ${
                isDark 
                  ? 'bg-[#111215] border-[#2f3336] text-[#eff3f4] focus:border-[#1d9bf0]' 
                  : 'bg-white border-gray-200 text-gray-900 focus:border-[#1d9bf0]'
              }`}
              placeholder="Type or paste your tweet text here..."
            />
          </div>

          {/* Issues List */}
          {result.issues.length > 0 ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                  Detected Improvements ({filteredIssues.length})
                </span>
                <span className="text-[11px] text-gray-500">Click "Apply" to replace in draft</span>
              </div>

              <div className="space-y-2">
                {filteredIssues.map((issue) => {
                  const badge = getTypeBadge(issue.type);
                  return (
                    <div
                      key={issue.id}
                      className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                        isDark 
                          ? 'bg-[#111215] border-[#2f3336] hover:border-gray-600' 
                          : 'bg-gray-50/70 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="text-[11px] text-gray-400">{issue.explanation}</span>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                          <span className="line-through text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                            {issue.original}
                          </span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
                            {issue.replacement || '(delete)'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplySingleIssue(issue)}
                        className="px-3 py-1.5 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold text-xs transition-colors shrink-0 flex items-center justify-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={`p-8 rounded-xl border text-center space-y-2 ${
              isDark ? 'bg-[#0f1115] border-[#2f3336]' : 'bg-gray-50 border-gray-100'
            }`}>
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm">Flawless Draft</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No grammatical errors or unnecessary fluff words detected. Your post has maximum clarity and algorithmic retention.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-between gap-3 shrink-0 ${
          isDark ? 'bg-[#090a0d] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
        }`}>
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 text-xs transition-colors ${
              isDark 
                ? 'bg-[#16181c] hover:bg-[#202227] border-[#2f3336] text-gray-300' 
                : 'bg-white hover:bg-gray-100 border-gray-200 text-gray-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndClose}
              className="px-4 py-1.5 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Use Fixed Post</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
