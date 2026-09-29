import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Share2, 
  Sparkles, 
  Layers, 
  Check, 
  Info, 
  ThumbsUp, 
  MessageSquare, 
  Eye, 
  Clock, 
  Zap, 
  Sliders, 
  ChevronRight, 
  ChevronLeft, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Search,
  Grid,
  Laptop
} from 'lucide-react';
import { Tweet, AlgorithmWeights, ThemeMode } from '../types';
import { downloadChromeExtensionZip } from '../utils/analytics';

interface ChromeWebStoreViewProps {
  onOpenLiveFeed: () => void;
  onOpenExportModal: () => void;
  weights: AlgorithmWeights;
  onSelectTweetForDiagnostic: (tweet: Tweet) => void;
  theme: ThemeMode;
}

export const ChromeWebStoreView: React.FC<ChromeWebStoreViewProps> = ({
  onOpenLiveFeed,
  onOpenExportModal,
  weights,
  onSelectTweetForDiagnostic,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'overview' | 'interactive' | 'reviews' | 'privacy'>('overview');
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);
  const [isAddedToChrome, setIsAddedToChrome] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const screenshots = [
    {
      title: 'In-Feed Viral Score & Hook Grade Overlay',
      subtitle: 'Automatically calculates and injects viral scores (0-100) and hook grades right under tweets on X/Twitter',
      badge: 'Feed Script',
    },
    {
      title: 'Deep Algorithmic Diagnostic & Signal Breakdown',
      subtitle: 'Inspect bookmark 5x multiplier, repost velocity, link suppression penalty, and concrete growth recommendations',
      badge: 'Inspector',
    },
    {
      title: 'Real-Time Hook Composer & Predictor',
      subtitle: 'Predict reach before you post. Detects vertical whitespace, character thresholds, and numeric anchors',
      badge: 'Studio',
    },
    {
      title: 'AI Hook Laboratory (5 Algorithmic Rewrites)',
      subtitle: 'Generate Contrarian, Data & Numbers, Bookmark Goldmine, and Story variations with one click',
      badge: 'AI Rewriter',
    },
    {
      title: '7-Day × 24-Hour Golden Posting Heatmap',
      subtitle: 'Discover the highest engagement windows for tech, SaaS, and creator audiences',
      badge: 'Timing Matrix',
    },
  ];

  const handleInstallClick = () => {
    if (isAddedToChrome) {
      onOpenLiveFeed();
    } else {
      setShowInstallPrompt(true);
    }
  };

  const handleConfirmInstall = async () => {
    setShowInstallPrompt(false);
    setDownloading(true);
    try {
      await downloadChromeExtensionZip();
      setIsAddedToChrome(true);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const [userReviews, setUserReviews] = useState<Array<{ id: string; author: string; role: string; rating: number; date: string; content: string; likes: number }>>(() => {
    try {
      const saved = localStorage.getItem('tweetiq_user_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewContent.trim()) return;

    const newRev = {
      id: Date.now().toString(),
      author: newReviewAuthor.trim(),
      role: newReviewRole.trim() || 'X Creator',
      rating: newReviewRating,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      content: newReviewContent.trim(),
      likes: 0,
    };

    const updated = [newRev, ...userReviews];
    setUserReviews(updated);
    try {
      localStorage.setItem('tweetiq_user_reviews', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setNewReviewAuthor('');
    setNewReviewRole('');
    setNewReviewContent('');
    setShowReviewForm(false);
    setReviewSubmittedMsg('✓ Thank you for your feedback! Your review is recorded.');
    setTimeout(() => setReviewSubmittedMsg(''), 4000);
  };

  return (
    <div className={`min-h-[calc(100vh-53px)] font-sans antialiased transition-colors ${
      isDark ? 'bg-[#202124] text-[#e8eaed]' : 'bg-[#f8f9fa] text-[#202124]'
    }`}>
      {/* ========================================================
          MAIN STORE LISTING CONTAINER
         ======================================================== */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className={`text-xs flex items-center gap-2 ${isDark ? 'text-[#9aa0a6]' : 'text-gray-500'}`}>
          <span className="hover:underline cursor-pointer">Home</span>
          <span>&gt;</span>
          <span className="hover:underline cursor-pointer">Extensions</span>
          <span>&gt;</span>
          <span className="hover:underline cursor-pointer">Social &amp; Communication</span>
          <span>&gt;</span>
          <span className={`font-medium ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
            TweetIQ - Twitter &amp; X Analytics
          </span>
        </nav>

        {/* ========================================================
            HERO PRODUCT HEADER CARD
           ======================================================== */}
        <div className={`rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start justify-between gap-6 transition-colors border ${
          isDark 
            ? 'bg-[#28292c] border-[#3c4043] shadow-xl' 
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-start gap-5">
            {/* App Icon */}
            <div className="w-18 h-18 md:w-22 md:h-22 rounded-2xl bg-gradient-to-br from-[#1d9bf0] to-[#0c7abf] flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-md shrink-0 border border-white/20">
              𝕏
            </div>

            {/* Title & Author Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className={`text-xl md:text-2xl font-black tracking-tight ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
                  TweetIQ - Twitter / X Analytics, Scheduling &amp; AI Studio
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#1d9bf0]/15 text-[#1d9bf0] text-[11px] font-bold flex items-center gap-1 border border-[#1d9bf0]/30">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              </div>

              <div className={`flex items-center gap-2 text-xs flex-wrap ${isDark ? 'text-[#9aa0a6]' : 'text-gray-600'}`}>
                <span className="text-[#1d9bf0] hover:underline cursor-pointer font-semibold">
                  tweetiq.io
                </span>
                <span className="flex items-center gap-1 text-[#34a853] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Developer
                </span>
                <span aria-hidden="true">·</span>
                <span>Analytics, scheduling, and AI drafting for tweets - right in your browser</span>
              </div>

              {/* Honest Badges Row */}
              <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/15 text-[#1d9bf0] font-bold font-mono text-[11px] border border-blue-500/30">
                  Manifest V3
                </span>
                <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-400'}>|</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Client-Side Privacy
                </span>
                <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-400'}>|</span>
                <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-600'}>Works on x.com &amp; twitter.com</span>
                <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-400'}>|</span>
                <span className="text-[#1d9bf0] font-bold">$29 Lifetime · $9/mo AI Pro</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={handleInstallClick}
              disabled={downloading}
              className={`px-6 py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                isAddedToChrome
                  ? 'bg-[#34a853] text-white hover:bg-[#2d9249]'
                  : isDark
                  ? 'bg-[#8ab4f8] text-[#202124] hover:bg-[#a8c7fa]'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isAddedToChrome ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Chrome (Launch Feed)</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{downloading ? 'Adding to Chrome...' : 'Add to Chrome'}</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenLiveFeed}
              className={`px-6 py-2 rounded-full font-semibold text-xs border flex items-center justify-center gap-1.5 transition-colors ${
                isDark
                  ? 'border-[#3c4043] bg-[#303134] hover:bg-[#3c4043] text-[#e8eaed]'
                  : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#1d9bf0]" />
              <span>Interactive Live Demo</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            SCREENSHOT CAROUSEL & VISUAL SHOWCASE
           ======================================================== */}
        <div className={`rounded-2xl p-6 space-y-4 transition-colors border ${
          isDark 
            ? 'bg-[#28292c] border-[#3c4043] shadow-lg' 
            : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-bold text-sm ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
                  {screenshots[selectedScreenshotIndex].title}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1d9bf0]/15 text-[#1d9bf0] font-bold">
                  {screenshots[selectedScreenshotIndex].badge}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-[#9aa0a6]' : 'text-gray-600'}`}>
                {screenshots[selectedScreenshotIndex].subtitle}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() =>
                  setSelectedScreenshotIndex(
                    (prev) => (prev - 1 + screenshots.length) % screenshots.length
                  )
                }
                className={`p-1.5 rounded-full transition-colors ${
                  isDark 
                    ? 'bg-[#303134] hover:bg-[#3c4043] text-[#e8eaed]' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
                title="Previous screenshot"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setSelectedScreenshotIndex((prev) => (prev + 1) % screenshots.length)
                }
                className={`p-1.5 rounded-full transition-colors ${
                  isDark 
                    ? 'bg-[#303134] hover:bg-[#3c4043] text-[#e8eaed]' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
                title="Next screenshot"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Screen Viewer Mockup */}
          <div className={`rounded-xl overflow-hidden p-6 relative min-h-[380px] flex flex-col justify-center border ${
            isDark ? 'bg-[#000000] border-[#3c4043]' : 'bg-gray-50 border-gray-200'
          }`}>
            {/* Screen 0: In-Feed Badge Preview */}
            {selectedScreenshotIndex === 0 && (
              <div className={`max-w-xl mx-auto w-full rounded-xl p-4 space-y-3 border shadow-sm ${
                isDark ? 'bg-[#000000] border-[#2f3336]' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                      className="w-9 h-9 rounded-full object-cover"
                      alt="Alex"
                    />
                    <div>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Alex Rivera</span>
                      <span className={`text-xs ml-1 ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>@alexrivera_io · 2h</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#1d9bf0] font-mono">X Timeline</span>
                </div>
                <p className={`text-xs font-mono leading-relaxed ${isDark ? 'text-[#eff3f4]' : 'text-gray-800'}`}>
                  I analyzed 1,420 top performers on X.<br />
                  Only 3 habits separated the top 1% from everyone else:<br /><br />
                  1. Concrete numbers in line 1<br />
                  2. 5x bookmark multiplier targeting<br />
                  3. Zero outbound links in root post
                </p>
                {/* Injected extension badge simulation */}
                <div className={`pt-2 flex items-center justify-between p-2.5 rounded-lg border ${
                  isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-blue-50/50 border-blue-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#1d9bf0]">⚡ TweetIQ Extension</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold rounded text-xs">
                      96 IQ (A+)
                    </span>
                    <span className={`text-[11px] ${isDark ? 'text-[#71767b]' : 'text-gray-600'}`}>Bookmarks: 3,290 (5.0x Weight)</span>
                  </div>
                  <button
                    onClick={onOpenLiveFeed}
                    className="px-2.5 py-1 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white text-xs font-semibold rounded"
                  >
                    ⚡ Inspect Signals
                  </button>
                </div>
              </div>
            )}

            {/* Screen 1: Diagnostic Preview */}
            {selectedScreenshotIndex === 1 && (
              <div className={`max-w-lg mx-auto w-full rounded-xl p-5 space-y-3.5 border shadow-sm ${
                isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black text-xl flex items-center justify-center font-mono">
                      96
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Explosive Viral Tier (Grade A+)</h4>
                      <p className={`text-[11px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>Estimated reach: 140,000+ views</p>
                    </div>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">+68 Bonus Pts</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2.5 rounded border ${isDark ? 'bg-[#000000] border-[#2f3336]' : 'bg-gray-50 border-gray-200'}`}>
                    <span className={`block text-[10px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>Bookmark Multiplier (5.0x)</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+16,450 weighted saves</strong>
                  </div>
                  <div className={`p-2.5 rounded border ${isDark ? 'bg-[#000000] border-[#2f3336]' : 'bg-gray-50 border-gray-200'}`}>
                    <span className={`block text-[10px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>Link Suppression Check</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">Passed (0 penalty)</strong>
                  </div>
                </div>
                <p className={`text-xs p-2 rounded border-l-2 border-[#1d9bf0] ${
                  isDark ? 'bg-[#1d9bf0]/10 text-[#eff3f4]' : 'bg-blue-50 text-gray-800'
                }`}>
                  <strong>Recommendation:</strong> High curiosity loop with clean vertical whitespace.
                </p>
              </div>
            )}

            {/* Screen 2: Pre-Post Composer */}
            {selectedScreenshotIndex === 2 && (
              <div className={`max-w-lg mx-auto w-full rounded-xl p-5 space-y-3 border shadow-sm ${
                isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Pre-Post Viral Score Predictor</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Predicting 94/100</span>
                </div>
                <textarea
                  readOnly
                  rows={4}
                  value={`95% of founders build products nobody asked for.\n\nHere is the 4-step discovery framework I used to validate a $20k/mo tool before writing 1 line of code:`}
                  className={`w-full rounded-lg p-2.5 text-xs font-mono resize-none focus:outline-none border ${
                    isDark ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
                <div className={`flex items-center justify-between text-xs ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>
                  <span>142/280 characters · 2 linebreaks</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Numeric proof point detected</span>
                </div>
              </div>
            )}

            {/* Screen 3: Hook Remix Preview */}
            {selectedScreenshotIndex === 3 && (
              <div className="max-w-lg mx-auto w-full space-y-2.5">
                <div className={`p-3 rounded-lg flex items-center justify-between text-xs border ${
                  isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-white border-gray-200 shadow-xs'
                }`}>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>1. The Contrarian Angle</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">95 IQ Projected</span>
                </div>
                <div className={`p-3 rounded-lg flex items-center justify-between text-xs border ${
                  isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-white border-gray-200 shadow-xs'
                }`}>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>2. The Bookmark Goldmine Checklist</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">98 IQ Projected</span>
                </div>
                <div className={`p-3 rounded-lg flex items-center justify-between text-xs border ${
                  isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-white border-gray-200 shadow-xs'
                }`}>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>3. The Zero-to-One Transformation Story</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">92 IQ Projected</span>
                </div>
              </div>
            )}

            {/* Screen 4: Timing Heatmap */}
            {selectedScreenshotIndex === 4 && (
              <div className={`max-w-lg mx-auto w-full rounded-xl p-5 space-y-3 border shadow-sm ${
                isDark ? 'bg-[#16181c] border-[#2f3336]' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Golden Engagement Windows (Tech &amp; Founders)</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tue, Wed, Thu Peak</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 text-center text-[10px]">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                    <div key={d} className={`p-2 rounded border ${isDark ? 'bg-[#000000] border-[#2f3336]' : 'bg-gray-50 border-gray-200'}`}>
                      <span className={`block font-bold ${isDark ? 'text-[#e8eaed]' : 'text-gray-800'}`}>{d}</span>
                      <span className={`text-[9px] font-mono ${i >= 1 && i <= 3 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : isDark ? 'text-[#71767b]' : 'text-gray-400'}`}>
                        {i >= 1 && i <= 3 ? '96 IQ' : '65 IQ'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className={`text-[11px] ${isDark ? 'text-[#9aa0a6]' : 'text-gray-600'}`}>
                  Peak bookmark velocity detected Tuesdays 8:00 AM - 10:00 AM and Wednesdays 4:00 PM EST.
                </p>
              </div>
            )}
          </div>

          {/* Screenshot thumbnails selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {screenshots.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedScreenshotIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedScreenshotIndex === idx
                    ? isDark
                      ? 'bg-[#8ab4f8] text-[#202124]'
                      : 'bg-blue-600 text-white shadow-xs'
                    : isDark
                    ? 'bg-[#303134] text-[#9aa0a6] hover:text-[#e8eaed]'
                    : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                {s.badge}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================
            NAVIGATION TABS (OVERVIEW, INTERACTIVE, REVIEWS, PRIVACY)
           ======================================================== */}
        <div className={`border-b flex items-center gap-6 text-sm font-medium ${
          isDark ? 'border-[#3c4043]' : 'border-gray-200'
        }`}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-[#1d9bf0] text-[#1d9bf0] font-bold'
                : isDark ? 'border-transparent text-[#9aa0a6] hover:text-[#e8eaed]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              setActiveTab('interactive');
              onOpenLiveFeed();
            }}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'interactive'
                ? 'border-[#1d9bf0] text-[#1d9bf0] font-bold'
                : isDark ? 'border-transparent text-[#9aa0a6] hover:text-[#e8eaed]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-[#1d9bf0] text-[#1d9bf0] font-bold'
                : isDark ? 'border-transparent text-[#9aa0a6] hover:text-[#e8eaed]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>Reviews &amp; Feedback {userReviews.length > 0 ? `(${userReviews.length})` : ''}</span>
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-[#1d9bf0] text-[#1d9bf0] font-bold'
                : isDark ? 'border-transparent text-[#9aa0a6] hover:text-[#e8eaed]' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Privacy practices
          </button>
        </div>

        {/* ========================================================
            TAB CONTENT: OVERVIEW
           ======================================================== */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Description & Features */}
            <div className={`lg:col-span-2 space-y-6 text-xs leading-relaxed ${
              isDark ? 'text-[#bdc1c6]' : 'text-gray-600'
            }`}>
              <div>
                <h3 className={`text-base font-extrabold mb-2 ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
                  Analytics, scheduling, and AI drafting for tweets - right in your browser, no account required.
                </h3>
                <p className="text-sm leading-relaxed mb-2 font-medium">
                  <strong>TweetIQ</strong> is an analytics and scheduling tool for tweets, built entirely into your browser's side panel. <strong>No account, no sign-up, no data leaves your device</strong> except when you explicitly use an AI feature.
                </p>
              </div>

              {/* Feature Sections */}
              <div className="space-y-4">
                {/* 1. Track your own Tweets */}
                <div className={`rounded-xl p-4 border space-y-2 ${
                  isDark ? 'bg-[#28292c] border-[#3c4043]' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
                    <span className="w-5 h-5 rounded bg-[#1d9bf0]/15 text-[#1d9bf0] flex items-center justify-center text-xs">📊</span>
                    Track your own Tweets
                  </h4>
                  <ul className="space-y-1.5 pl-2 list-disc list-inside">
                    <li><strong>Metrics &amp; Streak:</strong> Tweets tracked, active day streak, total likes/retweets/replies/bookmarks, and your top-performing tweets.</li>
                    <li><strong>Content Type Breakdown:</strong> See which kind of tweet (Personal Story, Question &amp; Poll, List &amp; Framework, Quote &amp; Repost, Data &amp; Observation) drives the highest bookmark velocity and engagement.</li>
                    <li><strong>Best Time Heatmap:</strong> A 7-day × 6-time-slot map of when your tweets do best.</li>
                    <li><strong>Trend Analytics:</strong> Weekly volume and daily engagement charts, with an <strong>All-Time view</strong> going back to your very first tracked tweet (X's own dashboard limits reach to 28-90 days; TweetIQ stores indefinitely on-device).</li>
                    <li><strong>Viral Alert:</strong> A banner the moment a tweet is doing meaningfully better than your own average (e.g. 2.5x normal baseline).</li>
                    <li><strong>Evergreen Recycler:</strong> Surfaces old tweets (60+ days) that crushed it, with 1 click to reuse or remix them for your new audience.</li>
                    <li><strong>Follower Growth:</strong> Auto-detects your follower count from your public profile and tracks trajectory over time.</li>
                  </ul>
                </div>

                {/* 2. Community Feed */}
                <div className={`rounded-xl p-4 border space-y-2 ${
                  isDark ? 'bg-[#28292c] border-[#3c4043]' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
                    <span className="w-5 h-5 rounded bg-purple-500/15 text-purple-400 flex items-center justify-center text-xs">🌐</span>
                    Community Feed
                  </h4>
                  <p>Aggregate analytics across every tweet you've scrolled past on X, not just your own: average length, media ratio, top hook types in your niche, and retention benchmarks vs your profile.</p>
                </div>

                {/* 3. Compose and schedule */}
                <div className={`rounded-xl p-4 border space-y-2 ${
                  isDark ? 'bg-[#28292c] border-[#3c4043]' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
                    <span className="w-5 h-5 rounded bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs">📅</span>
                    Compose and Schedule
                  </h4>
                  <ul className="space-y-1.5 pl-2 list-disc list-inside">
                    <li>Post or schedule a single tweet through X's own native composer and scheduler flow.</li>
                    <li><strong>Queue Tab:</strong> Load up a whole week's worth of tweets at once, with one-click best-time autofill based on your audience heatmap.</li>
                  </ul>
                </div>

                {/* 4. Competitor Research & Top Fans */}
                <div className={`rounded-xl p-4 border space-y-2 ${
                  isDark ? 'bg-[#28292c] border-[#3c4043]' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
                    <span className="w-5 h-5 rounded bg-amber-500/15 text-amber-400 flex items-center justify-center text-xs">🔍</span>
                    Competitor Research &amp; Top Fans
                  </h4>
                  <ul className="space-y-1.5 pl-2 list-disc list-inside">
                    <li><strong>Competitor Research:</strong> Look up any public X handle (e.g. @levelsio, @paulg, @shl) to see their content mix, posting patterns, and best times.</li>
                    <li><strong>Top Fans:</strong> A leaderboard of who retweets, quotes, and replies to your tweets the most.</li>
                    <li><strong>Bookmarks:</strong> Save any tweet (yours, a competitor's, from your feed) into organized folders for later reuse.</li>
                  </ul>
                </div>

                {/* 5. Prompt Templates & AI Coach */}
                <div className={`rounded-xl p-4 border space-y-2 ${
                  isDark ? 'bg-[#28292c] border-[#3c4043]' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
                    <span className="w-5 h-5 rounded bg-pink-500/15 text-pink-400 flex items-center justify-center text-xs">✨</span>
                    Prompt Templates &amp; AI Coach
                  </h4>
                  <ul className="space-y-1.5 pl-2 list-disc list-inside">
                    <li><strong>8 Prompt Templates:</strong> Copy-paste prompts engineered for ChatGPT or Claude, pre-filled with your own top tweets.</li>
                    <li><strong>AI Ghostwriter (AI Pro):</strong> Drafts a new tweet in your authentic voice, modeled strictly on your best-performing tweets.</li>
                    <li><strong>AI Post Coach (AI Pro):</strong> One concrete, data-grounded suggestion for what to write next.</li>
                  </ul>
                </div>

                {/* 6. Backup and Export */}
                <div className={`rounded-xl p-4 border space-y-2 ${
                  isDark ? 'bg-[#28292c] border-[#3c4043]' : 'bg-white border-gray-200'
                }`}>
                  <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
                    <span className="w-5 h-5 rounded bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-xs">💾</span>
                    Backup and Export
                  </h4>
                  <p>Full backup/restore as a JSON file, spreadsheet CSV export, and a high-impact <strong>Sponsor Media Kit PDF/Card</strong> for brand pitch decks.</p>
                </div>
              </div>

              {/* Pricing Section on Web Store Page */}
              <div className={`rounded-xl p-5 border space-y-3 ${
                isDark ? 'bg-gradient-to-r from-[#171b26] to-[#12141c] border-[#1d9bf0]/30' : 'bg-blue-50/50 border-blue-200'
              }`}>
                <h4 className={`text-sm font-extrabold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <span>Transparent Pricing (No Subscription Lock-In)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    7-Day Money-Back Guarantee
                  </span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <div className="font-bold text-[#1d9bf0] text-sm mb-0.5">$29 Lifetime Payment</div>
                    <p className="text-gray-400 text-[11px]">
                      Unlocks everything in the extension forever: analytics, 7-day queue, heatmap, competitor research, top fans, bookmarks, 8 prompts, and media kit.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <div className="font-bold text-purple-400 text-sm mb-0.5">$9/month AI Pro Add-on</div>
                    <p className="text-gray-400 text-[11px]">
                      Required only for AI Coach (Ghostwriter + AI Post Coach), since AI drafting incurs real per-generation cloud GPU cost.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Technical Specs & Store Metadata */}
            <div className="space-y-6">
              <div className={`rounded-xl p-5 space-y-3.5 text-xs border ${
                isDark ? 'bg-[#28292c] border-[#3c4043]' : 'bg-white border-gray-200 shadow-xs'
              }`}>
                <h4 className={`text-sm font-bold ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>Additional Information</h4>

                <div className="space-y-2.5">
                  <div className={`flex justify-between py-1 border-b ${isDark ? 'border-[#3c4043]' : 'border-gray-100'}`}>
                    <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-500'}>Version</span>
                    <span className={`font-mono ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>1.0.4</span>
                  </div>
                  <div className={`flex justify-between py-1 border-b ${isDark ? 'border-[#3c4043]' : 'border-gray-100'}`}>
                    <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-500'}>Updated</span>
                    <span className={isDark ? 'text-[#e8eaed]' : 'text-gray-900'}>September 2026</span>
                  </div>
                  <div className={`flex justify-between py-1 border-b ${isDark ? 'border-[#3c4043]' : 'border-gray-100'}`}>
                    <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-500'}>Size</span>
                    <span className={`font-mono ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>384 KiB</span>
                  </div>
                  <div className={`flex justify-between py-1 border-b ${isDark ? 'border-[#3c4043]' : 'border-gray-100'}`}>
                    <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-500'}>Language</span>
                    <span className={isDark ? 'text-[#e8eaed]' : 'text-gray-900'}>English</span>
                  </div>
                  <div className={`flex justify-between py-1 border-b ${isDark ? 'border-[#3c4043]' : 'border-gray-100'}`}>
                    <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-500'}>Developer</span>
                    <span className="text-[#1d9bf0] font-semibold">TweetIQ Labs</span>
                  </div>
                  <div className={`flex justify-between py-1 border-b ${isDark ? 'border-[#3c4043]' : 'border-gray-100'}`}>
                    <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-500'}>Manifest</span>
                    <span className={`font-mono ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>Manifest V3</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-500'}>Target Domains</span>
                    <span className={`font-mono ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>x.com, twitter.com</span>
                  </div>
                </div>
              </div>

              {/* Calibrated Weights widget */}
              <div className={`rounded-xl p-5 space-y-2 text-xs border ${
                isDark ? 'bg-[#28292c] border-[#3c4043]' : 'bg-white border-gray-200 shadow-xs'
              }`}>
                <h4 className={`text-sm font-bold flex items-center justify-between ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
                  <span>Current X Algorithm Signals</span>
                  <span className="text-[10px] text-[#34a853] font-mono">Live Sync</span>
                </h4>
                <div className={`space-y-1.5 text-[11px] ${isDark ? 'text-[#9aa0a6]' : 'text-gray-600'}`}>
                  <div className="flex justify-between">
                    <span>Bookmark Multiplier:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{weights.bookmarkWeight}x</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Repost Weight:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{weights.retweetWeight}x</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Outbound Link Penalty:</span>
                    <strong className="text-red-500 font-mono">-{weights.linkSuppressionPenalty} pts</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB CONTENT: REVIEWS & COMMUNITY FEEDBACK
           ======================================================== */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Launch Banner & Feedback Call */}
            <div className={`rounded-xl p-6 border ${
              isDark ? 'bg-[#28292c] border-[#3c4043]' : 'bg-white border-gray-200 shadow-xs'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-500/15 text-[#1d9bf0] border border-blue-500/30">
                      NEW LAUNCH v1.0.4
                    </span>
                    <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Community Feedback &amp; Reviews
                    </h4>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-[#9aa0a6]' : 'text-gray-600'}`}>
                    TweetIQ is newly released for X / Twitter creators. We don&apos;t use fake ratings. Share your honest experience or feature request below!
                  </p>
                </div>

                <button
                  onClick={() => setShowReviewForm((prev) => !prev)}
                  className="px-4 py-2 rounded-xl bg-[#1d9bf0] hover:bg-[#1a8cd8] active:scale-95 text-white font-bold text-xs transition-all shadow-xs shrink-0"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review / Feedback'}
                </button>
              </div>

              {reviewSubmittedMsg && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  {reviewSubmittedMsg}
                </div>
              )}

              {/* Review Submission Form */}
              {showReviewForm && (
                <form onSubmit={handleAddReview} className={`mt-5 pt-4 border-t space-y-3 ${
                  isDark ? 'border-[#3c4043]' : 'border-gray-100'
                }`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">Your Name / Handle</label>
                      <input
                        type="text"
                        placeholder="@username or Your Name"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        required
                        className={`w-full p-2.5 rounded-lg border text-xs ${
                          isDark ? 'bg-black border-[#3c4043] text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">Role / Bio (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Creator, Founder, Ghostwriter"
                        value={newReviewRole}
                        onChange={(e) => setNewReviewRole(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-xs ${
                          isDark ? 'bg-black border-[#3c4043] text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              star <= newReviewRating
                                ? 'fill-[#fbbc05] text-[#fbbc05]'
                                : 'text-gray-500'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold ml-2 text-gray-400">{newReviewRating} / 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">Your Honest Review or Suggestion</label>
                    <textarea
                      rows={3}
                      placeholder="What do you think of the reach predictor, timing heatmap, or extension panel? What should we add next?"
                      value={newReviewContent}
                      onChange={(e) => setNewReviewContent(e.target.value)}
                      required
                      className={`w-full p-2.5 rounded-lg border text-xs resize-none ${
                        isDark ? 'bg-black border-[#3c4043] text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-xs transition-colors"
                    >
                      Post Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-2 rounded-xl border border-gray-600 text-gray-400 text-xs hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Reviews List */}
            {userReviews.length === 0 ? (
              <div className={`rounded-xl p-8 text-center border space-y-2 ${
                isDark ? 'bg-[#28292c] border-[#3c4043]' : 'bg-white border-gray-200'
              }`}>
                <div className="w-10 h-10 rounded-full bg-[#1d9bf0]/15 text-[#1d9bf0] flex items-center justify-center mx-auto mb-2">
                  <Star className="w-5 h-5" />
                </div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  No Reviews Yet (Fresh Launch)
                </h4>
                <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-[#9aa0a6]' : 'text-gray-500'}`}>
                  TweetIQ is brand new. Be the very first creator to test the extension and leave your honest review!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-xs transition-all shadow-xs"
                  >
                    Be the First to Review
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {userReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`rounded-xl p-4 space-y-2 text-xs border ${
                      isDark ? 'bg-[#28292c] border-[#3c4043]' : 'bg-white border-gray-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>{rev.author}</span>
                        <span className={isDark ? 'text-[#9aa0a6]' : 'text-gray-500'}>({rev.role})</span>
                      </div>
                      <span className={`text-[11px] ${isDark ? 'text-[#9aa0a6]' : 'text-gray-400'}`}>{rev.date}</span>
                    </div>

                    <div className="flex text-[#fbbc05]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#fbbc05]" />
                      ))}
                    </div>

                    <p className={`leading-relaxed pt-1 ${isDark ? 'text-[#bdc1c6]' : 'text-gray-700'}`}>{rev.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB CONTENT: PRIVACY PRACTICES
           ======================================================== */}
        {activeTab === 'privacy' && (
          <div className={`rounded-xl p-6 space-y-4 text-xs leading-relaxed border ${
            isDark ? 'bg-[#28292c] border-[#3c4043] text-[#bdc1c6]' : 'bg-white border-gray-200 text-gray-700 shadow-xs'
          }`}>
            <h3 className={`text-sm font-bold ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>Privacy &amp; Data Handling</h3>
            <p>
              TweetIQ operates locally in your browser context. It processes DOM tweet metrics client-side and does not sell user data to third parties.
            </p>
            <div className={`p-4 rounded-lg border space-y-2 ${
              isDark ? 'bg-[#303134] border-[#3c4043]' : 'bg-gray-50 border-gray-200'
            }`}>
              <span className={`font-bold block ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>Permissions Declared:</span>
              <ul className="list-disc pl-4 space-y-1">
                <li><code className="text-[#1d9bf0] font-semibold">activeTab</code>: Reads DOM metric tags on active Twitter / X tabs to compute live viral scores.</li>
                <li><code className="text-[#1d9bf0] font-semibold">storage</code>: Stores your customized algorithm weights and saved swipe posts locally.</li>
                <li><code className="text-[#1d9bf0] font-semibold">sidePanel</code>: Provides Chrome Side Panel workflow next to your timeline.</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          AUTHENTIC CHROME EXTENSION INSTALLATION DIALOG MODAL
         ======================================================== */}
      {showInstallPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className={`rounded-2xl w-full max-w-md shadow-2xl p-6 text-xs space-y-4 border ${
            isDark 
              ? 'bg-[#28292c] border-[#3c4043] text-[#e8eaed]' 
              : 'bg-white border-gray-200 text-gray-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#1d9bf0] flex items-center justify-center text-white text-2xl font-black shrink-0">
                𝕏
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-[#e8eaed]' : 'text-gray-900'}`}>
                  Add "TweetIQ - Twitter &amp; X Analytics"?
                </h3>
                <p className={`text-[11px] ${isDark ? 'text-[#9aa0a6]' : 'text-gray-500'}`}>It will be able to:</p>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border space-y-2 text-[11px] ${
              isDark ? 'bg-[#202124] border-[#3c4043] text-[#bdc1c6]' : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}>
              <div className="flex items-start gap-2">
                <span className="text-[#1d9bf0] font-bold">•</span>
                <span>Read and inject viral score badges on <strong>twitter.com</strong> and <strong>x.com</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#1d9bf0] font-bold">•</span>
                <span>Save viral swipe formulas to your local extension storage</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#1d9bf0] font-bold">•</span>
                <span>Display pre-post viral predictor in Chrome Side Panel</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowInstallPrompt(false)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  isDark ? 'bg-[#303134] hover:bg-[#3c4043] text-[#e8eaed]' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmInstall}
                className="px-5 py-2 rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold transition-all shadow-md active:scale-95"
              >
                Add extension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
