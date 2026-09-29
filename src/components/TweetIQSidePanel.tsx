import React, { useState } from 'react';
import { 
  Tweet, 
  AlgorithmWeights, 
  ThemeMode, 
  ScheduledTweet, 
  LicenseState 
} from '../types';
import { 
  Zap, 
  Bookmark, 
  Copy, 
  Check, 
  Flame, 
  Calendar, 
  RefreshCw, 
  Send, 
  Trash2, 
  BarChart3, 
  Clock,
  Sparkles,
  Download,
  TrendingUp,
  Briefcase,
  BookOpen
} from 'lucide-react';
import { calculateLiveTweetScore, exportTweetsAsCsv, detectTweetIntent } from '../utils/analytics';
import { INITIAL_SCHEDULED_QUEUE, EVERGREEN_TWEETS_RECYCLER } from '../data/tweetiqData';

interface TweetIQSidePanelProps {
  weights: AlgorithmWeights;
  onUpdateWeights: (newWeights: AlgorithmWeights) => void;
  savedTweets: Tweet[];
  onPublishFromStudio: (text: string) => void;
  onOpenExportModal: () => void;
  onOpenRemixForText: (text: string) => void;
  activeSideTab: string;
  setActiveSideTab: (tab: any) => void;
  theme: ThemeMode;
  license: LicenseState;
  onOpenPricing: () => void;
  onOpenMediaKit: () => void;
  onOpenTracker?: () => void;
  allFeedTweets: Tweet[];
}

