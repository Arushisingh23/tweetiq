export interface TweetAuthor {
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  isCreatorBadge?: boolean;
  bio?: string;
  followers?: string;
}

export interface TweetMetrics {
  likes: number;
  retweets: number;
  replies: number;
  bookmarks: number;
  impressions: number;
}

export interface Tweet {
  id: string;
  author: TweetAuthor;
  text: string;
  timestamp: string;
  metrics: TweetMetrics;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'poll' | 'chart';
  pollOptions?: { label: string; votesPercent: number }[];
  isThread?: boolean;
  threadCount?: number;
  viralScore: number;
  hookGrade: string;
  category: 'Tech & AI' | 'Indie Hacking' | 'SaaS & Growth' | 'Writing' | 'Design & Product' | 'Hiring' | 'Educational';
  postTag?: 'hiring' | 'educational' | 'general';
  isUserPosted?: boolean;
  isLiked?: boolean;
  isRetweeted?: boolean;
  isBookmarked?: boolean;
  outboundUrl?: string;
  contentType?: 'Personal Story' | 'Question & Poll' | 'List & Framework' | 'Quote & Repost' | 'Data & Observation';
  createdAtDaysAgo?: number;
}

export interface ViralAnalysis {
  viralScore: number;
  hookGrade: string;
  hookSummary: string;
  strengths: string[];
  weaknesses: string[];
  recommendedAction: string;
  bestAlternativeHook: string;
  algorithmBreakdown?: {
    bookmarkBonus: number;
    repostMultiplier: number;
    replyEngagement: number;
    formattingScore: number;
    linkPenalty: number;
  };
}

export interface HookVariation {
  style: string;
  hook: string;
  projectedScore: number;
  reasoning: string;
}

export interface ViralTemplate {
  id: string;
  title: string;
  archetype: string;
  category: string;
  avgViralScore: number;
  hookFormula: string;
  example: string;
  breakdown: string;
}

export interface AlgorithmWeights {
  bookmarkWeight: number; // e.g. 5.0x
  retweetWeight: number;  // e.g. 3.0x
  replyWeight: number;    // e.g. 2.0x
  likeWeight: number;     // e.g. 1.0x
  linkSuppressionPenalty: number; // e.g. -20 pts
  mediaBoost: number;     // e.g. +12 pts
}

export type ThemeMode = 'dark' | 'light';

export interface ScheduledTweet {
  id: string;
  text: string;
  scheduledTime: string; // e.g. "Tomorrow, 8:45 AM"
  slotName: 'Morning Peak' | 'Mid-Day Lunch' | 'Afternoon Coffee' | 'Evening Prime' | 'Night Owl' | 'Early Bird';
  dayOfWeek: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  status: 'queued' | 'ready' | 'posted';
  projectedReach: string;
  contentType: 'Personal Story' | 'Question & Poll' | 'List & Framework' | 'Quote & Repost' | 'Data & Observation';
}

export interface ContentTypeStat {
  type: 'Personal Story' | 'Question & Poll' | 'List & Framework' | 'Quote & Repost' | 'Data & Observation';
  count: number;
  avgLikes: number;
  avgBookmarks: number;
  avgEngagementRate: string;
  statusTag: 'Top Performer' | 'High Retention' | 'Viral Magnet' | 'Consistent' | 'Steady';
}

export interface FollowerDataPoint {
  date: string;
  followers: number;
  netChange: number;
}

export interface CompetitorProfile {
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  followers: string;
  postFrequency: string;
  avgViralScore: number;
  topContentType: string;
  bestTimeSlot: string;
  contentMix: { label: string; percentage: number; color: string }[];
  recentTopHooks: string[];
}

export interface TopFan {
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  followers: string;
  retweetsCount: number;
  repliesCount: number;
  quotesCount: number;
  totalInteractions: number;
  tier: 'Superfan' | 'Key Amplification' | 'High Engager';
  lastActive: string;
}

export interface PromptTemplateItem {
  id: string;
  title: string;
  description: string;
  category: 'Viral Hook' | 'Story Arc' | 'Thread Expander' | 'Audience Conversion' | 'Repurposing';
  prompt: string;
  dynamicTokens: string[];
}

export interface LicenseState {
  hasLifetime: boolean; // $29 one-time
  hasAIPro: boolean;    // $9/month
}

export interface DailyEngagementLog {
  id: string;
  date: string;          // e.g. "2026-09-27"
  displayDate: string;   // e.g. "Sep 27"
  followers: number;     // e.g. 14820
  netFollowersChange: number; // e.g. +48
  avgViralScore: number; // e.g. 88 (0-100)
  avgBookmarks: number;  // e.g. 145
  avgLikes: number;      // e.g. 480
  avgRetweets: number;   // e.g. 74
  avgImpressions: number;// e.g. 16200
  tweetsCount: number;   // e.g. 3
  notes?: string;
}

export interface GrammarIssue {
  id: string;
  original: string;
  replacement: string;
  explanation: string;
  type: 'grammar' | 'spelling' | 'punctuation' | 'clarity' | 'wordiness';
}

export interface GrammarCheckResult {
  hasIssues: boolean;
  score: number; // 0 to 100 grammar & clarity score
  cleanText: string;
  issues: GrammarIssue[];
  summary: string;
}

