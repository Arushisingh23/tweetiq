import { 
  ScheduledTweet, 
  ContentTypeStat, 
  FollowerDataPoint, 
  CompetitorProfile, 
  TopFan, 
  PromptTemplateItem,
  Tweet
} from '../types';

export const INITIAL_SCHEDULED_QUEUE: ScheduledTweet[] = [
  {
    id: 'sched-1',
    text: `The single biggest mistake builders make with the new X algorithm:\n\nPutting the link in the main post.\n\nHere is how to get 4x more impressions by moving links to the first reply 🧵👇`,
    scheduledTime: 'Tomorrow at 8:45 AM',
    slotName: 'Morning Peak',
    dayOfWeek: 'Fri',
    status: 'queued',
    projectedReach: '38K - 65K impressions',
    contentType: 'List & Framework',
  },
  {
    id: 'sched-2',
    text: `2 years ago, I didn't know how to write an opener that stopped the scroll.\n\nToday, our posts average 2,400+ bookmarks.\n\nThe 3 rules I tell every friend who asks:`,
    scheduledTime: 'Saturday at 11:30 AM',
    slotName: 'Mid-Day Lunch',
    dayOfWeek: 'Sat',
    status: 'queued',
    projectedReach: '22K - 45K impressions',
    contentType: 'Personal Story',
  },
  {
    id: 'sched-3',
    text: `Quick poll for builders:\n\nWhat is your #1 bottleneck right now?\n1. Distribution & Reach\n2. Product-Market Fit\n3. Engineering velocity\n4. Monetization`,
    scheduledTime: 'Monday at 9:00 AM',
    slotName: 'Morning Peak',
    dayOfWeek: 'Mon',
    status: 'queued',
    projectedReach: '18K - 32K impressions',
    contentType: 'Question & Poll',
  },
  {
    id: 'sched-4',
    text: `Save this before your next launch 📌\n\nThe 10-point checklist we used to hit #1 on Product Hunt and 12,000 site visits in 24 hours:`,
    scheduledTime: 'Tuesday at 1:15 PM',
    slotName: 'Afternoon Coffee',
    dayOfWeek: 'Tue',
    status: 'queued',
    projectedReach: '45K - 80K impressions',
    contentType: 'List & Framework',
  },
];

export const CONTENT_TYPE_BREAKDOWN: ContentTypeStat[] = [
  {
    type: 'List & Framework',
    count: 48,
    avgLikes: 1840,
    avgBookmarks: 2950,
    avgEngagementRate: '4.8%',
    statusTag: 'Viral Magnet',
  },
  {
    type: 'Data & Observation',
    count: 32,
    avgLikes: 2150,
    avgBookmarks: 2420,
    avgEngagementRate: '4.2%',
    statusTag: 'Top Performer',
  },
  {
    type: 'Personal Story',
    count: 28,
    avgLikes: 2980,
    avgBookmarks: 1420,
    avgEngagementRate: '3.9%',
    statusTag: 'High Retention',
  },
  {
    type: 'Question & Poll',
    count: 19,
    avgLikes: 890,
    avgBookmarks: 310,
    avgEngagementRate: '3.1%',
    statusTag: 'Consistent',
  },
  {
    type: 'Quote & Repost',
    count: 15,
    avgLikes: 640,
    avgBookmarks: 180,
    avgEngagementRate: '2.4%',
    statusTag: 'Steady',
  },
];

export const FOLLOWER_GROWTH_HISTORY: FollowerDataPoint[] = [
  { date: 'Sep 1', followers: 21850, netChange: 45 },
  { date: 'Sep 5', followers: 22120, netChange: 68 },
  { date: 'Sep 9', followers: 22480, netChange: 90 },
  { date: 'Sep 13', followers: 22940, netChange: 115 },
  { date: 'Sep 17', followers: 23510, netChange: 142 },
  { date: 'Sep 21', followers: 24180, netChange: 168 },
  { date: 'Sep 24', followers: 24520, netChange: 85 },
];

