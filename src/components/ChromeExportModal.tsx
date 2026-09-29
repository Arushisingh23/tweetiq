import React from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Bookmark,
  ArrowRight
} from 'lucide-react';
import { ThemeMode } from '../types';

interface ChromeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const ChromeExportModal: React.FC<ChromeExportModalProps> = ({ isOpen, onClose, theme }) => {
  const isDark = theme === 'dark';
  const [copiedLink, setCopiedLink] = React.useState(false);

  const shareableUrl = window.location.origin;

  if (!isOpen) return null;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className={`rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-xs transition-colors border ${
        isDark ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' : 'bg-white border-gray-200 text-gray-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-[#2f3336]' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1d9bf0] flex items-center justify-center text-white font-black text-sm">
              𝕏
            </div>
            <div>
              <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                How to Use TweetIQ with Your X Account
              </h3>
              <p className={`text-[11px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>
                Ready to use instantly on desktop, tablet, or mobile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isDark ? 'text-[#71767b] hover:text-white hover:bg-[#16181c]' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
            }`}>
              <span className="w-6 h-6 rounded-full bg-[#1d9bf0] text-white font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <strong className="block mb-0.5 text-xs">Bookmark TweetIQ for Fast Access</strong>
                <span className="text-gray-400 text-[11px]">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-gray-500/20 font-mono text-[10px]">Ctrl+D</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-gray-500/20 font-mono text-[10px]">Cmd+D</kbd> in your browser to save this link on your bookmarks bar.
                </span>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
            }`}>
              <span className="w-6 h-6 rounded-full bg-[#1d9bf0] text-white font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <strong className="block mb-0.5 text-xs">Draft &amp; Calculate Reach Before Posting</strong>
                <span className="text-gray-400 text-[11px]">
                  Write your hook in TweetIQ. Watch your algorithmic reach score update live to ensure high bookmark conversion and zero link suppression penalties.
                </span>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
            }`}>
              <span className="w-6 h-6 rounded-full bg-[#1d9bf0] text-white font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <strong className="block mb-0.5 text-xs">Post to X with 1-Click</strong>
                <span className="text-gray-400 text-[11px]">
                  Click &apos;Post to X&apos; or schedule at your highest audience traffic window.
                </span>
              </div>
            </div>
          </div>

          {/* Quick link */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            isDark ? 'bg-black border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            <span className="font-mono text-gray-400 text-xs truncate mr-2">{shareableUrl}</span>
            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1 rounded bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold text-xs flex items-center gap-1 shrink-0"
            >
              {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink ? 'Copied' : 'Copy App Link'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`px-6 py-3.5 border-t flex items-center justify-between ${
          isDark ? 'bg-[#000000] border-[#2f3336]' : 'bg-white border-gray-200'
        }`}>
          <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>100% Private · On-Device Data</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#1d9bf0] hover:bg-[#1a8cd8] active:scale-95 text-white font-bold text-xs"
          >
            Got it, Let&apos;s Go
          </button>
        </div>
      </div>
    </div>
  );
};