export const TweetIQSidePanel: React.FC<TweetIQSidePanelProps> = ({
  weights,
  savedTweets,
  onPublishFromStudio,
  onOpenRemixForText,
  activeSideTab,
  setActiveSideTab,
  theme,
  license,
  onOpenPricing,
  onOpenMediaKit,
  onOpenTracker,
  allFeedTweets,
}) => {
  const isDark = theme === 'dark';

  // 3 essential tabs only
  const getTab = (tab: string) => {
    if (tab === 'stats' || tab === 'analytics' || tab === 'track') return 'stats';
    if (tab === 'saved' || tab === 'inspiration' || tab === 'bookmarks') return 'saved';
    return 'write';
  };

  const currentTab = getTab(activeSideTab);

  // Writer state
  const [draftText, setDraftText] = useState(
    `I analyzed 1,420 top creators on X.\n\nOnly 3 writing habits separated the top 1% from everyone else:\n\n1. Concrete numbers in line 1\n2. 2-line spacing that is easy to read on mobile\n3. Never putting links in the first post`
  );
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  // Quick starters
  const quickTemplates = [
    {
      title: '💼 Hiring',
      text: `🚨 We are HIRING a Senior Full-Stack Engineer ($160k - $210k + 1.5% equity).\n\nStack: TypeScript, Next.js, PostgreSQL, Redis.\n\n• 100% remote anywhere\n• Async-first culture (no standup fatigue)\n• Real ownership of customer AI agents\n\nIf you love shipping fast and crafting clean UI, DM your GitHub or past projects! ⚡`,
    },
    {
      title: '📚 Education',
      text: `How PostgreSQL indexing actually works under the hood (and why 80% of queries run slow):\n\n1. B-Tree: Default. Great for equality (=) & range (<, >)\n2. GIN Index: Essential for JSONB & array tag searches (50x speedup)\n3. Partial Index: "WHERE active = true" saves 90% cache\n4. Composite order: (tenant_id, created_at) leftmost prefix rule\n\nSave this cheatsheet for your next architecture review 🧵`,
    },
    {
      title: 'Story',
      text: `2 years ago: $0 and 0 followers.\n\nToday:\n• 24,000 community members\n• A profitable solo business\n\nHere are 3 small habits that made all the difference:`,
    },
    {
      title: 'Opinion',
      text: `Unpopular truth:\n\nPosting 5 times a day is actually hurting your growth.\n\nThe algorithm rewards posts people bookmark and save, not spam.\n\nHere is what to do instead:`,
    },
    {
      title: 'List',
      text: `Save this for later 📌\n\n5 free tools that save me 10+ hours of writing every week:\n\n1. `,
    },
  ];

  const [savedFilter, setSavedFilter] = useState<'all' | 'hiring' | 'educational'>('all');

  // AI quick drafter
  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);

  // Score
  const scoreResult = calculateLiveTweetScore(draftText, undefined, false, weights);
  const words = draftText.trim().split(/\s+/).filter(Boolean).length;
  const chars = draftText.length;
  const hasLink = draftText.includes('http://') || draftText.includes('https://');

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleSchedulePost = (timeStr?: string) => {
    setScheduleSuccess(true);
    setTimeout(() => setScheduleSuccess(false), 3000);
  };

  const handleGenerateAiPost = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ghostwriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          topTweets: allFeedTweets.slice(0, 3).map((t) => t.text),
        }),
      });
      const data = await res.json();
      if (data.success && data.result?.draft) {
        setGeneratedDraft(data.result.draft);
      }
    } catch {
      // Fallback draft
      setGeneratedDraft(`The biggest mistake people make with ${aiTopic}:\n\nThey optimize for views instead of bookmarks.\n\nHere are 3 simple shifts that fix it:`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <aside className={`w-full lg:w-[420px] shrink-0 border-l flex flex-col h-[calc(100vh-53px)] sticky top-[53px] overflow-hidden transition-colors ${
      isDark ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      {/* Top Pro Status / Upgrade Header */}
      <div className={`px-3 py-1.5 border-b flex items-center justify-between text-xs ${
        isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-100 bg-gray-50/80'
      }`}>
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[11px] text-[#1d9bf0]">TweetIQ Studio</span>
          {license.hasLifetime ? (
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              ✓ Lifetime Pro
            </span>
          ) : (
            <span className="text-[10px] text-gray-400">
              Free Mode
            </span>
          )}
        </div>

        {!license.hasLifetime && (
          <button
            onClick={onOpenPricing}
            className="text-[11px] text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 hover:underline"
          >
            <span>⚡ Unlock Pro ($29)</span>
          </button>
        )}
      </div>

      {/* Clean 3-Tab Bar: Write, Stats, Saved */}
      <nav className={`px-3 py-2 border-b grid grid-cols-3 gap-1.5 ${
        isDark ? 'border-[#2f3336] bg-[#090a0d]' : 'border-gray-100 bg-gray-50'
      }`}>
        <button
          onClick={() => setActiveSideTab('write')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            currentTab === 'write'
              ? 'bg-[#1d9bf0] text-white shadow-xs'
              : isDark
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Write</span>
        </button>

        <button
          onClick={() => setActiveSideTab('stats')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            currentTab === 'stats'
              ? 'bg-[#1d9bf0] text-white shadow-xs'
              : isDark
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Stats</span>
        </button>

        <button
          onClick={() => setActiveSideTab('saved')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all relative ${
            currentTab === 'saved'
              ? 'bg-[#1d9bf0] text-white shadow-xs'
              : isDark
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved</span>
          {savedTweets.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
              {savedTweets.length}
            </span>
          )}
        </button>
      </nav>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* =====================================================================
            TAB 1: WRITE (Simple, clean, distraction-free)
           ===================================================================== */}
        {currentTab === 'write' && (
          <div className="space-y-4">
            {/* Quick Starters */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 font-medium">Starters:</span>
              <div className="flex gap-1.5 flex-1">
                {quickTemplates.map((t) => (
                  <button
                    key={t.title}
                    onClick={() => setDraftText(t.text)}
                    className={`px-2.5 py-1 rounded-md text-xs border transition-colors ${
                      isDark 
                        ? 'border-[#2f3336] hover:border-[#1d9bf0] text-gray-300 bg-[#0c0d10]' 
                        : 'border-gray-200 hover:border-[#1d9bf0] text-gray-700 bg-white'
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Writer Box */}
            <div className={`rounded-xl border overflow-hidden ${
              isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
            }`}>
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Write your tweet here..."
                rows={7}
                className={`w-full p-3.5 bg-transparent resize-none text-sm leading-relaxed focus:outline-none ${
                  isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />

              {/* Bottom bar inside writer */}
              <div className={`px-3.5 py-2 border-t flex items-center justify-between text-xs ${
                isDark ? 'border-[#2f3336] bg-black/40 text-gray-400' : 'border-gray-100 bg-gray-50/50 text-gray-500'
              }`}>
                <div>
                  <span className={chars > 280 ? 'text-red-500 font-bold' : ''}>
                    {chars} / 280 chars
                  </span>
                  <span className="mx-2">·</span>
                  <span>{words} words</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="font-medium hover:underline flex items-center gap-1 text-gray-600 dark:text-gray-300"
                  >
                    {copiedDraft ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedDraft ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => onOpenRemixForText(draftText)}
                    className="text-purple-500 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Remix</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Reach Score Card */}
            <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono text-[#1d9bf0]">
                    {scoreResult.score}%
                  </span>
                  <span className="text-xs font-semibold">
                    {scoreResult.score >= 85 ? '🌟 High reach potential!' : '👍 Solid tweet'}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  {hasLink ? (
                    <span className="text-amber-500 font-medium">⚠️ Move links to your first reply for more views</span>
                  ) : (
                    <span>✓ Clean format · Short lines read best on phones</span>
                  )}
                </div>
              </div>

              <div className="w-14 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shrink-0">
                <div
                  className="h-full bg-[#1d9bf0] rounded-full"
                  style={{ width: `${scoreResult.score}%` }}
                />
              </div>
            </div>

            {/* Schedule Notice if clicked */}
            {scheduleSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Scheduled for Monday at 8:45 AM (Peak window)!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => onPublishFromStudio(draftText)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Post Now
              </button>

              <button
                onClick={() => handleSchedulePost()}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                  isDark
                    ? 'border-[#2f3336] hover:bg-white/5 text-gray-200'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#1d9bf0]" /> Schedule (Mon 8:45 AM)
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: STATS (Only essential numbers + best times to post)
           ===================================================================== */}
        {currentTab === 'stats' && (
          <div className="space-y-4">
            {/* 3 Key Numbers */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className={`p-3 rounded-xl border ${
                isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
              }`}>
                <div className="text-[11px] text-gray-400">Total Views</div>
                <div className="text-base font-bold mt-0.5">1.8M</div>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
              }`}>
                <div className="text-[11px] text-gray-400">Save Rate</div>
                <div className="text-base font-bold text-emerald-500 mt-0.5">4.8%</div>
              </div>

              <div className={`p-3 rounded-xl border ${
                isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
              }`}>
                <div className="text-[11px] text-gray-400">Streak</div>
                <div className="text-base font-bold text-amber-500 flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" /> 19 Days
                </div>
              </div>
            </div>

            {/* Engagement Tracker & Growth Trendlines Card */}
            <div className={`p-4 rounded-xl border ${
              isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#1d9bf0]" />
                  <span>Engagement &amp; Follower Tracker</span>
                </h4>
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  +860 this week
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-2.5">
                <div>
                  <div className="text-lg font-black">14,980 <span className="text-xs font-normal text-gray-400">followers</span></div>
                  <div className="text-[10px] text-gray-500">Avg Reach: 92% · Avg Bookmarks: 176</div>
                </div>
                {onOpenTracker && (
                  <button
                    onClick={onOpenTracker}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-[11px] transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>View Trendlines</span>
                    <TrendingUp className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sparkline mini-preview */}
              <div className="h-10 w-full relative">
                <svg viewBox="0 0 100 25" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <path
                    d="M 0,22 Q 15,18 28,19 T 50,12 T 72,8 T 100,2"
                    fill="none"
                    stroke="#1d9bf0"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="100" cy="2" r="3" fill="#1d9bf0" />
                </svg>
              </div>
            </div>

            {/* Best Times to Post */}
            <div className={`p-4 rounded-xl border ${
              isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#1d9bf0]" />
                  <span>Best Times to Post</span>
                </h4>
                <span className="text-[11px] font-semibold text-emerald-500 font-mono">
                  Peak: Mon 8:45 AM
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mb-2.5">
                When your audience is online and active on X:
              </p>

              <div className="space-y-2">
                <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                  isDark ? 'border-gray-800 bg-black/40' : 'border-gray-100 bg-gray-50'
                }`}>
                  <div>
                    <strong className="text-[#1d9bf0]">Monday 8:45 AM</strong>
                    <div className="text-[10px] text-gray-400">Highest views &amp; discovery of the week</div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveSideTab('write');
                      handleSchedulePost('Monday 8:45 AM');
                    }}
                    className="px-2 py-1 rounded text-xs font-semibold text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                  >
                    + Pick
                  </button>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                  isDark ? 'border-gray-800 bg-black/40' : 'border-gray-100 bg-gray-50'
                }`}>
                  <div>
                    <strong className="text-[#1d9bf0]">Wednesday 6:30 PM</strong>
                    <div className="text-[10px] text-gray-400">Highest bookmark &amp; save rate</div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveSideTab('write');
                      handleSchedulePost('Wednesday 6:30 PM');
                    }}
                    className="px-2 py-1 rounded text-xs font-semibold text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                  >
                    + Pick
                  </button>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                  isDark ? 'border-gray-800 bg-black/40' : 'border-gray-100 bg-gray-50'
                }`}>
                  <div>
                    <strong className="text-[#1d9bf0]">Sunday 7:45 PM</strong>
                    <div className="text-[10px] text-gray-400">Best for deep threads &amp; guides</div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveSideTab('write');
                      handleSchedulePost('Sunday 7:45 PM');
                    }}
                    className="px-2 py-1 rounded text-xs font-semibold text-[#1d9bf0] hover:bg-[#1d9bf0]/10"
                  >
                    + Pick
                  </button>
                </div>
              </div>
            </div>

            {/* Best Performing Post to Repost */}
            <div className={`p-4 rounded-xl border ${
              isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#1d9bf0]" />
                  <span>Your #1 Top Post</span>
                </h4>
                <span className="text-[10px] text-emerald-500 font-bold font-mono">142K views</span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 mb-2 leading-relaxed">
                "{EVERGREEN_TWEETS_RECYCLER[0]?.text}"
              </p>
              <button
                onClick={() => {
                  setDraftText(EVERGREEN_TWEETS_RECYCLER[0]?.text || '');
                  setActiveSideTab('write');
                }}
                className="text-xs text-[#1d9bf0] font-semibold hover:underline"
              >
                Reuse in Writer →
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: SAVED (Swipe file & simple idea drafter)
           ===================================================================== */}
        {currentTab === 'saved' && (
          <div className="space-y-4">
            {/* Quick Idea Drafter */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#1d9bf0]" />
                <span>Need an Idea?</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. growing a solo business"
                  className={`flex-1 p-2 rounded-lg border text-xs ${
                    isDark ? 'border-[#2f3336] bg-black text-white' : 'border-gray-200 bg-gray-50 text-gray-900'
                  }`}
                />
                <button
                  onClick={handleGenerateAiPost}
                  disabled={aiLoading}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white shrink-0"
                >
                  {aiLoading ? 'Thinking...' : 'Draft'}
                </button>
              </div>

              {generatedDraft && (
                <div className="p-2.5 rounded-lg border border-[#1d9bf0]/20 bg-[#1d9bf0]/5 text-xs space-y-1.5">
                  <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">{generatedDraft}</p>
                  <button
                    onClick={() => {
                      setDraftText(generatedDraft);
                      setActiveSideTab('write');
                    }}
                    className="text-xs text-[#1d9bf0] font-semibold hover:underline block"
                  >
                    Use this in Writer →
                  </button>
                </div>
              )}
            </div>

            {/* Saved Bookmarks */}
            <div className={`p-4 rounded-xl border ${
              isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold">
                  Saved Swipe File ({savedTweets.length})
                </h4>
                <span className="text-[10px] text-gray-400">From your timeline</span>
              </div>

              {/* Saved filter pills if there are items */}
              {savedTweets.length > 0 && (
                <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
                  <button
                    onClick={() => setSavedFilter('all')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${
                      savedFilter === 'all'
                        ? 'bg-[#1d9bf0] text-white'
                        : isDark ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    All ({savedTweets.length})
                  </button>
                  <button
                    onClick={() => setSavedFilter('hiring')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all flex items-center gap-1 ${
                      savedFilter === 'hiring'
                        ? 'bg-amber-500 text-white'
                        : isDark ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20' : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    <Briefcase className="w-2.5 h-2.5" />
                    <span>Hiring</span>
                  </button>
                  <button
                    onClick={() => setSavedFilter('educational')}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all flex items-center gap-1 ${
                      savedFilter === 'educational'
                        ? 'bg-cyan-500 text-white'
                        : isDark ? 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20' : 'bg-cyan-50 text-cyan-800'
                    }`}
                  >
                    <BookOpen className="w-2.5 h-2.5" />
                    <span>Educational</span>
                  </button>
                </div>
              )}

              {savedTweets.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  No saved tweets yet.<br />Click "Save" on any tweet in the timeline to save it here for inspiration.
                </div>
              ) : (
                <div className="space-y-2">
                  {savedTweets
                    .filter((st) => {
                      if (savedFilter === 'hiring') return detectTweetIntent(st) === 'hiring';
                      if (savedFilter === 'educational') return detectTweetIntent(st) === 'educational';
                      return true;
                    })
                    .map((st) => {
                      const intent = detectTweetIntent(st);
                      return (
                        <div key={st.id} className="p-2.5 rounded-lg border border-gray-100 dark:border-white/5 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-[#1d9bf0]">@{st.author.handle}</span>
                              {intent === 'hiring' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                  Hiring
                                </span>
                              )}
                              {intent === 'educational' && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                  Educational
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-emerald-500 font-bold">{st.viralScore}% reach</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 line-clamp-2 mb-1.5">{st.text}</p>
                          <button
                            onClick={() => {
                              setDraftText(st.text);
                              setActiveSideTab('write');
                            }}
                            className="text-xs text-[#1d9bf0] font-semibold hover:underline"
                          >
                            Use as Template →
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tiny, quiet footer for downloads only if needed */}
      <div className={`px-4 py-2 border-t flex items-center justify-between text-[11px] text-gray-400 ${
        isDark ? 'border-[#2f3336] bg-[#090a0d]' : 'border-gray-100 bg-gray-50'
      }`}>
        <button
          onClick={() => exportTweetsAsCsv(allFeedTweets)}
          className="hover:text-[#1d9bf0] transition-colors"
        >
          Download CSV
        </button>
        <span>·</span>
        <button
          onClick={onOpenMediaKit}
          className="hover:text-[#1d9bf0] transition-colors"
        >
          Sponsor Pitch Kit
        </button>
      </div>
    </aside>
  );
};
