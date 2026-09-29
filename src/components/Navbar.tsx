import React from 'react';
import { 
  Download, 
  Layout, 
  Layers, 
  Sun, 
  Moon,
  Sparkles,
  TrendingUp,
  Globe
} from 'lucide-react';
import { ThemeMode, LicenseState } from '../types';

interface NavbarProps {
  activeView: 'landing' | 'webstore' | 'split' | 'feed' | 'panel' | 'export';
  setActiveView: (view: 'landing' | 'webstore' | 'split' | 'feed' | 'panel' | 'export') => void;
  onOpenExport: () => void;
  onOpenPricing: () => void;
  onOpenMediaKit: () => void;
  onOpenTracker?: () => void;
  totalAnalyzed: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  license: LicenseState;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenExport,
  onOpenPricing,
  onOpenTracker,
  theme,
  onToggleTheme,
  license,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-40 px-4 py-2.5 transition-colors border-b ${
      isDark 
        ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' 
        : 'bg-white border-gray-200 text-gray-900 shadow-xs'
    }`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity"
            title="Go to TweetIQ Website Overview"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1d9bf0] flex items-center justify-center text-white font-black text-sm shadow-xs">
              𝕏
            </div>
            <div>
              <span className={`font-bold tracking-tight text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                TweetIQ
              </span>
              <span className="text-[11px] text-gray-400 ml-2 hidden sm:inline">
                notesiq for X / Twitter
              </span>
            </div>
          </button>
        </div>

        {/* View Switcher: Website Landing vs Live Feed + App vs Assistant Only */}
        <div className={`flex items-center gap-1 p-1 rounded-xl border ${
          isDark 
            ? 'bg-[#16181c] border-[#2f3336]' 
            : 'bg-gray-100 border-gray-200'
        }`}>
          <button
            onClick={() => setActiveView('landing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'landing'
                ? isDark
                  ? 'bg-[#2f3336] text-white shadow-xs font-bold'
                  : 'bg-white text-gray-900 shadow-xs border border-gray-200 font-bold'
                : isDark
                ? 'text-[#71767b] hover:text-[#eff3f4]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Website landing page (NotesIQ style)"
          >
            <Globe className="w-3.5 h-3.5 text-[#1d9bf0]" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveView('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'split'
                ? isDark
                  ? 'bg-[#2f3336] text-white shadow-xs font-bold'
                  : 'bg-white text-gray-900 shadow-xs border border-gray-200 font-bold'
                : isDark
                ? 'text-[#71767b] hover:text-[#eff3f4]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Interactive Twitter feed + Assistant simulator"
          >
            <Layout className="w-3.5 h-3.5 text-[#1d9bf0]" />
            <span>Live App</span>
          </button>

          <button
            onClick={() => setActiveView('panel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'panel'
                ? isDark
                  ? 'bg-[#2f3336] text-white shadow-xs font-bold'
                  : 'bg-white text-gray-900 shadow-xs border border-gray-200 font-bold'
                : isDark
                ? 'text-[#71767b] hover:text-[#eff3f4]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Extension side panel only"
          >
            <Layers className="w-3.5 h-3.5 text-[#1d9bf0]" />
            <span className="hidden md:inline">Side Panel</span>
          </button>
        </div>

        {/* Clean right controls: Trends + Pricing + Theme + Download Extension */}
        <div className="flex items-center gap-2">
          {/* Engagement Tracker / Trends Button */}
          {onOpenTracker && (
            <button
              onClick={onOpenTracker}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                isDark
                  ? 'border-[#2f3336] bg-[#16181c] text-[#eff3f4] hover:bg-[#2f3336]'
                  : 'border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100'
              }`}
              title="Daily follower growth & performance trends"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#1d9bf0]" />
              <span className="hidden sm:inline">Trends</span>
            </button>
          )}

          {/* Go Pro / Monetization Button */}
          <button
            onClick={onOpenPricing}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all shadow-xs ${
              license.hasLifetime
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold'
            }`}
            title="Premium pricing and creator bank setup"
          >
            <span>{license.hasLifetime ? '✓ Pro Active' : '⚡ Go Pro ($29)'}</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-full border transition-all flex items-center justify-center ${
              isDark
                ? 'bg-[#16181c] border-[#2f3336] text-yellow-400 hover:bg-[#2f3336]'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setActiveView(activeView === 'landing' ? 'split' : 'landing')}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] active:scale-95 transition-all shadow-xs"
          >
            <span>{activeView === 'landing' ? 'Launch App' : 'Overview'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