export const EVERGREEN_TWEETS_RECYCLER: Tweet[] = [
  {
    id: 'old-1',
    author: {
      name: 'You (Creator)',
      handle: 'alex_growth',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '24.5K',
    },
    text: `The 5 most dangerous advice given to first-time founders:\n\n1. "Build it and they will come"\n2. "Raise VC as early as possible"\n3. "Don't talk to customers until the MVP is perfect"\n4. "Focus only on vanity views"\n5. "Wait until you're ready"\n\nWhich one did you fall for first?`,
    timestamp: '72 days ago',
    metrics: {
      likes: 3120,
      retweets: 540,
      replies: 280,
      bookmarks: 3900,
      impressions: 210000,
    },
    viralScore: 95,
    hookGrade: 'A+',
    category: 'Indie Hacking',
    contentType: 'List & Framework',
    createdAtDaysAgo: 72,
  },
  {
    id: 'old-2',
    author: {
      name: 'You (Creator)',
      handle: 'alex_growth',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '24.5K',
    },
    text: `How I organize my entire week as a solo founder making $15k/mo:\n\n• Mon: Deep code & product\n• Tue: Customer demos & support\n• Wed: Marketing & content batching\n• Thu: Bug fixes & analytics\n• Fri: Future planning\n• Sat-Sun: Unplug\n\nStructure creates freedom.`,
    timestamp: '88 days ago',
    metrics: {
      likes: 4210,
      retweets: 710,
      replies: 195,
      bookmarks: 5120,
      impressions: 290000,
    },
    viralScore: 97,
    hookGrade: 'A+',
    category: 'SaaS & Growth',
    contentType: 'Personal Story',
    createdAtDaysAgo: 88,
  },
  {
    id: 'old-3',
    author: {
      name: 'You (Creator)',
      handle: 'alex_growth',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '24.5K',
    },
    text: `Most productivity advice is written by people with no real responsibilities.\n\nIf you have a business to run, here are 3 micro-rules that actually save 10 hours a week:\n\n1. No meetings before 1 PM\n2. Asynchronous Loom videos instead of calls\n3. Zero Slack on phone`,
    timestamp: '110 days ago',
    metrics: {
      likes: 2450,
      retweets: 380,
      replies: 142,
      bookmarks: 3180,
      impressions: 165000,
    },
    viralScore: 91,
    hookGrade: 'A',
    category: 'Writing',
    contentType: 'Data & Observation',
    createdAtDaysAgo: 110,
  },
];

export const COMPETITOR_PROFILES: CompetitorProfile[] = [
  {
    handle: 'levelsio',
    name: 'Pieter Levels',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    bio: 'Bootstrapping startups in public. Nomad List, Remote OK, PhotoAI.',
    followers: '512K',
    postFrequency: '4.2 tweets / day',
    avgViralScore: 94,
    topContentType: 'Data / Revenue Screenshots',
    bestTimeSlot: '3:00 PM CET / 9:00 AM EST',
    contentMix: [
      { label: 'Data & Revenue', percentage: 55, color: '#10b981' },
      { label: 'Contrarian Takes', percentage: 25, color: '#f59e0b' },
      { label: 'Questions / Polls', percentage: 20, color: '#3b82f6' },
    ],
    recentTopHooks: [
      'Just crossed $112k/mo with 0 employees and 1 server.',
      'Unpopular opinion on AI: Most wrapper startups will win against incumbent giants.',
      'What is your favorite stack for shipping an MVP in 24 hours?',
    ],
  },
  {
    handle: 'paulg',
    name: 'Paul Graham',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    bio: 'Founder Y Combinator. Essays at paulgraham.com',
    followers: '1.9M',
    postFrequency: '1.8 tweets / day',
    avgViralScore: 96,
    topContentType: 'Contrarian Observations',
    bestTimeSlot: '8:30 AM EST',
    contentMix: [
      { label: 'Contrarian Epigrams', percentage: 65, color: '#8b5cf6' },
      { label: 'Essays & Teardowns', percentage: 25, color: '#06b6d4' },
      { label: 'Historical Observations', percentage: 10, color: '#ec4899' },
    ],
    recentTopHooks: [
      'The most dangerous kind of dishonesty is honesty about the wrong things.',
      'When you see a startup doing something that seems crazy, ask what they know that you do not.',
      'A counterintuitive fact about high agency founders:',
    ],
  },
  {
    handle: 'shl',
    name: 'Sahil Lavingia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    bio: 'Founder Gumroad. Writing about profitability and creator economy.',
    followers: '325K',
    postFrequency: '2.5 tweets / day',
    avgViralScore: 92,
    topContentType: 'Personal Story & Creator Playbooks',
    bestTimeSlot: '11:00 AM EST',
    contentMix: [
      { label: 'Creator Economics', percentage: 45, color: '#10b981' },
      { label: 'Personal Story', percentage: 35, color: '#3b82f6' },
      { label: 'Product Frameworks', percentage: 20, color: '#f59e0b' },
    ],
    recentTopHooks: [
      'We paid out $180M to creators last year. The top 1% all share this one distribution strategy.',
      'How we run Gumroad with 0 full-time employees.',
      'Don’t build what people say they want. Build what they are already paying for.',
    ],
  },
];

