import React, { useState, useEffect } from 'react';
import { Tweet, AlgorithmWeights, TweetMetrics, ThemeMode, LicenseState } from './types';
import { INITIAL_TWEETS } from './data/mockTweets';
import { DEFAULT_ALGORITHM_WEIGHTS, calculateLiveTweetScore, detectTweetIntent } from './utils/analytics';
import { Navbar } from './components/Navbar';
import { TwitterFeed } from './components/TwitterFeed';
import { TweetIQSidePanel } from './components/TweetIQSidePanel';
import { DiagnosticModal } from './components/DiagnosticModal';
import { HookRemixModal } from './components/HookRemixModal';
import { ChromeExportModal } from './components/ChromeExportModal';
import { ChromeWebStoreView } from './components/ChromeWebStoreView';
import { PricingModal } from './components/PricingModal';
import { MediaKitModal } from './components/MediaKitModal';
import { EngagementTracker } from './components/EngagementTracker';
import { LandingPageView } from './components/LandingPageView';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem('tweetiq_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch {
      // Fallback
    }
    return 'dark';
  });

  const [license, setLicense] = useState<LicenseState>(() => {
    try {
      const saved = localStorage.getItem('tweetiq_license');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return { hasLifetime: false, hasAIPro: false };
  });

  const [tweets, setTweets] = useState<Tweet[]>(() => {
    try {
      const saved = localStorage.getItem('tweetiq_tweets');
      if (saved) {
        const parsed: Tweet[] = JSON.parse(saved);
        const hasHiring = parsed.some((t) => t.category === 'Hiring' || t.postTag === 'hiring');
        if (hasHiring) {
          return parsed;
        }
        // If cached tweets are old and miss hiring posts, merge user posts with new INITIAL_TWEETS
        const userPosts = parsed.filter((t) => t.isUserPosted);
        return [...userPosts, ...INITIAL_TWEETS];
      }
    } catch {
      // Fallback
    }
    return INITIAL_TWEETS;
  });

  const [savedTweets, setSavedTweets] = useState<Tweet[]>(() => {
    try {
      const saved = localStorage.getItem('tweetiq_saved_swipes');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  const [weights, setWeights] = useState<AlgorithmWeights>(() => {
    try {
      const saved = localStorage.getItem('tweetiq_weights');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_ALGORITHM_WEIGHTS;
  });

  const [activeView, setActiveView] = useState<'landing' | 'webstore' | 'split' | 'feed' | 'panel' | 'export'>('landing');
  const [activeSideTab, setActiveSideTab] = useState<string>('write');

  // Modals state
  const [selectedTweetForDiag, setSelectedTweetForDiag] = useState<Tweet | null>(null);
  const [remixText, setRemixText] = useState<string | null>(null);
  const [remixTweet, setRemixTweet] = useState<Tweet | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isMediaKitModalOpen, setIsMediaKitModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('tweetiq_theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem('tweetiq_license', JSON.stringify(license));
  }, [license]);

  useEffect(() => {
    localStorage.setItem('tweetiq_tweets', JSON.stringify(tweets));
  }, [tweets]);

  useEffect(() => {
    localStorage.setItem('tweetiq_saved_swipes', JSON.stringify(savedTweets));
  }, [savedTweets]);

  useEffect(() => {
    localStorage.setItem('tweetiq_weights', JSON.stringify(weights));
  }, [weights]);

  // Handle publishing tweet to the feed simulator
  const handlePublishNewTweet = (text: string, mediaUrl?: string) => {
    const { score, grade } = calculateLiveTweetScore(text, undefined, Boolean(mediaUrl), weights);
    const intent = detectTweetIntent({ text });
    const newTweet: Tweet = {
      id: `user-tweet-${Date.now()}`,
      author: {
        name: 'You (Creator)',
        handle: 'creator_studio',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        verified: true,
        followers: '24.5K',
        bio: 'Testing high-growth viral hooks with TweetIQ extension.',
      },
      text,
      timestamp: 'Just now',
      metrics: {
        likes: Math.round(score * 12),
        retweets: Math.round(score * 2.8),
        replies: Math.round(score * 0.9),
        bookmarks: Math.round(score * 8.5), // High bookmark ratio
        impressions: score >= 90 ? 42000 : score >= 75 ? 12500 : 2800,
      },
      mediaUrl,
      mediaType: mediaUrl ? 'chart' : undefined,
      viralScore: score,
      hookGrade: grade,
      category: intent === 'hiring' ? 'Hiring' : intent === 'educational' ? 'Educational' : 'SaaS & Growth',
      postTag: intent,
      isUserPosted: true,
      outboundUrl: /https?:\/\/[^\s]+/.test(text) ? (text.match(/https?:\/\/[^\s]+/) || [])[0] : undefined,
    };

    setTweets((prev) => [newTweet, ...prev]);
  };

  // Update tweet metrics on interactive clicks (like, repost, bookmark)
  const handleUpdateTweetMetrics = (
    tweetId: string,
    updatedMetrics: Partial<TweetMetrics>,
    toggledKey?: 'like' | 'retweet' | 'bookmark'
  ) => {
    setTweets((prev) =>
      prev.map((t) => {
        if (t.id !== tweetId) return t;

        const nextMetrics = { ...t.metrics, ...updatedMetrics };
        let isLiked = t.isLiked;
        let isRetweeted = t.isRetweeted;
        let isBookmarked = t.isBookmarked;

        if (toggledKey === 'like') isLiked = !isLiked;
        if (toggledKey === 'retweet') isRetweeted = !isRetweeted;
        if (toggledKey === 'bookmark') isBookmarked = !isBookmarked;

        // Recalculate live viral score
        const { score, grade } = calculateLiveTweetScore(
          t.text,
          nextMetrics,
          Boolean(t.mediaUrl),
          weights
        );

        return {
          ...t,
          metrics: nextMetrics,
          viralScore: score,
          hookGrade: grade,
          isLiked,
          isRetweeted,
          isBookmarked,
        };
      })
    );
  };

  const handleSaveToSwipeFile = (tweet: Tweet) => {
    if (savedTweets.some((st) => st.id === tweet.id)) return;
    setSavedTweets((prev) => [tweet, ...prev]);
  };

  const handleOpenRemixForText = (text: string) => {
    setRemixText(text);
    setRemixTweet(null);
  };

  const handleOpenRemixForTweet = (tweet: Tweet) => {
    setRemixText(tweet.text);
    setRemixTweet(tweet);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-[#1d9bf0]/30 transition-colors ${
      isDark ? 'bg-[#000000] text-[#eff3f4]' : 'bg-[#f7f9f9] text-gray-900'
    }`}>
      {/* Top App Bar */}
      <Navbar
        activeView={activeView}
        setActiveView={(v) => {
          if (v === 'export') {
            setIsExportModalOpen(true);
          } else {
            setActiveView(v);
          }
        }}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenMediaKit={() => setIsMediaKitModalOpen(true)}
        onOpenTracker={() => setIsTrackerModalOpen(true)}
        totalAnalyzed={tweets.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        license={license}
      />

      {/* NotesIQ Style Landing Page View */}
      {activeView === 'landing' && (
        <LandingPageView
          onOpenApp={() => setActiveView('split')}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenPricing={() => setIsPricingModalOpen(true)}
          onOpenTracker={() => setIsTrackerModalOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          license={license}
        />
      )}

      {/* Chrome Web Store Detail View */}
      {activeView === 'webstore' && (
        <ChromeWebStoreView
          onOpenLiveFeed={() => setActiveView('split')}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          weights={weights}
          onSelectTweetForDiagnostic={(tweet) => setSelectedTweetForDiag(tweet)}
          theme={theme}
        />
      )}

      {/* Main Workspace (Feed & Side Panel Simulator) */}
      {activeView !== 'webstore' && activeView !== 'landing' && (
        <main className="max-w-[1600px] mx-auto flex justify-center">
          {/* Feed Column (visible in split or feed view) */}
          {(activeView === 'split' || activeView === 'feed') && (
            <div className={`w-full ${activeView === 'split' ? 'lg:flex-1' : 'max-w-2xl'}`}>
              <TwitterFeed
                tweets={tweets}
                onSelectTweetForDiagnostic={(tweet) => setSelectedTweetForDiag(tweet)}
                onSelectTweetForRemix={handleOpenRemixForTweet}
                onSaveToSwipeFile={handleSaveToSwipeFile}
                onPublishNewTweet={handlePublishNewTweet}
                weights={weights}
                onUpdateTweetMetrics={handleUpdateTweetMetrics}
                theme={theme}
              />
            </div>
          )}

          {/* Side Panel Column (visible in split or panel view) */}
          {(activeView === 'split' || activeView === 'panel') && (
            <div className={activeView === 'panel' ? 'w-full max-w-2xl mx-auto' : ''}>
              <TweetIQSidePanel
                weights={weights}
                onUpdateWeights={setWeights}
                savedTweets={savedTweets}
                onPublishFromStudio={handlePublishNewTweet}
                onOpenExportModal={() => setIsExportModalOpen(true)}
                onOpenRemixForText={handleOpenRemixForText}
                activeSideTab={activeSideTab}
                setActiveSideTab={setActiveSideTab}
                theme={theme}
                license={license}
                onOpenPricing={() => setIsPricingModalOpen(true)}
                onOpenMediaKit={() => setIsMediaKitModalOpen(true)}
                onOpenTracker={() => setIsTrackerModalOpen(true)}
                allFeedTweets={tweets}
              />
            </div>
          )}
        </main>
      )}

      {/* Deep Diagnostic Modal */}
      {selectedTweetForDiag && (
        <DiagnosticModal
          tweet={selectedTweetForDiag}
          onClose={() => setSelectedTweetForDiag(null)}
          weights={weights}
          onLoadIntoStudio={() => {
            setActiveSideTab('write');
            setActiveView('split');
          }}
          onOpenRemix={(tweet) => {
            setSelectedTweetForDiag(null);
            handleOpenRemixForTweet(tweet);
          }}
          theme={theme}
        />
      )}

      {/* Viral Hook Remix Modal */}
      {remixText && (
        <HookRemixModal
          sourceText={remixText}
          sourceTweet={remixTweet}
          onClose={() => {
            setRemixText(null);
            setRemixTweet(null);
          }}
          onLoadIntoStudio={() => {
            setActiveSideTab('write');
            setActiveView('split');
          }}
          onPublishDirectly={(hookText) => {
            handlePublishNewTweet(hookText);
          }}
          theme={theme}
        />
      )}

      {/* Export Chrome Extension Modal */}
      <ChromeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        theme={theme}
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        license={license}
        onUpdateLicense={setLicense}
        theme={theme}
      />

      {/* Sponsor Media Kit Modal */}
      <MediaKitModal
        isOpen={isMediaKitModalOpen}
        onClose={() => setIsMediaKitModalOpen(false)}
        theme={theme}
        topTweets={tweets.slice(0, 3)}
      />

      {/* Engagement Tracker Modal */}
      {isTrackerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className={`w-full max-w-3xl rounded-2xl overflow-hidden border shadow-2xl h-[90vh] flex flex-col ${
            isDark ? 'border-[#2f3336] bg-[#000000]' : 'border-gray-200 bg-white'
          }`}>
            <EngagementTracker
              theme={theme}
              feedTweets={tweets}
              onClose={() => setIsTrackerModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}


