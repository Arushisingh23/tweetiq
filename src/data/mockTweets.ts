import { Tweet } from '../types';

export const INITIAL_TWEETS: Tweet[] = [
  {
    id: 'tweet-1',
    author: {
      name: 'Alex Rivera',
      handle: 'alexrivera_io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '84.2K',
      bio: 'Building SaaS to $100k MRR in public. Engineering & Growth.',
    },
    text: `I spent 400+ hours dissecting the top 100 fastest-growing open source repositories on GitHub.

92% of them follow the exact same 4-part architecture for their landing page.

Here is the full breakdown you can copy this weekend 🧵👇`,
    timestamp: '2h',
    metrics: {
      likes: 1840,
      retweets: 412,
      replies: 128,
      bookmarks: 3290,
      impressions: 142000,
    },
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    mediaType: 'chart',
    isThread: true,
    threadCount: 7,
    viralScore: 96,
    hookGrade: 'A+',
    category: 'Educational',
    postTag: 'educational',
  },
  {
    id: 'tweet-hire-1',
    author: {
      name: 'Sarah Connor',
      handle: 'sarah_scale',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '62.4K',
      bio: 'Co-founder & CEO @ PulseAI (YC W24). We build autonomous support agents.',
    },
    text: `🚨 We are HIRING our Founding Full-Stack Engineer ($160k - $210k + 1.5% equity).

Stack: TypeScript, Next.js, Python, PostgreSQL, Redis.

Why join:
• 100% remote anywhere in the world
• Async-first culture (no standup fatigue)
• Direct ownership of customer-facing AI agents
• $4M seed backed by tier-1 funds

If you love shipping fast and crafting clean UI, DM me your GitHub or favorite project!`,
    timestamp: '3h',
    metrics: {
      likes: 840,
      retweets: 245,
      replies: 182,
      bookmarks: 410,
      impressions: 68000,
    },
    viralScore: 91,
    hookGrade: 'A',
    category: 'Hiring',
    postTag: 'hiring',
  },
  {
    id: 'tweet-2',
    author: {
      name: 'Sarah Chen',
      handle: 'sarahcodes',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '142K',
      bio: 'Staff AI Engineer. Writing about LLM evals and small models.',
    },
    text: `Unpopular opinion: 

95% of companies trying to train a custom LLM from scratch are wasting $250k+.

A properly evaluated, prompt-engineered pipeline with vector reranking beats fine-tuned weights 8 out of 10 times in production.

Save your runway.`,
    timestamp: '5h',
    metrics: {
      likes: 3410,
      retweets: 680,
      replies: 420,
      bookmarks: 2150,
      impressions: 260000,
    },
    viralScore: 94,
    hookGrade: 'A',
    category: 'Educational',
    postTag: 'educational',
  },
  {
    id: 'tweet-hire-2',
    author: {
      name: 'Jason Sterling',
      handle: 'jasonproduct',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '45.1K',
      bio: 'Head of Product @ LinearFlow. Designing developer productivity tools.',
    },
    text: `🚀 Hiring alert: We're looking for a Senior Product Designer ($140k - $175k + equity).

You will lead design across our entire browser extension and dashboard suite.

We look for:
1. Deep obsession with typography & whitespace
2. Mastery of keyboard shortcuts & micro-interactions
3. Ability to prototype in Figma and write clean CSS

Apply here: https://linearflow.app/careers or drop your portfolio in my DMs 👇`,
    timestamp: '6h',
    metrics: {
      likes: 620,
      retweets: 180,
      replies: 94,
      bookmarks: 380,
      impressions: 52000,
    },
    outboundUrl: 'https://linearflow.app/careers',
    viralScore: 89,
    hookGrade: 'A-',
    category: 'Hiring',
    postTag: 'hiring',
  },
  {
    id: 'tweet-edu-db',
    author: {
      name: 'Devon Patel',
      handle: 'devon_systems',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '98.5K',
      bio: 'Distributed Systems & Database Reliability Engineer.',
    },
    text: `How PostgreSQL indexing actually works under the hood (and why 80% of queries run slow):

1. B-Tree: Default index. Perfect for equality (=) and range queries (<, >).
2. GIN Index: Essential for JSONB and array tag searches (50x speedup).
3. Partial Index: "WHERE is_active = true" saves 90% disk space & cache.
4. Composite Ordering: (tenant_id, created_at) matters! Leftmost prefix rule.

Save this cheatsheet for your next architecture review 🧵`,
    timestamp: '8h',
    metrics: {
      likes: 4120,
      retweets: 870,
      replies: 142,
      bookmarks: 6410,
      impressions: 310000,
    },
    mediaUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    mediaType: 'chart',
    isThread: true,
    threadCount: 5,
    viralScore: 98,
    hookGrade: 'A+',
    category: 'Educational',
    postTag: 'educational',
  },
  {
    id: 'tweet-3',
    author: {
      name: 'David Vance',
      handle: 'dvancetech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      verified: false,
      followers: '12.4K',
      bio: 'Fullstack developer & indie maker.',
    },
    text: `Just released our new Chrome extension! Check it out here: https://mycooltool.example.com/download

Let me know what you think of the new dashboard design. Feedback is appreciated!`,
    timestamp: '9h',
    metrics: {
      likes: 18,
      retweets: 2,
      replies: 4,
      bookmarks: 1,
      impressions: 1100,
    },
    outboundUrl: 'https://mycooltool.example.com/download',
    viralScore: 42,
    hookGrade: 'D',
    category: 'Indie Hacking',
    postTag: 'general',
  },
  {
    id: 'tweet-hire-3',
    author: {
      name: 'Maya Lin',
      handle: 'mayadev',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '33.2K',
      bio: 'Building WebGL developer tools. Angel investor.',
    },
    text: `💰 Contract Bounty Hiring ($4,500 - 10 day sprint):

Looking for a performance-obsessed React & Canvas/Three.js engineer to eliminate frame drops in our infinite canvas app.

Requirements:
• Experience with Chrome DevTools Performance profiler
• OffscreenCanvas & Web Worker threading
• Available to start immediately

DM with a link to something smooth you built! ⚡`,
    timestamp: '10h',
    metrics: {
      likes: 490,
      retweets: 130,
      replies: 62,
      bookmarks: 290,
      impressions: 41000,
    },
    viralScore: 87,
    hookGrade: 'B+',
    category: 'Hiring',
    postTag: 'hiring',
  },
  {
    id: 'tweet-4',
    author: {
      name: 'Elena Rostova',
      handle: 'elenadesigns',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '56.9K',
      bio: 'Design lead & typography nerd. Minimalist UI/UX.',
    },
    text: `The difference between junior and senior UI design in 1 sentence:

Junior designers look for cool things to add.
Senior designers look for distractions to remove.

Here are 5 before/after examples that will change how you design buttons forever:`,
    timestamp: '11h',
    metrics: {
      likes: 5200,
      retweets: 940,
      replies: 165,
      bookmarks: 4890,
      impressions: 380000,
    },
    mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    isThread: true,
    threadCount: 6,
    viralScore: 98,
    hookGrade: 'A+',
    category: 'Educational',
    postTag: 'educational',
  },
  {
    id: 'tweet-edu-models',
    author: {
      name: 'Marcus Brody',
      handle: 'marcusbuilds',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '31.5K',
      bio: 'Indie maker with 4 micro-SaaS apps. $18k MRR.',
    },
    text: `5 mental models that replaced 90% of my startup business books:

1. Gall's Law: Complex systems that work always evolved from simple systems.
2. Inversion Principle: Instead of asking how to win, ask what guarantees failure and eliminate it.
3. The Lindy Effect: Ideas that survived 20 years will outlive trends that started yesterday.
4. Regret Minimization: Choose what you won't regret at age 80.
5. Goodhart's Law: When a metric becomes the target, it ceases to be a good metric.

Bookmark this for your next strategic crossroads 📌`,
    timestamp: '14h',
    metrics: {
      likes: 3890,
      retweets: 620,
      replies: 110,
      bookmarks: 5120,
      impressions: 245000,
    },
    viralScore: 95,
    hookGrade: 'A',
    category: 'Educational',
    postTag: 'educational',
  },
  {
    id: 'tweet-5',
    author: {
      name: 'Marcus Brody',
      handle: 'marcusbuilds',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      verified: true,
      followers: '31.5K',
      bio: 'Indie maker with 4 micro-SaaS apps. $18k MRR.',
    },
    text: `In 2021, I made $0 online and worked 60 hours a week as a burned out dev.

Last month:
• 4 micro-SaaS products
• $18,450 MRR (84% profit margin)
• 18 hours worked per week

Here is the exact zero-code stack and distribution playbook I used:`,
    timestamp: '1d',
    metrics: {
      likes: 2950,
      retweets: 480,
      replies: 190,
      bookmarks: 3820,
      impressions: 215000,
    },
    viralScore: 93,
    hookGrade: 'A',
    category: 'Educational',
    postTag: 'educational',
  },
  {
    id: 'tweet-6',
    author: {
      name: 'Julian Sterling',
      handle: 'julianwrites',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
      verified: false,
      followers: '9.8K',
      bio: 'Writing on clarity, concise communication, and essays.',
    },
    text: `How to write so clearly that people can’t misunderstand you:

1. Never use two words when one suffices
2. Cut every adverb ending in -ly
3. Write the conclusion in line 1
4. Kill the throat-clearing intro
5. Read it out loud at 2x speed`,
    timestamp: '1d',
    metrics: {
      likes: 1420,
      retweets: 290,
      replies: 54,
      bookmarks: 1840,
      impressions: 98000,
    },
    viralScore: 88,
    hookGrade: 'A-',
    category: 'Educational',
    postTag: 'educational',
  },
];
