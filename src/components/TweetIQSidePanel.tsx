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
  BookOpen,
  SpellCheck,
  CheckCheck,
  AlertCircle,
  Wand2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { calculateLiveTweetScore, exportTweetsAsCsv, detectTweetIntent, checkGrammarAndClarity } from '../utils/analytics';
import { INITIAL_SCHEDULED_QUEUE, EVERGREEN_TWEETS_RECYCLER } from '../data/tweetiqData';
import { DailyStreakCounter } from './DailyStreakCounter';
import { TweetOptimizerCard } from './TweetOptimizerCard';
import { recordTodayStreakActivity } from '../utils/streak';

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
  onOpenGrammarChecker?: (text: string, onApply: (fixedText: string) => void) => void;
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
  onOpenGrammarChecker,
}) => {
  const isDark = theme === 'dark';

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
  const [showStarters, setShowStarters] = useState(false);

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
  ];

  const [savedFilter, setSavedFilter] = useState<'all' | 'hiring' | 'educational'>('all');

  // Score & metrics
  const scoreResult = calculateLiveTweetScore(draftText, undefined, false, weights);
  const words = draftText.trim().split(/\s+/).filter(Boolean).length;
  const chars = draftText.length;
  const hasLink = draftText.includes('http://') || draftText.includes('https://');

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleSchedulePost = () => {
    recordTodayStreakActivity();
    window.dispatchEvent(new Event('tweetiq-activity-logged'));
    setScheduleSuccess(true);
    setTimeout(() => setScheduleSuccess(false), 3000);
  };

  const handlePublish = () => {
    recordTodayStreakActivity();
    window.dispatchEvent(new Event('tweetiq-activity-logged'));
    onPublishFromStudio(draftText);
  };

  return (
    <aside className={`w-full lg:w-[410px] shrink-0 border-l flex flex-col h-[calc(100vh-53px)] sticky top-[53px] overflow-hidden transition-colors ${
      isDark ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      {/* Extension Header: Clean, quiet, minimal */}
      <div className={`px-4 py-2.5 border-b flex items-center justify-between shrink-0 ${
        isDark ? 'border-[#2f3336] bg-[#090a0d]' : 'border-gray-100 bg-gray-50/90'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#1d9bf0] flex items-center justify-center text-white">
            <Zap className="w-3 h-3 fill-white" />
          </div>
          <span className="font-extrabold text-xs tracking-tight">TweetIQ Extension</span>
          {license.hasLifetime ? (
            <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded">
              PRO
            </span>
          ) : (
            <button
              onClick={onOpenPricing}
              className="text-[10px] text-amber-500 hover:text-amber-400 font-bold hover:underline"
            >
              Get Pro ($29)
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={handleCopy}
            className={`p-1 rounded-md transition-colors text-gray-400 hover:text-white ${
              copiedDraft ? 'text-emerald-500' : ''
            }`}
            title="Copy draft to clipboard"
          >
            {copiedDraft ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* User Profile & Daily Streak Area */}
      <DailyStreakCounter theme={theme} />

      {/* Clean 3-Tab Bar: Write, Stats, Saved */}
      <nav className={`px-3 py-1.5 border-b grid grid-cols-3 gap-1 shrink-0 ${
        isDark ? 'border-[#2f3336] bg-[#090a0d]' : 'border-gray-100 bg-gray-50'
      }`}>
        <button
          onClick={() => setActiveSideTab('write')}
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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
          className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
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
            <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center ml-1">
              {savedTweets.length}
            </span>
          )}
        </button>
      </nav>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {/* =====================================================================
            TAB 1: WRITE (Spacious, Clean, High-Yield)
           ===================================================================== */}
        {currentTab === 'write' && (
          <div className="space-y-3">
            {/* Writer Card */}
            <div className={`rounded-xl border overflow-hidden transition-all ${
              isDark ? 'border-[#2f3336] bg-[#0c0d10] focus-within:border-[#1d9bf0]/70' : 'border-gray-200 bg-white focus-within:border-[#1d9bf0]'
            }`}>
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Write your draft here..."
                rows={6}
                className={`w-full p-3.5 bg-transparent resize-none text-sm leading-relaxed focus:outline-none ${
                  isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />

              {/* Bottom bar inside writer: Char count & Reach Indicator */}
              <div className={`px-3 py-2 border-t flex items-center justify-between text-xs ${
                isDark ? 'border-[#2f3336] bg-black/40 text-gray-400' : 'border-gray-100 bg-gray-50/50 text-gray-500'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`font-mono ${chars > 280 ? 'text-red-500 font-bold' : ''}`}>
                    {chars}/280
                  </span>
                  <span>·</span>
                  <span className="font-semibold text-[#1d9bf0]">
                    Reach: {scoreResult.score}%
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenRemixForText(draftText)}
                    className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Remix</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Optimizer & Hook Polisher Component */}
            <TweetOptimizerCard
              draftText={draftText}
              onApplyPolishedText={(polished) => setDraftText(polished)}
              theme={theme}
            />

            {/* Schedule Notice if clicked */}
            {scheduleSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-500 font-medium flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Scheduled for Monday at 8:45 AM (Peak window)!</span>
              </div>
            )}

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handlePublish}
                disabled={!draftText.trim()}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Post Now
              </button>

              <button
                onClick={handleSchedulePost}
                disabled={!draftText.trim()}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isDark
                    ? 'border-[#2f3336] hover:bg-white/5 text-gray-200'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#1d9bf0]" /> Schedule
              </button>
            </div>

            {/* Collapsible Starters & Frameworks */}
            <div className="pt-2">
              <button
                onClick={() => setShowStarters(!showStarters)}
                className="text-xs text-gray-400 hover:text-gray-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                {showStarters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                <span>Quick Starters &amp; Hook Frameworks</span>
              </button>

              {showStarters && (
                <div className="grid grid-cols-2 gap-1.5 mt-2 animate-in fade-in duration-100">
                  {quickTemplates.map((t) => (
                    <button
                      key={t.title}
                      onClick={() => setDraftText(t.text)}
                      className={`p-2 rounded-lg text-xs text-left border transition-colors cursor-pointer ${
                        isDark 
                          ? 'border-[#2f3336] hover:border-[#1d9bf0] text-gray-300 bg-[#0c0d10]' 
                          : 'border-gray-200 hover:border-[#1d9bf0] text-gray-700 bg-white'
                      }`}
                    >
                      <div className="font-bold">{t.title}</div>
                      <div className="text-[10px] text-gray-400 truncate mt-0.5">{t.text.split('\n')[0]}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 2: STATS
           ===================================================================== */}
        {currentTab === 'stats' && (
          <div className="space-y-3 text-xs">
            <div className={`p-3 rounded-xl border ${isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs">Evergreen Tweet Recycler</span>
                <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Automatically reposts your top performing posts every 60 days to capture new followers.
              </p>
              <div className="space-y-1.5">
                {EVERGREEN_TWEETS_RECYCLER.slice(0, 2).map((et) => (
                  <div key={et.id} className="p-2 rounded-lg border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-bold text-[#1d9bf0]">Next: {et.scheduledRecycleDate}</span>
                      <span className="text-emerald-500 font-mono">+{et.historicalMetrics.likes} likes</span>
                    </div>
                    <p className="line-clamp-2 text-gray-400">{et.originalText}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs">Scheduled Queue</span>
                <span className="text-[10px] text-gray-400">{INITIAL_SCHEDULED_QUEUE.length} queued</span>
              </div>
              <div className="space-y-1.5">
                {INITIAL_SCHEDULED_QUEUE.slice(0, 2).map((st) => (
                  <div key={st.id} className="p-2 rounded-lg border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-amber-500">{st.scheduledTime}</span>
                      <span className="text-gray-400 font-mono">Score: {st.predictedScore}%</span>
                    </div>
                    <p className="line-clamp-2 text-gray-400">{st.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            TAB 3: SAVED
           ===================================================================== */}
        {currentTab === 'saved' && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">Saved Swipe File ({savedTweets.length})</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSavedFilter('all')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    savedFilter === 'all'
                      ? 'bg-[#1d9bf0] text-white'
                      : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSavedFilter('hiring')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    savedFilter === 'hiring'
                      ? 'bg-amber-500 text-white'
                      : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Hiring
                </button>
                <button
                  onClick={() => setSavedFilter('educational')}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    savedFilter === 'educational'
                      ? 'bg-cyan-500 text-white'
                      : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Educational
                </button>
              </div>
            </div>

            {savedTweets.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                No saved tweets yet.<br />Click "Save" on any post in the feed to store it here.
              </div>
            ) : (
              <div className="space-y-2">
                {savedTweets
                  .filter((st) => {
                    if (savedFilter === 'hiring') return detectTweetIntent(st) === 'hiring';
                    if (savedFilter === 'educational') return detectTweetIntent(st) === 'educational';
                    return true;
                  })
                  .map((st) => (
                    <div key={st.id} className="p-2.5 rounded-lg border border-gray-100 dark:border-white/5 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1d9bf0]">@{st.author.handle}</span>
                        <span className="text-[10px] text-emerald-500 font-bold">{st.viralScore}% score</span>
                      </div>
                      <p className="text-gray-400 line-clamp-2">{st.text}</p>
                      <button
                        onClick={() => {
                          setDraftText(st.text);
                          setActiveSideTab('write');
                        }}
                        className="text-xs text-[#1d9bf0] font-semibold hover:underline cursor-pointer block pt-0.5"
                      >
                        Use as Template →
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Extension Footer: Quick actions */}
      <div className={`px-4 py-2 border-t flex items-center justify-between text-[11px] text-gray-400 shrink-0 ${
        isDark ? 'border-[#2f3336] bg-[#090a0d]' : 'border-gray-100 bg-gray-50'
      }`}>
        <button
          onClick={() => exportTweetsAsCsv(allFeedTweets)}
          className="hover:text-[#1d9bf0] transition-colors cursor-pointer"
        >
          Download CSV
        </button>
        <span>·</span>
        <button
          onClick={onOpenMediaKit}
          className="hover:text-[#1d9bf0] transition-colors cursor-pointer"
        >
          Sponsor Pitch Kit
        </button>
      </div>
    </aside>
  );
};