export const TOP_FANS_LEADERBOARD: TopFan[] = [
  {
    handle: 'tech_insider_dan',
    name: 'Dan Foster',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    bio: 'Product manager & indie hacker. Tweets about UX teardowns.',
    followers: '18.4K',
    retweetsCount: 38,
    repliesCount: 42,
    quotesCount: 14,
    totalInteractions: 94,
    tier: 'Superfan',
    lastActive: '2h ago',
  },
  {
    handle: 'clara_designs',
    name: 'Clara Wu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    bio: 'Design systems lead at scale. Minimalist aesthetics.',
    followers: '42.1K',
    retweetsCount: 29,
    repliesCount: 31,
    quotesCount: 9,
    totalInteractions: 69,
    tier: 'Key Amplification',
    lastActive: '6h ago',
  },
  {
    handle: 'saas_marcus',
    name: 'Marcus Bell',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    bio: 'Building micro-SaaS to $20k MRR. Public growth metrics.',
    followers: '12.8K',
    retweetsCount: 24,
    repliesCount: 35,
    quotesCount: 7,
    totalInteractions: 66,
    tier: 'High Engager',
    lastActive: '1d ago',
  },
  {
    handle: 'ai_emily',
    name: 'Emily Thornton',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    bio: 'AI researcher and prompt engineer.',
    followers: '28.9K',
    retweetsCount: 18,
    repliesCount: 22,
    quotesCount: 11,
    totalInteractions: 51,
    tier: 'Key Amplification',
    lastActive: '1d ago',
  },
  {
    handle: 'growth_alex',
    name: 'Alex Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    bio: 'Growth consultant. Testing outbound vs inbound loops.',
    followers: '9.2K',
    retweetsCount: 16,
    repliesCount: 25,
    quotesCount: 4,
    totalInteractions: 45,
    tier: 'High Engager',
    lastActive: '3d ago',
  },
];

