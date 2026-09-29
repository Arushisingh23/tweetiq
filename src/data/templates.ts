import { ViralTemplate } from '../types';

export const VIRAL_TEMPLATES: ViralTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'The "100+ Hours Teardown" Framework',
    archetype: 'Curated Research',
    category: 'Tech & Growth',
    avgViralScore: 96,
    hookFormula: `I spent [X00] hours analyzing [Large Number] [Target Entity].

[Surprising %] of them did [Unexpected finding].

Here are the [Number] key takeaways you can steal today 🧵👇`,
    example: `I spent 250 hours analyzing 500 YC founder pitches.

89% of accepted decks followed the exact same 3-minute problem framing.

Here is the 10-slide teardown you can steal today 🧵👇`,
    breakdown: 'Triggers intense curiosity + high bookmark urgency by conveying immense condensed labor.',
  },
  {
    id: 'tmpl-2',
    title: 'The "Unpopular Truth / Contrarian Belief"',
    archetype: 'Pattern Interrupt',
    category: 'Tech & AI',
    avgViralScore: 94,
    hookFormula: `Unpopular opinion:\n\n[Commonly accepted industry advice] is actually a trap for 90% of people.\n\nHere is why (and what top 1% do instead):`,
    example: `Unpopular opinion:\n\nWaking up at 5 AM and reading 50 books a year is productive procrastination.\n\nShipping 1 real feature and getting 10 customer calls beats 100 morning routines.`,
    breakdown: 'Shatters social echo chambers and creates debate in replies, triggering algorithmic conversation score.',
  },
  {
    id: 'tmpl-3',
    title: 'The "Zero-to-Hero Transformation Arc"',
    archetype: 'Personal Story',
    category: 'Indie Hacking',
    avgViralScore: 92,
    hookFormula: `[Past year]: [Painful, relatable state, 0 metrics]\n\n[Current year]:\n• [Metric 1]\n• [Metric 2]\n• [Freedom/Lifestyle metric]\n\nHere are the [Number] non-obvious rules that flipped the switch:`,
    example: `2 years ago: $0 revenue, 60 rejected job applications, living on instant noodles.\n\nLast month:\n• $24,500 MRR\n• 1 solo developer\n• 4-day work week\n\nHere are the 4 non-obvious rules that flipped the switch:`,
    breakdown: 'Extreme contrast between past pain and current freedom triggers emotional admiration and bookmarks.',
  },
  {
    id: 'tmpl-4',
    title: 'The "Bookmark Goldmine" Masterlist',
    archetype: 'High-Value Curation',
    category: 'SaaS & Growth',
    avgViralScore: 97,
    hookFormula: `Bookmark this before it gets lost in your feed 📌\n\n[Number] free tools that will save you [Number] hours every week:\n\n(Most people have only heard of #1)`,
    example: `Bookmark this before it gets lost in your feed 📌\n\n7 free AI tools that do the work of a $5,000/mo growth agency:\n\n(Most founders only know #1 and #2)`,
    breakdown: 'Direct bookmark call to action paired with FOMO ("before it gets lost") and curiosity hook.',
  },
  {
    id: 'tmpl-5',
    title: 'The "Junior vs Senior" Contrast',
    archetype: 'Mental Models',
    category: 'Design & Code',
    avgViralScore: 95,
    hookFormula: `The difference between Junior [Role] and Senior [Role] in 1 sentence:\n\nJunior: [Overcomplicates/Focuses on vanity]\nSenior: [Simplifies/Focuses on leverage]\n\n[Number] examples with teardowns:`,
    example: `The difference between Junior engineer and Senior engineer in 1 sentence:\n\nJunior: Writes 300 lines of clever code.\nSenior: Deletes 1,000 lines of obsolete code and achieves the exact same result.\n\n5 examples every dev should review:`,
    breakdown: 'High relatability, micro-dopamine insight, and clean whitespace formatting.',
  },
  {
    id: 'tmpl-6',
    title: 'The "Stop Doing X, Do Y" Direct Command',
    archetype: 'Direct Coaching',
    category: 'Writing & Growth',
    avgViralScore: 90,
    hookFormula: `Stop [Painful, ineffective habit].\n\nInstead, do this [Timeframe or Step-by-Step alternative]:\n\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]`,
    example: `Stop tweeting into the void with 0 replies.\n\nInstead, spend 15 minutes a day doing this high-leverage comment strategy:\n\n1. Find 5 accounts in your niche with 10k-50k followers\n2. Turn on bell notifications\n3. Leave an insightful breakdown within 5 minutes of their post`,
    breakdown: 'Direct actionable guidance with numbered steps drives immediate retweets and saves.',
  },
];
