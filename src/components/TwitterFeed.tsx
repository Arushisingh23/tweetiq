import React, { useState } from 'react';
import { 
  Tweet, 
  TweetMetrics, 
  AlgorithmWeights,
  ThemeMode 
} from '../types';
import { 
  MessageCircle, 
  Repeat2, 
  Heart, 
  Bookmark, 
  BarChart2, 
  Sparkles, 
  Zap, 
  Flame, 
  Image as ImageIcon,
  Briefcase,
  BookOpen,
  X,
  Filter,
  Check,
  SpellCheck,
  AlertTriangle,
  Wand2,
  PlusCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { calculateLiveTweetScore, detectTweetIntent, checkGrammarAndClarity } from '../utils/analytics';
import { optimizeTweet } from '../utils/tweetOptimizer';
import { TweetOptimizerCard } from './TweetOptimizerCard';

interface TwitterFeedProps {
  tweets: Tweet[];
  onSelectTweetForDiagnostic: (tweet: Tweet) => void;
  onSelectTweetForRemix: (tweet: Tweet) => void;
  onSaveToSwipeFile: (tweet: Tweet) => void;
  onPublishNewTweet: (text: string, mediaUrl?: string) => void;
  weights: AlgorithmWeights;
  onUpdateTweetMetrics: (tweetId: string, updatedMetrics: Partial<TweetMetrics>, toggledKey?: 'like' | 'retweet' | 'bookmark') => void;
  theme: ThemeMode;
  onOpenGrammarChecker?: (text: string, onApply: (fixedText: string) => void) => void;
}

export const TwitterFeed: React.FC<TwitterFeedProps> = ({
  tweets,
  onSelectTweetForDiagnostic,
  onSelectTweetForRemix,
  onSaveToSwipeFile,
  onPublishNewTweet,
  weights,
  onUpdateTweetMetrics,
  theme,
  onOpenGrammarChecker,
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'for_you' | 'following'>('for_you');
  const [postFilter, setPostFilter] = useState<'all' | 'hiring' | 'educational'>('all');
  const [newTweetText, setNewTweetText] = useState('');
  const [includeImage, setIncludeImage] = useState(false);

  // Live composer score & grammar check & auto-optimizer
  const [showOptimizerPreview, setShowOptimizerPreview] = useState(false);
  const composerScore = calculateLiveTweetScore(newTweetText, undefined, includeImage, weights);
  const composerDetectedIntent = newTweetText.trim().length > 5 ? detectTweetIntent({ text: newTweetText }) : 'general';
  const composerGrammar = newTweetText.trim().length > 3 ? checkGrammarAndClarity(newTweetText) : null;
  const optimization = newTweetText.trim().length > 8 ? optimizeTweet(newTweetText) : null;

  // Counts for filters
  const allCount = tweets.length;
  const hiringCount = tweets.filter((t) => detectTweetIntent(t) === 'hiring').length;
  const educationalCount = tweets.filter((t) => detectTweetIntent(t) === 'educational').length;

  // Filtered tweets
  const filteredTweets = tweets.filter((t) => {
    if (postFilter === 'hiring') return detectTweetIntent(t) === 'hiring';
    if (postFilter === 'educational') return detectTweetIntent(t) === 'educational';
    return true;
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTweetText.trim()) return;
    const media = includeImage
      ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
      : undefined;
    onPublishNewTweet(newTweetText, media);
    setNewTweetText('');
    setIncludeImage(false);
  };

  return (
    <div className={`flex-1 min-h-[calc(100vh-53px)] max-w-2xl mx-auto w-full transition-colors border-r ${
      isDark ? 'bg-[#000000] border-[#2f3336] text-[#eff3f4]' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      {/* Top sticky tabs like real X */}
      <div className={`sticky top-[49px] z-30 backdrop-blur-md border-b transition-colors ${
        isDark ? 'bg-[#000000]/90 border-[#2f3336]' : 'bg-white/90 border-gray-200'
      }`}>
        <div className="flex">
          <button
            onClick={() => setActiveTab('for_you')}
            className={`flex-1 text-center py-3.5 transition-colors relative ${
              isDark ? 'hover:bg-[#181818]' : 'hover:bg-gray-50'
            }`}
          >
            <span
              className={`text-sm font-bold ${
                activeTab === 'for_you'
                  ? isDark ? 'text-white' : 'text-gray-900'
                  : isDark ? 'text-[#71767b]' : 'text-gray-500'
              }`}
            >
              For you
            </span>
            {activeTab === 'for_you' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-[#1d9bf0] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 text-center py-3.5 transition-colors relative ${
              isDark ? 'hover:bg-[#181818]' : 'hover:bg-gray-50'
            }`}
          >
            <span
              className={`text-sm font-bold ${
                activeTab === 'following'
                  ? isDark ? 'text-white' : 'text-gray-900'
                  : isDark ? 'text-[#71767b]' : 'text-gray-500'
              }`}
            >
              Following
            </span>
            {activeTab === 'following' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1d9bf0] rounded-full" />
            )}
          </button>
        </div>

        {/* Dedicated Feed Intent Filter Bar */}
        <div className={`px-4 py-2 border-t flex items-center justify-between gap-2 overflow-x-auto ${
          isDark ? 'bg-[#0a0a0d] border-[#2f3336]' : 'bg-gray-50/90 border-gray-100'
        }`}>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-1 hidden sm:inline">
              Filter:
            </span>

            {/* All Posts Filter Button */}
            <button
              onClick={() => setPostFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                postFilter === 'all'
                  ? isDark
                    ? 'bg-white text-black shadow-xs font-bold'
                    : 'bg-black text-white shadow-xs font-bold'
                  : isDark
                  ? 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 border border-transparent'
              }`}
            >
              <span>All Posts</span>
              <span className="text-[10px] opacity-70">({allCount})</span>
            </button>

            {/* Hiring Posts Filter Button */}
            <button
              onClick={() => setPostFilter(postFilter === 'hiring' ? 'all' : 'hiring')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                postFilter === 'hiring'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                  : isDark
                  ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/30'
                  : 'text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Hiring Posts</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                postFilter === 'hiring' ? 'bg-black/30 text-white' : 'bg-amber-500/20 text-amber-500'
              }`}>
                {hiringCount}
              </span>
            </button>

            {/* Educational Posts Filter Button */}
            <button
              onClick={() => setPostFilter(postFilter === 'educational' ? 'all' : 'educational')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                postFilter === 'educational'
                  ? 'bg-gradient-to-r from-[#1d9bf0] to-cyan-500 text-white font-bold shadow-md shadow-[#1d9bf0]/20 ring-1 ring-cyan-400'
                  : isDark
                  ? 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/30'
                  : 'text-cyan-800 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Educational Posts</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                postFilter === 'educational' ? 'bg-black/30 text-white' : 'bg-cyan-500/20 text-cyan-500'
              }`}>
                {educationalCount}
              </span>
            </button>
          </div>

          {postFilter !== 'all' && (
            <button
              onClick={() => setPostFilter('all')}
              className="text-[11px] text-gray-400 hover:text-gray-200 flex items-center gap-1 font-medium hover:underline shrink-0"
            >
              <X className="w-3 h-3" />
              <span>Clear Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Status Bar */}
      {postFilter !== 'all' && (
        <div className={`px-4 py-2 border-b flex items-center justify-between text-xs transition-colors ${
          postFilter === 'hiring'
            ? isDark
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
              : 'bg-amber-50 border-amber-200 text-amber-900'
            : isDark
            ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'
            : 'bg-cyan-50 border-cyan-200 text-cyan-900'
        }`}>
          <div className="flex items-center gap-2">
            {postFilter === 'hiring' ? (
              <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span className="font-semibold">
              Showing <strong>{filteredTweets.length}</strong> {postFilter === 'hiring' ? 'Hiring Posts (job openings, bounties & team recruitment)' : 'Educational Posts (deep-dives, frameworks & guides)'}
            </span>
          </div>

          <button
            onClick={() => setPostFilter('all')}
            className="text-[11px] font-bold underline underline-offset-2 hover:opacity-80"
          >
            Show All ({allCount})
          </button>
        </div>
      )}

      {/* Clean Tweet Composer */}
      <div className={`p-4 border-b flex gap-3 ${isDark ? 'border-[#2f3336]' : 'border-gray-200'}`}>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <div className="flex-1">
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newTweetText}
              onChange={(e) => setNewTweetText(e.target.value)}
              placeholder="What is happening?! (TweetIQ scores your reach as you type...)"
              className={`w-full bg-transparent text-sm md:text-base resize-none focus:outline-none min-h-[70px] ${
                isDark ? 'text-[#eff3f4] placeholder-[#71767b]' : 'text-gray-900 placeholder-gray-400'
              }`}
            />

            {/* In-Line Score Pill & Intent Detector when typing */}
            {newTweetText.length > 5 && (
              <div className={`mb-3 p-2 rounded-lg flex items-center justify-between text-xs border ${
                isDark 
                  ? 'bg-[#16181c] border-[#2f3336]' 
                  : 'bg-blue-50/60 border-blue-100 text-gray-800'
              }`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#1d9bf0]" />
                    <span className="font-bold text-[#1d9bf0]">
                      Reach Score: {composerScore.score}%
                    </span>
                  </div>
                  <span className="text-gray-400">·</span>
                  <span className="text-[11px] text-gray-500">
                    {composerScore.score >= 85 ? '🌟 High potential' : '👍 Good draft'}
                  </span>

                  {/* Auto-detected post type */}
                  {composerDetectedIntent === 'hiring' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Briefcase className="w-3 h-3" />
                      Detected: Hiring Post
                    </span>
                  )}
                  {composerDetectedIntent === 'educational' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      <BookOpen className="w-3 h-3" />
                      Detected: Educational Post
                    </span>
                  )}

                  {/* Grammar status in pill */}
                  {composerGrammar && composerGrammar.hasIssues && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                      <span>{composerGrammar.issues.length} grammar fix{composerGrammar.issues.length > 1 ? 'es' : ''}</span>
                      <button
                        type="button"
                        onClick={() => setNewTweetText(composerGrammar.cleanText)}
                        className="ml-1 text-[10px] underline hover:text-white"
                        title="Auto-apply fixes"
                      >
                        Auto-Fix
                      </button>
                    </div>
                  )}
                </div>

                {String(composerScore.details.hasLink).includes('Suppression') && (
                  <span className="text-[10px] text-amber-500 font-medium">
                    ⚠️ Put link in reply to avoid reach penalty
                  </span>
                )}
              </div>
            )}

            {/* Embedded Smart Optimizer & Hook Polisher Card */}
            {newTweetText.trim().length > 8 && (
              <div className="mb-3">
                <TweetOptimizerCard
                  draftText={newTweetText}
                  onApplyPolishedText={(polished) => setNewTweetText(polished)}
                  theme={theme}
                />
              </div>
            )}

            <div className={`flex items-center justify-between pt-2 border-t ${
              isDark ? 'border-[#2f3336]' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIncludeImage(!includeImage)}
                  className={`p-1.5 rounded-full hover:bg-[#1d9bf0]/10 transition-colors flex items-center gap-1 text-xs cursor-pointer ${
                    includeImage ? 'text-[#10b981]' : 'text-[#1d9bf0]'
                  }`}
                  title="Add Image"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-[11px]">{includeImage ? 'Image Added' : 'Add Image'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (optimization) {
                      setNewTweetText(optimization.polishedText);
                    } else if (composerGrammar) {
                      setNewTweetText(composerGrammar.cleanText);
                    }
                  }}
                  disabled={!newTweetText.trim()}
                  className={`p-1.5 rounded-full hover:bg-[#1d9bf0]/10 disabled:opacity-40 transition-colors flex items-center gap-1 text-xs cursor-pointer ${
                    composerGrammar && composerGrammar.hasIssues ? 'text-amber-500 font-bold' : 'text-[#1d9bf0]'
                  }`}
                  title="Auto-Polish Hook, Format & Grammar"
                >
                  <Wand2 className="w-4 h-4" />
                  <span className="text-[11px]">
                    {composerGrammar && composerGrammar.hasIssues 
                      ? `Fix & Polish (${composerGrammar.issues.length})`
                      : 'Auto-Polish Hook'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs ${
                    newTweetText.length > 280 
                      ? 'text-red-500 font-bold' 
                      : isDark ? 'text-[#71767b]' : 'text-gray-400'
                  }`}
                >
                  {newTweetText.length}/280
                </span>
                <button
                  type="submit"
                  disabled={!newTweetText.trim()}
                  className="px-4 py-1.5 bg-[#1d9bf0] hover:bg-[#1a8cd8] disabled:opacity-50 text-white font-bold text-xs rounded-full transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Tweet Timeline */}
      <div className="divide-y divide-gray-100 dark:divide-[#2f3336]">
        {filteredTweets.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-500/10 flex items-center justify-center mx-auto text-gray-400">
              {postFilter === 'hiring' ? <Briefcase className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
            </div>
            <h4 className="font-bold text-sm">
              No {postFilter === 'hiring' ? 'hiring' : 'educational'} posts found
            </h4>
            <p className="text-gray-400 text-xs max-w-sm mx-auto">
              Draft a new {postFilter === 'hiring' ? 'hiring' : 'educational'} post in the box above or view all posts in your feed.
            </p>
            <button
              onClick={() => setPostFilter('all')}
              className="px-4 py-2 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold text-xs transition-colors"
            >
              Show All Posts
            </button>
          </div>
        ) : (
          filteredTweets.map((tweet) => {
            const liveScore = calculateLiveTweetScore(tweet.text, tweet.metrics, Boolean(tweet.mediaUrl), weights);
            const isViral = tweet.metrics.impressions > 25000 || liveScore.score >= 90;
            const intent = detectTweetIntent(tweet);

            return (
              <article
                key={tweet.id}
                className={`p-4 transition-colors ${
                  isDark ? 'hover:bg-[#080808]' : 'hover:bg-gray-50/50'
                }`}
              >
                <div className="flex gap-3">
                  {/* Author Avatar */}
                  <img
                    src={tweet.author.avatar}
                    alt={tweet.author.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Author Header */}
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {tweet.author.name}
                        </span>
                        {tweet.author.verified && (
                          <div className="w-4 h-4 rounded-full bg-[#1d9bf0] flex items-center justify-center text-white text-[10px] shrink-0">
                            ✓
                          </div>
                        )}
                        <span className={`text-xs truncate ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>
                          @{tweet.author.handle}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-[#71767b]' : 'text-gray-400'}`}>·</span>
                        <span className={`text-xs shrink-0 ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>
                          {tweet.timestamp}
                        </span>
                      </div>

                      {/* Header Right: Intent Badge + Options Menu */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        {intent === 'hiring' && (
                          <button
                            onClick={() => setPostFilter('hiring')}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
                            title="Filter: Show only Hiring posts"
                          >
                            <Briefcase className="w-3 h-3" />
                            <span>Hiring</span>
                          </button>
                        )}
                        {intent === 'educational' && (
                          <button
                            onClick={() => setPostFilter('educational')}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 transition-colors"
                            title="Filter: Show only Educational posts"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Educational</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Tweet Content */}
                    <p className={`mt-2 text-sm leading-relaxed whitespace-pre-line ${
                      isDark ? 'text-[#eff3f4]' : 'text-gray-900'
                    }`}>
                      {tweet.text}
                    </p>

                    {/* Media attachment if any */}
                    {tweet.mediaUrl && (
                      <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-[#2f3336] max-h-72">
                        <img
                          src={tweet.mediaUrl}
                          alt="Post media"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Tweet Action Icons */}
                    <div className={`mt-3 flex items-center justify-between max-w-md text-xs ${
                      isDark ? 'text-[#71767b]' : 'text-gray-500'
                    }`}>
                      {/* Reply */}
                      <button
                        onClick={() =>
                          onUpdateTweetMetrics(
                            tweet.id,
                            { replies: tweet.metrics.replies + 1 }
                          )
                        }
                        className="flex items-center gap-1.5 hover:text-[#1d9bf0] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{tweet.metrics.replies.toLocaleString()}</span>
                      </button>

                      {/* Retweet */}
                      <button
                        onClick={() =>
                          onUpdateTweetMetrics(
                            tweet.id,
                            {
                              retweets: tweet.isRetweeted
                                ? tweet.metrics.retweets - 1
                                : tweet.metrics.retweets + 1,
                            },
                            'retweet'
                          )
                        }
                        className={`flex items-center gap-1.5 transition-colors ${
                          tweet.isRetweeted ? 'text-[#00ba7c]' : 'hover:text-[#00ba7c]'
                        }`}
                      >
                        <Repeat2 className="w-4 h-4" />
                        <span>{tweet.metrics.retweets.toLocaleString()}</span>
                      </button>

                      {/* Like */}
                      <button
                        onClick={() =>
                          onUpdateTweetMetrics(
                            tweet.id,
                            {
                              likes: tweet.isLiked
                                ? tweet.metrics.likes - 1
                                : tweet.metrics.likes + 1,
                            },
                            'like'
                          )
                        }
                        className={`flex items-center gap-1.5 transition-colors ${
                          tweet.isLiked ? 'text-[#f91880]' : 'hover:text-[#f91880]'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${tweet.isLiked ? 'fill-[#f91880]' : ''}`}
                        />
                        <span>{tweet.metrics.likes.toLocaleString()}</span>
                      </button>

                      {/* Bookmark */}
                      <button
                        onClick={() =>
                          onUpdateTweetMetrics(
                            tweet.id,
                            {
                              bookmarks: tweet.isBookmarked
                                ? tweet.metrics.bookmarks - 1
                                : tweet.metrics.bookmarks + 1,
                            },
                            'bookmark'
                          )
                        }
                        className={`flex items-center gap-1.5 transition-colors ${
                          tweet.isBookmarked ? 'text-[#1d9bf0]' : 'hover:text-[#1d9bf0]'
                        }`}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${tweet.isBookmarked ? 'fill-[#1d9bf0]' : ''}`}
                        />
                        <span>{tweet.metrics.bookmarks.toLocaleString()}</span>
                      </button>

                      {/* Views */}
                      <div className="flex items-center gap-1.5">
                        <BarChart2 className="w-4 h-4" />
                        <span>{tweet.metrics.impressions.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Clean TweetIQ In-Feed Overlay Bar */}
                    <div className={`mt-2.5 pt-2 flex items-center justify-between gap-2 text-xs border-t ${
                      isDark ? 'border-[#2f3336]/60 text-gray-400' : 'border-gray-100 text-gray-500'
                    }`}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectTweetForDiagnostic(tweet)}
                          className="font-bold text-[#1d9bf0] hover:underline flex items-center gap-1"
                          title="Click to view reach breakdown & tips"
                        >
                          ⚡ {liveScore.score}% Reach
                        </button>

                        {isViral && (
                          <>
                            <span className="text-gray-400">·</span>
                            <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                              <Flame className="w-3 h-3 fill-amber-500" /> Viral
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectTweetForRemix(tweet)}
                          className={`text-xs font-medium px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                            isDark
                              ? 'text-gray-300 hover:text-white hover:bg-white/10'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                          title="Remix this format"
                        >
                          <Sparkles className="w-3 h-3 text-[#1d9bf0]" />
                          <span>Remix</span>
                        </button>

                        <button
                          onClick={() => onSaveToSwipeFile(tweet)}
                          className={`text-xs font-medium px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                            isDark
                              ? 'text-gray-400 hover:text-white hover:bg-white/10'
                              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                          title="Save to your swipe file"
                        >
                          <Bookmark className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