export const PROMPT_TEMPLATES: PromptTemplateItem[] = [
  {
    id: 'pt-1',
    title: 'The Viral Hook Multiplier (10 Angles)',
    description: 'Feeds your core premise and generates 10 distinct X algorithmic hooks with high curiosity gaps.',
    category: 'Viral Hook',
    dynamicTokens: ['[YOUR_TOP_TWEET]', '[CORE_TOPIC]'],
    prompt: `You are an elite ghostwriter for high-growth creators on Twitter/X.
Here is my top-performing tweet:
"[YOUR_TOP_TWEET]"

And here is the new topic I want to tweet about:
"[CORE_TOPIC]"

Generate 10 viral hooks for this new topic. Each hook must:
1. Be strictly 1 to 3 lines long.
2. Exploit one of these archetypes: Contrarian, Hard Metric, Bookmark Trap, or Zero-to-Hero.
3. Contain ZERO hashtags, ZERO cringe buzzwords, and ZERO outbound links.
4. Have high whitespace formatting that stops mobile feed scrolling.`,
  },
  {
    id: 'pt-2',
    title: 'The Contrarian Paradox Reframer',
    description: 'Takes a common piece of advice and shatters it with an counter-intuitive truth that drives replies.',
    category: 'Viral Hook',
    dynamicTokens: ['[COMMON_BELIEF]', '[YOUR_COUNTER_TAKE]'],
    prompt: `Act as a senior intellectual provocateur and algorithmic strategist on X.
Analyze this commonly accepted belief in my industry:
"[COMMON_BELIEF]"

My counter-intuitive perspective:
"[YOUR_COUNTER_TAKE]"

Draft 5 short tweets (under 280 characters each) that open with a bold pattern interrupt, expose the hidden flaw in the common belief, and leave an open curiosity loop that forces readers to reply or bookmark.`,
  },
  {
    id: 'pt-3',
    title: 'The 7-Part Viral Thread Expander',
    description: 'Transforms a single high-performing hook into a complete 7-tweet value-packed thread.',
    category: 'Thread Expander',
    dynamicTokens: ['[HOOK_TWEET]', '[VALUE_POINTS]'],
    prompt: `You are writing a viral educational thread on Twitter/X.
Starting Hook (Post #1):
"[HOOK_TWEET]"

Key lessons to cover:
"[VALUE_POINTS]"

Rules for the thread:
- Post 1: The Hook (must end with "🧵👇")
- Post 2: The Context/Problem (why 90% struggle)
- Post 3-6: Actionable Frameworks with concise bullet points and whitespace
- Post 7: Synthesis & Call-To-Action (remind them to bookmark Post #1 and follow for more).
Never use corporate jargon. Write at an 8th-grade reading level.`,
  },
  {
    id: 'pt-4',
    title: 'The Evergreen Story Arc (Zero-to-Hero)',
    description: 'Takes your personal milestone and structures it into an authentic transformation story.',
    category: 'Story Arc',
    dynamicTokens: ['[PAST_STRUGGLE]', '[CURRENT_OUTCOME]', '[3_LESSONS]'],
    prompt: `Structure a high-converting personal transformation tweet for X using this data:
- Past struggle (2-3 years ago): "[PAST_STRUGGLE]"
- Current outcome today: "[CURRENT_OUTCOME]"
- Key 3 lessons: "[3_LESSONS]"

Format:
Line 1: Contrast anchor between then and now.
Line 2: Blank line.
Line 3-5: Clean bullet points with concrete metrics ($ or hours or users).
Line 6: Punchy 1-sentence takeaway.`,
  },
  {
    id: 'pt-5',
    title: 'The Bookmark Goldmine Framework',
    description: 'Formats a curated resource, tool list, or mental model to trigger X\'s 5x bookmark weighting.',
    category: 'Audience Conversion',
    dynamicTokens: ['[CURATED_TOPIC]', '[LIST_OF_ITEMS]'],
    prompt: `Create a high-bookmark post on X for:
Topic: "[CURATED_TOPIC]"
Items: "[LIST_OF_ITEMS]"

Instruction:
Begin with an explicit reminder to bookmark ("Bookmark this before you forget 📌" or "Save this for your next build").
Follow with a high-stakes promise ("7 free resources that replace a $10,000 course").
Number each item with 1 concise benefit line per item. Keep total post under 275 characters or craft as a 2-part tweet.`,
  },
  {
    id: 'pt-6',
    title: 'The Quantitative Teardown Formatter',
    description: 'Extracts real numbers and converts them into an authoritative case study.',
    category: 'Viral Hook',
    dynamicTokens: ['[METRICS_AND_HOURS]', '[RESULT]'],
    prompt: `Format this raw data into an authoritative case study tweet for Twitter/X:
Data: "[METRICS_AND_HOURS]"
Result: "[RESULT]"

Requirements:
- Emphasize the disproportionate effort or time spent (e.g. "I spent 300 hours analyzing 500 pitches").
- State the 1 surprising statistical finding in line 2.
- Provide a clear 3-bullet breakdown.
- Ensure the tweet reads cleanly in under 15 seconds.`,
  },
  {
    id: 'pt-7',
    title: 'The Curiosity Gap Polisher',
    description: 'Audits a weak, dry tweet and injects an irresistible cliffhanger loop.',
    category: 'Viral Hook',
    dynamicTokens: ['[EXISTING_DRAFT]'],
    prompt: `Review this draft tweet that currently feels too dry or flat:
"[EXISTING_DRAFT]"

Rewrite it 5 times:
1. The Teaser Hook (hints at a secret without giving it away immediately)
2. The Question Trap (asks something 95% think they know, but get wrong)
3. The Speed Run (promises the fastest solution to an annoying problem)
4. The Confession Hook (admits a costly mistake)
5. The Visual Framework (structures the takeaway into a mini ASCII matrix or bullets)`,
  },
  {
    id: 'pt-8',
    title: 'The Algorithm-Safe First-Comment Plug',
    description: 'Drafts a seamless follow-up reply that pitches your product without hurting the parent post.',
    category: 'Repurposing',
    dynamicTokens: ['[PRODUCT_NAME]', '[PRODUCT_URL]', '[VALUE_PROPOSITION]'],
    prompt: `Write 3 versions of a natural, high-converting "First Reply / Plug" for my tweet on X:
Product: "[PRODUCT_NAME]"
URL: "[PRODUCT_URL]"
Value Proposition: "[VALUE_PROPOSITION]"

Ensure it doesn't sound spammy. It should thank the reader for reading, provide an extra micro-tip, and casually invite them to test the product with zero pressure.`,
  },
];
