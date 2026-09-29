import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Star, 
  ShieldCheck, 
  Download, 
  TrendingUp, 
  Clock, 
  Zap, 
  Bookmark, 
  Calendar, 
  RefreshCw, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  MessageSquare, 
  Eye, 
  Users, 
  Flame, 
  Play, 
  ExternalLink,
  Laptop,
  HelpCircle,
  HeartHandshake,
  DollarSign
} from 'lucide-react';
import { ThemeMode, LicenseState, Tweet } from '../types';

interface LandingPageViewProps {
  onOpenApp: () => void;
  onOpenExportModal: () => void;
  onOpenPricing: () => void;
  onOpenTracker: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  license: LicenseState;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenApp,
  onOpenExportModal,
  onOpenPricing,
  onOpenTracker,
  theme,
  license,
}) => {
  const isDark = theme === 'dark';
  const [interactiveTab, setInteractiveTab] = useState<'writer' | 'heatmap' | 'trends' | 'queue'>('writer');

  return (
    <div className={`min-h-screen transition-colors ${
      isDark ? 'bg-[#000000] text-[#eff3f4]' : 'bg-[#fafafa] text-gray-900'
    }`}>
      {/* Announcement Bar */}
      <div className={`py-2 px-4 text-center text-xs font-medium border-b flex items-center justify-center gap-2 ${
        isDark 
          ? 'bg-[#12141a] border-[#2f3336] text-gray-300' 
          : 'bg-blue-50 border-blue-100 text-blue-900'
      }`}>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1d9bf0] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1d9bf0]"></span>
        </span>
        <span>
          <strong>TweetIQ v1.2 is live:</strong> Real-time Algorithmic Reach Predictor &amp; Follower Trendlines.
        </span>
        <button
          onClick={onOpenApp}
          className="text-[#1d9bf0] font-bold hover:underline ml-1 inline-flex items-center gap-1"
        >
          <span>Launch TweetIQ</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#1d9bf0]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Hero Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border transition-all shadow-xs backdrop-blur-md bg-white/5 border-white/10 text-[#1d9bf0]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The #1 Analytics &amp; Scheduler Companion for X / Twitter</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] max-w-4xl mx-auto mb-6">
          Grow faster on X with data,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1d9bf0] via-cyan-400 to-blue-500">
            not guesswork.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-2xl text-gray-200 max-w-2xl mx-auto mb-3 font-semibold leading-relaxed">
          No account, no email, no signup wall — install it, open Twitter, and it just works.
        </p>
        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Predict reach scores before posting, discover peak audience windows, queue evergreen posts, and turn impressions into bookmarks &amp; followers.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-8">
          <button
            onClick={onOpenApp}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1d9bf0] hover:bg-[#1a8cd8] active:scale-95 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#1d9bf0]/25"
          >
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-black">
              𝕏
            </div>
            <span>Start Using TweetIQ Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('interactive-demo-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border ${
              isDark 
                ? 'bg-[#16181c] hover:bg-[#202327] border-[#2f3336] text-white' 
                : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-900 shadow-xs'
            }`}
          >
            <Play className="w-4 h-4 text-[#1d9bf0] fill-[#1d9bf0]" />
            <span>Interactive Demo</span>
          </button>
        </div>

        {/* Real Product & Privacy Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-bold">No Account · No Email · No Signup Wall</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <Laptop className="w-4 h-4 text-[#1d9bf0]" />
            <span>Chrome Manifest V3 · Brave, Arc, Edge &amp; Chrome</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Open-Source X Algorithm Grounded</span>
          </div>
        </div>
      </section>

      {/* Interactive Browser Product Showcase (Like NotesIQ) */}
      <section id="interactive-demo-section" className="px-4 max-w-6xl mx-auto mb-24 scroll-mt-20">
        <div className={`rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark 
            ? 'bg-[#0a0a0d] border-[#2f3336] shadow-black/80' 
            : 'bg-white border-gray-200 shadow-xl'
        }`}>
          {/* Simulated Browser Bar */}
          <div className={`px-4 py-3 border-b flex items-center justify-between ${
            isDark ? 'bg-[#12141a] border-[#2f3336]' : 'bg-gray-100 border-gray-200'
          }`}>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className={`px-3 py-1 rounded-md text-[11px] font-mono flex items-center gap-1.5 border ml-2 ${
                isDark ? 'bg-black/50 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600'
              }`}>
                <span className="text-[#1d9bf0]">https://</span>x.com/home · TweetIQ Panel
              </div>
            </div>

            {/* Showcase feature tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setInteractiveTab('writer')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  interactiveTab === 'writer'
                    ? 'bg-[#1d9bf0] text-white shadow-xs'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reach Predictor
              </button>
              <button
                onClick={() => setInteractiveTab('trends')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  interactiveTab === 'trends'
                    ? 'bg-[#1d9bf0] text-white shadow-xs'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trends
              </button>
              <button
                onClick={() => setInteractiveTab('heatmap')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  interactiveTab === 'heatmap'
                    ? 'bg-[#1d9bf0] text-white shadow-xs'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Peak Times
              </button>
              <button
                onClick={() => setInteractiveTab('queue')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  interactiveTab === 'queue'
                    ? 'bg-[#1d9bf0] text-white shadow-xs'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Schedule Queue
              </button>
            </div>
          </div>

          {/* Simulated Browser Body */}
          <div className="p-6 md:p-8 min-h-[380px] flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left description */}
            <div className="flex-1 space-y-4 text-left">
              {interactiveTab === 'writer' && (
                <>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#1d9bf0] bg-[#1d9bf0]/10 px-2.5 py-1 rounded-full border border-[#1d9bf0]/20">
                    Pre-Flight Algorithmic Scoring
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    Predict Reach Before Hitting &apos;Post&apos;
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    TweetIQ parses your hook, formatting, whitespace, and link penalties against the open-source X algorithm in real time. Never post a low-readability flop again.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-gray-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>5.0× Bookmark Bonus signal optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>External link suppression warning (-18 pt penalty avoidance)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>1-click Viral Hook variations (Contrarian, Data, Checklist)</span>
                    </li>
                  </ul>
                </>
              )}

              {interactiveTab === 'trends' && (
                <>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Follower &amp; Engagement Tracker
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    Visual Trendlines Stored in Your Browser
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Log daily follower gains and average tweet scores. See exactly which hooks drive bookmark velocity over 7, 14, or 30 days without connecting expensive external databases.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-gray-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Auto-calculates averages directly from your active feed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>1-click CSV export for sponsor pitch kits &amp; agency reporting</span>
                    </li>
                  </ul>
                </>
              )}

              {interactiveTab === 'heatmap' && (
                <>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    Audience Activity Heatmap
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    Post When Your Followers Are Actually Scrolling
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Analyze peak global engagement clusters. Discover your optimal morning (8:45 AM) and evening (5:15 PM) distribution windows to double bookmark rates.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-gray-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>7×24 day-by-hour activity clustering</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>1-click &apos;Auto-Pick Next Best Time&apos; scheduler integration</span>
                    </li>
                  </ul>
                </>
              )}

              {interactiveTab === 'queue' && (
                <>
                  <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                    Autopilot Queue &amp; Recycler
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black">
                    Batch a Week of Content in 20 Minutes
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Never worry about breaking your daily posting streak. Fill your queue ahead of time and automatically resurface your top 5% evergreen hits.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-gray-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Evergreen Recycler: Auto-spins your proven winners</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Full calendar scheduling with zero third-party API dependencies</span>
                    </li>
                  </ul>
                </>
              )}

              <div className="pt-2">
                <button
                  onClick={onOpenApp}
                  className="px-5 py-2.5 rounded-xl bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  <span>Try It in the Live Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right visual card simulator */}
            <div className={`w-full md:w-[420px] rounded-xl border p-4 shadow-lg text-xs ${
              isDark ? 'bg-[#0f1117] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              {interactiveTab === 'writer' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2 border-gray-200/20">
                    <span className="font-bold flex items-center gap-1.5 text-[#1d9bf0]">
                      <Zap className="w-4 h-4" /> Live Reach Score
                    </span>
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded text-sm">
                      94% (Grade A+)
                    </span>
                  </div>

                  <div className={`p-3 rounded-lg border font-mono text-[11px] leading-relaxed ${
                    isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'
                  }`}>
                    <p className="font-bold text-[#1d9bf0] mb-1">
                      3 counter-intuitive shifts that doubled my X bookmarks:
                    </p>
                    <p className="text-gray-400">
                      1. Never link in the main post (move to reply)<br />
                      2. Anchor with exact numbers ($10k vs &apos;lots&apos;)<br />
                      3. Format with clean line breaks
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <div className="font-bold">+15 Pts</div>
                      <div>5x Bookmark Signal</div>
                    </div>
                    <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20 text-[#1d9bf0]">
                      <div className="font-bold">+9 Pts</div>
                      <div>Numeric Anchor</div>
                    </div>
                    <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      <div className="font-bold">+8 Pts</div>
                      <div>Line Spacing</div>
                    </div>
                  </div>
                </div>
              )}

              {interactiveTab === 'trends' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2 border-gray-200/20">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                      <TrendingUp className="w-4 h-4" /> 14-Day Follower Trend
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      +860 Net Gain
                    </span>
                  </div>

                  <div className="h-28 w-full relative">
                    <svg viewBox="0 0 100 35" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <path
                        d="M 0,30 Q 20,28 35,22 T 60,18 T 80,10 T 100,4"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <circle cx="100" cy="4" r="3" fill="#10b981" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[11px] font-mono text-gray-400 border-t pt-2 border-gray-200/20">
                    <span>Sep 14: 14,120</span>
                    <span className="text-emerald-400 font-bold">Today: 14,980</span>
                  </div>
                </div>
              )}

              {interactiveTab === 'heatmap' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2 border-gray-200/20">
                    <span className="font-bold flex items-center gap-1.5 text-amber-400">
                      <Clock className="w-4 h-4" /> Optimal Windows
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Tuesday · Thursday</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px]">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <div key={i} className="font-bold text-gray-400">{d}</div>
                    ))}
                    {[...Array(28)].map((_, i) => {
                      const heat = (i % 7 === 1 || i % 7 === 3) ? 'bg-[#1d9bf0]' : (i % 3 === 0 ? 'bg-[#1d9bf0]/50' : 'bg-gray-800/40');
                      return (
                        <div key={i} className={`h-4 rounded-xs ${heat}`} />
                      );
                    })}
                  </div>

                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                    ⭐ <strong>Next Peak Window:</strong> Tomorrow at 8:45 AM (Expected 2.8x reach multiplier)
                  </div>
                </div>
              )}

              {interactiveTab === 'queue' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b pb-2 border-gray-200/20">
                    <span className="font-bold flex items-center gap-1.5 text-purple-400">
                      <Calendar className="w-4 h-4" /> Scheduled Content
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">3 Posts Ready</span>
                  </div>

                  <div className="p-2 rounded border border-gray-800 bg-black/40 space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>Mon 8:45 AM</span>
                      <span className="text-[#1d9bf0]">Peak Window</span>
                    </div>
                    <p className="truncate text-gray-300 text-[11px]">
                      &quot;The biggest mistake people make with Twitter hooks...&quot;
                    </p>
                  </div>

                  <div className="p-2 rounded border border-gray-800 bg-black/40 space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                      <span>Tue 5:15 PM</span>
                      <span className="text-purple-400">Evergreen Resurface</span>
                    </div>
                    <p className="truncate text-gray-300 text-[11px]">
                      &quot;How to write 5 tweets in 15 minutes without burnout...&quot;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Section (Features Breakdown like NotesIQ) */}
      <section className="py-20 px-4 max-w-6xl mx-auto border-t border-gray-200/20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-[#1d9bf0] font-bold">
            Built for Serious X Creators
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-4 tracking-tight">
            Everything you need to grow on X in one browser extension
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Stop switching between 5 different websites. TweetIQ runs right inside twitter.com / x.com as an always-available side panel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0c0d10] border-[#2f3336] hover:border-gray-600' : 'bg-white border-gray-200 hover:shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-[#1d9bf0]/15 text-[#1d9bf0] flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Algorithmic Reach Predictor</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Analyzes hook structure, whitespace, character count, and link placement in real-time. Gives you an instant 0–100% reach score before you publish.
            </p>
          </div>

          {/* Card 2 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0c0d10] border-[#2f3336] hover:border-gray-600' : 'bg-white border-gray-200 hover:shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Engagement &amp; Follower Tracker</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Log daily growth, bookmark rates, and posting streaks. Visual SVG trendlines saved in your local storage with 1-click CSV export.
            </p>
          </div>

          {/* Card 3 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0c0d10] border-[#2f3336] hover:border-gray-600' : 'bg-white border-gray-200 hover:shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Peak Audience Timing Matrix</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Discovers the exact hours when your audience is active. Recommends optimal schedule slots to guarantee maximum initial velocity.
            </p>
          </div>

          {/* Card 4 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0c0d10] border-[#2f3336] hover:border-gray-600' : 'bg-white border-gray-200 hover:shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-4">
              <Bookmark className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Swipe File &amp; Inspiration Saver</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Save high-performing posts directly from your feed into a personal swipe file with a 1-click &apos;Use as Template&apos; composer button.
            </p>
          </div>

          {/* Card 5 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0c0d10] border-[#2f3336] hover:border-gray-600' : 'bg-white border-gray-200 hover:shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">Evergreen Post Recycler</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Automatically identify and re-queue your top 5% viral hits so great ideas continue driving new followers months down the line.
            </p>
          </div>

          {/* Card 6 */}
          <div className={`p-6 rounded-2xl border transition-all ${
            isDark ? 'bg-[#0c0d10] border-[#2f3336] hover:border-gray-600' : 'bg-white border-gray-200 hover:shadow-md'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base mb-2">100% Private &amp; On-Device</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              No account, no email, no signup wall — install it, open Twitter, and it just works. No password sharing and zero external tracking. Your drafts and analytics stay strictly on your device.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section (Matching NotesIQ Simple & Honest Pricing) */}
      <section className="py-20 px-4 max-w-5xl mx-auto border-t border-gray-200/20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Simple, Honest Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mt-3 mb-4 tracking-tight">
            Invest in your X distribution once. Own it forever.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            No recurring monthly SaaS fatigue for core tools. Built directly into your browser side panel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Lifetime Card */}
          <div className={`rounded-2xl border p-8 flex flex-col justify-between relative transition-all ${
            license.hasLifetime
              ? 'border-emerald-500/60 bg-emerald-500/5 ring-1 ring-emerald-500/40'
              : isDark
              ? 'bg-[#0c0d10] border-[#2f3336] hover:border-gray-600'
              : 'bg-white border-gray-200 shadow-md'
          }`}>
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#1d9bf0] to-cyan-500 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              MOST POPULAR
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Lifetime Pro License
                </span>
                <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> Pay Once
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-[#1d9bf0]">$29</span>
                <span className="text-gray-400 text-sm font-medium">/ lifetime</span>
              </div>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                Pay once, own forever. Perfect for creators, founders, and ghostwriters who want maximum reach on every post.
              </p>

              <div className="space-y-3 border-t pt-5 text-xs font-medium border-gray-200/20">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time Algorithmic Reach Predictor (0–100%)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Follower &amp; Engagement Trendlines (localStorage)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Audience Best Time to Post Heatmap</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlimited Schedule Queue &amp; Evergreen Recycler</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>1-click CSV analytics &amp; sponsor pitch kit export</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={onOpenPricing}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-[#1d9bf0] hover:bg-[#1a8cd8] active:scale-95 text-white shadow-lg shadow-[#1d9bf0]/25 transition-all flex items-center justify-center gap-2"
              >
                <span>{license.hasLifetime ? '✓ Lifetime Active (Manage)' : 'Get Lifetime Access ($29)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Pro Card */}
          <div className={`rounded-2xl border p-8 flex flex-col justify-between relative transition-all ${
            license.hasAIPro
              ? 'border-purple-500/60 bg-purple-500/5 ring-1 ring-purple-500/40'
              : isDark
              ? 'bg-[#12101a] border-purple-500/30 hover:border-purple-500/50'
              : 'bg-purple-50/40 border-purple-200'
          }`}>
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
              OPTIONAL ADD-ON
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  AI Ghostwriter &amp; Coach
                </span>
                <span className="text-gray-400 text-xs">Covers API inference</span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-black text-purple-400">$9</span>
                <span className="text-gray-400 text-sm font-medium">/ month</span>
              </div>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                Dedicated AI drafting assistant fine-tuned on your top-performing posts and proven viral frameworks.
              </p>

              <div className="space-y-3 border-t pt-5 text-xs font-medium border-gray-200/20">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                  <span><strong>AI Ghostwriter:</strong> 1-click draft in your verified tone</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-purple-400 shrink-0" />
                  <span><strong>AI Post Coach:</strong> Daily data-grounded topic recommendations</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Continuous learning from your highest-reach posts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Cancel anytime with 1 click</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                onClick={onOpenPricing}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 text-white shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>{license.hasAIPro ? '✓ AI Pro Active (Manage)' : 'Subscribe to AI Pro ($9/mo)'}</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Money Back Guarantee Banner */}
        <div className={`mt-8 p-4 rounded-xl border flex items-center justify-center gap-3 text-xs max-w-2xl mx-auto ${
          isDark ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong>100% 7-Day Money-Back Guarantee:</strong> If TweetIQ doesn&apos;t noticeably improve your bookmark rates, get a full refund with no questions asked.
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 border-t text-xs ${
        isDark ? 'border-[#2f3336] bg-[#050608] text-gray-500' : 'border-gray-200 bg-white text-gray-600'
      }`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#1d9bf0] flex items-center justify-center text-white font-black text-xs">
              𝕏
            </div>
            <span className="font-bold text-gray-300">TweetIQ</span>
            <span>— The Analytics &amp; Scheduler Suite for X</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenApp} className="hover:text-white transition-colors">
              Live Simulator
            </button>
            <button onClick={onOpenPricing} className="hover:text-white transition-colors">
              Pricing
            </button>
            <button onClick={onOpenExportModal} className="hover:text-white transition-colors">
              Download Extension
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
