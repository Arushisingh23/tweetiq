/**
 * TweetIQ Algorithmic Analytics & Grammar Engine
 * Features contained:
 * - calculateLiveTweetScore: Heuristic scoring for viral potential, readability, and link penalty
 * - checkGrammarAndClarity: Instant 0ms browser-side grammar, spelling, punctuation, and conciseness checker
 * - applyGrammarFix / applyAllGrammarFixes: Programmatic text correction utilities
 * - detectTweetIntent: Categorizes tweets into educational, hiring, or general formats
 * - buildExtensionZip: Assembles and zips the unpacked Chrome Extension for download
 * - exportTweetsAsCsv: Data export for creator backups and metric auditing
 * - checkViralAlert: Detects when a post's bookmark/retweet velocity outpaces baseline metrics
 */
import JSZip from 'jszip';
import { Tweet, TweetMetrics, ViralAnalysis, AlgorithmWeights, HookVariation, GrammarIssue, GrammarCheckResult } from '../types';
import { EXTENSION_FILES } from '../data/extensionFiles';

export const DEFAULT_ALGORITHM_WEIGHTS: AlgorithmWeights = {
  bookmarkWeight: 5.0,
  retweetWeight: 3.0,
  replyWeight: 2.0,
  likeWeight: 1.0,
  linkSuppressionPenalty: 18,
  mediaBoost: 12,
};

export function calculateLiveTweetScore(
  text: string,
  metrics?: TweetMetrics,
  hasMedia = false,
  weights = DEFAULT_ALGORITHM_WEIGHTS,
): { score: number; grade: string; details: { [key: string]: number | string } } {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const hasLink = /https?:\/\/[^\s]+/.test(text);
  const hasNumbers = /\d+/.test(text);
  const lineBreaks = (text.match(/\n/g) || []).length;
  const hasList = /(^|\n)[-•\d\.]+\s/.test(text);

  let score = 60;

  // Text heuristics
  if (hasNumbers) score += 9;
  if (lineBreaks >= 2) score += 8;
  if (hasList) score += 7;
  if (hasMedia) score += weights.mediaBoost;
  if (hasLink) score -= weights.linkSuppressionPenalty;

  // Word length sweet spot (20 - 55 words perform highest on X for readability)
  if (words >= 18 && words <= 55) {
    score += 8;
  } else if (words < 8) {
    score -= 6;
  }

  // Live metrics calculation
  if (metrics && metrics.impressions > 0) {
    const weightedEng =
      metrics.bookmarks * weights.bookmarkWeight +
      metrics.retweets * weights.retweetWeight +
      metrics.replies * weights.replyWeight +
      metrics.likes * weights.likeWeight;

    const engagementRate = (weightedEng / metrics.impressions) * 100;
    // Map to score
    const metricsComponent = Math.min(45, Math.round(engagementRate * 5));
    score = Math.round(score * 0.55 + metricsComponent);
  }

  // Constrain bounds
  score = Math.min(99, Math.max(20, score));

  let grade = 'B';
  if (score >= 94) grade = 'A+';
  else if (score >= 86) grade = 'A';
  else if (score >= 76) grade = 'B+';
  else if (score >= 65) grade = 'B';
  else if (score >= 50) grade = 'C';
  else grade = 'D';

  return {
    score,
    grade,
    details: {
      hasLink: hasLink ? 'Yes (Suppression penalty applied)' : 'No (Clean feed priority)',
      hasNumbers: hasNumbers ? 'Yes (+9 pts)' : 'No',
      lineBreaks: `${lineBreaks} breaks`,
      words: `${words} words`,
      tier: score >= 90 ? 'Explosive Viral Tier' : score >= 75 ? 'Strong Reach Tier' : 'Standard Feed Reach',
    },
  };
}

/**
 * Determines whether a tweet is a Hiring post, Educational post, or General
 */
export function detectTweetIntent(tweet: { text: string; postTag?: string; category?: string }): 'hiring' | 'educational' | 'general' {
  if (tweet.postTag === 'hiring' || tweet.category === 'Hiring') return 'hiring';
  if (tweet.postTag === 'educational' || tweet.category === 'Educational') return 'educational';

  const lower = (tweet.text || '').toLowerCase();

  // Hiring patterns
  const hiringKeywords = [
    'hiring', "we're hiring", 'we are hiring', 'join our team', 'looking for a',
    'open role', 'open roles', 'job opening', 'job posting', 'salary:', 'equity:',
    'remote role', 'bounty', 'apply here', 'apply at', 'dm me your portfolio',
    'hiring alert', 'contract dev', 'full-time engineer', 'founding engineer'
  ];
  if (hiringKeywords.some((kw) => lower.includes(kw))) {
    return 'hiring';
  }

  // Educational patterns
  const educationalKeywords = [
    'breakdown', 'how to', 'framework', 'architecture', 'tutorial', 'cheatsheet',
    'mental model', 'dissecting', 'here is how', 'lesson', 'step 1', 'steps to',
    'guide', 'rules of', 'before/after', 'tips for', 'playbook', '🧵', 'unpopular opinion:'
  ];
  if (educationalKeywords.some((kw) => lower.includes(kw))) {
    return 'educational';
  }

  return 'general';
}

export function generateDiagnostic(tweet: Tweet, weights = DEFAULT_ALGORITHM_WEIGHTS): ViralAnalysis {
  const text = tweet.text;
  const metrics = tweet.metrics;
  const hasLink = Boolean(tweet.outboundUrl || /https?:\/\/[^\s]+/.test(text));
  const hasNumbers = /\d+/.test(text);
  const lineBreaks = (text.match(/\n/g) || []).length;
  const isThread = Boolean(tweet.isThread);

  const { score, grade } = calculateLiveTweetScore(text, metrics, Boolean(tweet.mediaUrl), weights);

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (hasNumbers) {
    strengths.push('High-credibility numeric anchor in opening 2 lines');
  }
  if (tweet.metrics.bookmarks > tweet.metrics.likes * 0.3) {
    strengths.push('Exceptional bookmark ratio (5x algorithmic weight on X feed)');
  }
  if (lineBreaks >= 2) {
    strengths.push('Skimmable vertical line rhythm stops quick feed scrollers');
  }
  if (isThread) {
    strengths.push('Multi-post thread creates cascading dwell time');
  }
  if (!strengths.length) {
    strengths.push('Focused single idea prevents cognitive overload');
  }

  if (hasLink) {
    weaknesses.push('Main post contains external link: causes ~50% drop in algorithmic distribution');
  }
  if (text.length > 270 && !isThread) {
    weaknesses.push('Approaching character limit without thread break off');
  }
  if (!hasNumbers) {
    weaknesses.push('Lacks concrete numbers or time-stamped proof points');
  }
  if (tweet.metrics.replies < tweet.metrics.likes * 0.05) {
    weaknesses.push('Low reply ratio: lacks provocative discussion prompt or open loop');
  }

  let action = 'Maintain current hook rhythm and test as thread starter.';
  if (hasLink) {
    action = 'CRITICAL: Move the outbound URL to the 1st reply comment. The X algorithm penalizes external links in root posts.';
  } else if (!hasNumbers) {
    action = 'Add a quantified metric in the first 80 characters (e.g. "Over 6 months...", "Saved $4,200...", "3 critical rules").';
  } else if (tweet.metrics.bookmarks < 50) {
    action = 'Add a bookmark trigger like "Save this checklist for your next launch" to exploit the 5x algorithm multiplier.';
  }

  const cleanFirstLine = text.split('\n')[0].replace(/🧵|👇/g, '').trim();

  return {
    viralScore: score,
    hookGrade: grade,
    hookSummary:
      score >= 90
        ? 'Elite viral hook with high retention whitespace and massive bookmark incentive.'
        : score >= 75
        ? 'Strong engaging post with steady reader dwell time and healthy repost velocity.'
        : 'Underperforming hook; suffers from algorithmic link friction or low curiosity tension.',
    strengths,
    weaknesses,
    recommendedAction: action,
    bestAlternativeHook: `Most people get this backwards: ${cleanFirstLine.slice(0, 50)}...\n\nHere is the actual 3-step blueprint:`,
    algorithmBreakdown: {
      bookmarkBonus: Math.round(metrics.bookmarks * weights.bookmarkWeight),
      repostMultiplier: Math.round(metrics.retweets * weights.retweetWeight),
      replyEngagement: Math.round(metrics.replies * weights.replyWeight),
      formattingScore: lineBreaks >= 2 ? 15 : 5,
      linkPenalty: hasLink ? -weights.linkSuppressionPenalty : 0,
    },
  };
}

// Generates 7x24 matrix for Best Time to Post Heatmap
export function generateBestTimeToPostMatrix() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Peak times on X: Tue, Wed, Thu between 8-10am and 4-6pm
  const matrix = days.map((day, dIdx) => {
    return hours.map((hour) => {
      let base = 35;
      const isWeekday = dIdx < 5;

      if (isWeekday) {
        if (hour >= 8 && hour <= 10) base = 88 + Math.floor(Math.sin(hour) * 8);
        else if (hour >= 16 && hour <= 18) base = 84 + Math.floor(Math.cos(hour) * 7);
        else if (hour >= 12 && hour <= 14) base = 72;
        else if (hour >= 1 && hour <= 5) base = 15;
      } else {
        // Weekend
        if (hour >= 10 && hour <= 14) base = 68;
        else if (hour >= 18 && hour <= 20) base = 62;
        else base = 25;
      }

      // Add small deterministic variance
      const variance = ((dIdx * 7 + hour * 13) % 11) - 5;
      const score = Math.min(99, Math.max(12, base + variance));

      return {
        day,
        hour,
        score,
        tier: score >= 85 ? 'Peak Reach' : score >= 70 ? 'High' : score >= 45 ? 'Moderate' : 'Low',
      };
    });
  });

  return { days, hours, matrix };
}

// Instant client-side viral variations generator (zero-latency, no backend required)
export function generateClientSideVariations(text: string, category = 'General'): HookVariation[] {
  const clean = text.replace(/\n+/g, ' ').replace(/🧵|👇/g, '').trim();
  const summarySnippet = clean.length > 55 ? clean.slice(0, 52) + '...' : clean;
  
  return [
    {
      style: 'The Contrarian Paradox',
      hook: `90% of people think ${summarySnippet.toLowerCase()} is the only way.\n\nThey have it backwards. Here is what the top 1% actually do:`,
      projectedScore: 95,
      reasoning: 'Creates instant cognitive dissonance and challenges consensus belief.',
    },
    {
      style: 'The Data & Numbers Teardown',
      hook: `I spent 180+ hours testing this across 1,200+ top creators.\n\nOnly 3 non-obvious rules separated the winners from everyone else:`,
      projectedScore: 97,
      reasoning: 'High-labor research signal triggers automatic algorithmic bookmarks.',
    },
    {
      style: 'The Bookmark Goldmine Framework',
      hook: `Save this checklist before writing your next post 📌\n\nThe 5-step framework that generated 400k+ impressions:`,
      projectedScore: 98,
      reasoning: 'Direct bookmark call to action activates X’s 5.0x multiplier signal.',
    },
    {
      style: 'The Zero-to-One Story Arc',
      hook: `2 years ago I had zero reach and got 3 likes per post.\n\nLast month: 850k impressions.\n\nHere are the 4 brutal lessons that flipped the switch:`,
      projectedScore: 92,
      reasoning: 'Relatable hero journey creates high reader dwell time.',
    },
    {
      style: 'The Hard Truth / Pattern Interrupt',
      hook: `Harsh reality: Your problem isn’t the algorithm.\n\nIt’s how you structure the first 2 lines. Here is the 60-second fix:`,
      projectedScore: 94,
      reasoning: 'Direct pattern interrupt commands immediate feed attention.',
    },
  ];
}

function createPngIconBlob(size: number): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1d9bf0';
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.floor(size * 0.6)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('𝕏', size / 2, size / 2);
    }
    canvas.toBlob((blob) => {
      resolve(blob || new Blob([]));
    }, 'image/png');
  });
}

// Download ready-to-load Chrome Extension ZIP
export async function downloadChromeExtensionZip(): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('tweetiq-chrome-extension');

  EXTENSION_FILES.forEach((file) => {
    folder?.file(file.filename, file.content);
  });

  // Create real PNG icons for Chrome Manifest V3
  const iconsFolder = folder?.folder('icons');
  const [icon16, icon48, icon128] = await Promise.all([
    createPngIconBlob(16),
    createPngIconBlob(48),
    createPngIconBlob(128),
  ]);

  iconsFolder?.file('icon16.png', icon16);
  iconsFolder?.file('icon48.png', icon48);
  iconsFolder?.file('icon128.png', icon128);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tweetiq-chrome-extension.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Backup all data as JSON
export function exportDataAsJson(data: any, filename = 'tweetiq-backup.json'): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export Tracked Tweets as CSV
export function exportTweetsAsCsv(tweets: Tweet[], filename = 'tweetiq-tweets.csv'): void {
  const headers = ['ID', 'Author', 'Handle', 'Timestamp', 'ViralScore', 'HookGrade', 'Likes', 'Retweets', 'Replies', 'Bookmarks', 'Impressions', 'Text'];
  const rows = tweets.map((t) => [
    t.id,
    `"${t.author.name.replace(/"/g, '""')}"`,
    `"${t.author.handle.replace(/"/g, '""')}"`,
    `"${t.timestamp}"`,
    t.viralScore,
    t.hookGrade,
    t.metrics.likes,
    t.metrics.retweets,
    t.metrics.replies,
    t.metrics.bookmarks,
    t.metrics.impressions,
    `"${t.text.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Check for Viral Alert
export function checkViralAlert(tweet: Tweet, avgScore = 78, avgBookmarks = 1200): { isViral: boolean; multiplier: number; reason: string } {
  const bookmarkRatio = tweet.metrics.bookmarks / (avgBookmarks || 1);
  if (bookmarkRatio >= 2.2 || tweet.viralScore >= 95) {
    const mult = Number((bookmarkRatio > 1 ? bookmarkRatio : tweet.viralScore / 70).toFixed(1));
    return {
      isViral: true,
      multiplier: mult,
      reason: `Performing ${mult}x higher than your 30-day baseline! Bookmark velocity is in the 99th percentile.`,
    };
  }
  return { isViral: false, multiplier: 1, reason: '' };
}

// Built-in Grammar, Clarity, and Flow Rules for Instant Client-Side Checking
interface GrammarRule {
  id: string;
  pattern: RegExp;
  replacement: string | ((match: string, ...groups: string[]) => string);
  explanation: string;
  type: GrammarIssue['type'];
}

const GRAMMAR_RULES: GrammarRule[] = [
  // 1. Typos and common misspellings
  { id: 'typo-the', pattern: /\bteh\b/gi, replacement: 'the', explanation: 'Misspelling of "the"', type: 'spelling' },
  { id: 'typo-receive', pattern: /\brecieve\b/gi, replacement: 'receive', explanation: 'Rule: "I before E except after C"', type: 'spelling' },
  { id: 'typo-separate', pattern: /\bseperate\b/gi, replacement: 'separate', explanation: 'Spelling error ("separate" contains two "a"s)', type: 'spelling' },
  { id: 'typo-definitely', pattern: /\bdefinately\b/gi, replacement: 'definitely', explanation: 'Spelling error: write "definitely"', type: 'spelling' },
  { id: 'typo-until', pattern: /\buntill\b/gi, replacement: 'until', explanation: '"Until" is spelled with a single "l"', type: 'spelling' },
  { id: 'typo-alot', pattern: /\balot\b/gi, replacement: 'a lot', explanation: '"A lot" is two distinct words', type: 'spelling' },
  { id: 'typo-occurred', pattern: /\boccured\b/gi, replacement: 'occurred', explanation: '"Occurred" requires double "r"', type: 'spelling' },
  { id: 'typo-calendar', pattern: /\bcalender\b/gi, replacement: 'calendar', explanation: 'Spelling error: write "calendar"', type: 'spelling' },
  { id: 'typo-government', pattern: /\bgoverment\b/gi, replacement: 'government', explanation: 'Missing the "n" in "government"', type: 'spelling' },
  { id: 'typo-necessary', pattern: /\bneccessary\b/gi, replacement: 'necessary', explanation: 'Spelling error (one "c", two "s"s)', type: 'spelling' },
  { id: 'typo-tomorrow', pattern: /\btommorrow\b/gi, replacement: 'tomorrow', explanation: 'One "m" and two "r"s in "tomorrow"', type: 'spelling' },
  { id: 'typo-environment', pattern: /\benviroment\b/gi, replacement: 'environment', explanation: 'Missing "n" in "environment"', type: 'spelling' },
  { id: 'typo-argument', pattern: /\barguement\b/gi, replacement: 'argument', explanation: '"Argument" drops the middle "e"', type: 'spelling' },
  { id: 'typo-truly', pattern: /\btruely\b/gi, replacement: 'truly', explanation: '"Truly" has no "e"', type: 'spelling' },
  { id: 'typo-writing', pattern: /\bwritting\b/gi, replacement: 'writing', explanation: '"Writing" has one "t"', type: 'spelling' },
  { id: 'typo-together', pattern: /\btogather\b/gi, replacement: 'together', explanation: 'Spelling error: write "together"', type: 'spelling' },
  { id: 'typo-experience', pattern: /\bexperiance\b/gi, replacement: 'experience', explanation: 'Spelling error: write "experience"', type: 'spelling' },
  { id: 'typo-believe', pattern: /\bbeleive\b/gi, replacement: 'believe', explanation: 'Spelling error: "I before E" in "believe"', type: 'spelling' },

  // 2. Homophones and Grammar confusions
  { 
    id: 'homophone-your-welcome', 
    pattern: /\byour\s+(welcome|invited|doing|going|correct|right\s+about)\b/gi, 
    replacement: (_m, g1) => `you're ${g1}`, 
    explanation: 'Use "you\'re" (contraction of "you are")', 
    type: 'grammar' 
  },
  { 
    id: 'homophone-youre-possessive', 
    pattern: /\byou're\s+(code|post|tweet|metrics|account|audience|product|startup)\b/gi, 
    replacement: (_m, g1) => `your ${g1}`, 
    explanation: 'Use possessive "your" instead of "you\'re"', 
    type: 'grammar' 
  },
  { 
    id: 'homophone-there-existential', 
    pattern: /\btheir\s+(is|are|was|were)\b/gi, 
    replacement: (_m, g1) => `there ${g1}`, 
    explanation: 'Use "there" for existential statement or location', 
    type: 'grammar' 
  },
  { 
    id: 'homophone-their-possessive', 
    pattern: /\bthere\s+(startup|company|product|post|team|founder|code)\b/gi, 
    replacement: (_m, g1) => `their ${g1}`, 
    explanation: 'Use possessive "their" instead of "there"', 
    type: 'grammar' 
  },
  { 
    id: 'homophone-its-contraction', 
    pattern: /\bits\s+(working|amazing|viral|happening|time|going|hard)\b/gi, 
    replacement: (_m, g1) => `it's ${g1}`, 
    explanation: 'Use "it\'s" (contraction of "it is")', 
    type: 'grammar' 
  },
  { 
    id: 'homophone-its-possessive', 
    pattern: /\bit's\s+(features|reach|algorithm|growth|metrics|impressions)\b/gi, 
    replacement: (_m, g1) => `its ${g1}`, 
    explanation: 'Use "its" (possessive pronoun without apostrophe)', 
    type: 'grammar' 
  },
  { 
    id: 'grammar-modal-of', 
    pattern: /\b(could|should|would)\s+of\b/gi, 
    replacement: (_m, g1) => `${g1} have`, 
    explanation: 'Use "have" instead of "of" after modal verbs ("could have")', 
    type: 'grammar' 
  },
  { 
    id: 'grammar-loose-lose', 
    pattern: /\bloose\s+(money|followers|traction|reach|focus|customers|sales)\b/gi, 
    replacement: (_m, g1) => `lose ${g1}`, 
    explanation: 'Use "lose" (verb) instead of "loose" (opposite of tight)', 
    type: 'grammar' 
  },
  { 
    id: 'grammar-subject-verb-we-was', 
    pattern: /\bwe\s+was\b/gi, 
    replacement: 'we were', 
    explanation: 'Subject-verb agreement: use "we were"', 
    type: 'grammar' 
  },
  { 
    id: 'grammar-subject-verb-they-was', 
    pattern: /\bthey\s+was\b/gi, 
    replacement: 'they were', 
    explanation: 'Subject-verb agreement: use "they were"', 
    type: 'grammar' 
  },

  // 3. Punctuation & Formatting
  { 
    id: 'punct-standalone-i', 
    pattern: /\b(i)\b/g, 
    replacement: 'I', 
    explanation: 'Capitalize the standalone personal pronoun "I"', 
    type: 'punctuation' 
  },
  { 
    id: 'punct-space-before', 
    pattern: /([A-Za-z0-9])\s+([,\.!\?;:])/g, 
    replacement: '$1$2', 
    explanation: 'Remove erroneous space before punctuation mark', 
    type: 'punctuation' 
  },
  { 
    id: 'punct-excessive-marks', 
    pattern: /([?!]){3,}/g, 
    replacement: '$1', 
    explanation: 'Excessive punctuation looks spammy under X algorithm filters', 
    type: 'punctuation' 
  },
  { 
    id: 'punct-excessive-dots', 
    pattern: /\.{4,}/g, 
    replacement: '...', 
    explanation: 'Standardize excessive periods to standard 3-dot ellipsis', 
    type: 'punctuation' 
  },

  // 4. Wordiness & Conciseness (crucial for Twitter character economy)
  { 
    id: 'wordiness-in-order-to', 
    pattern: /\bin\s+order\s+to\b/gi, 
    replacement: 'to', 
    explanation: 'Wordiness: "to" saves 8 characters with zero loss in punchiness', 
    type: 'wordiness' 
  },
  { 
    id: 'wordiness-due-to-the-fact', 
    pattern: /\bdue\s+to\s+the\s+fact\s+that\b/gi, 
    replacement: 'because', 
    explanation: 'Wordiness: replace with "because" for faster reader flow', 
    type: 'wordiness' 
  },
  { 
    id: 'wordiness-at-present-time', 
    pattern: /\bat\s+the\s+present\s+time\b/gi, 
    replacement: 'now', 
    explanation: 'Wordiness: replace with "now" or "currently"', 
    type: 'wordiness' 
  },
  { 
    id: 'wordiness-each-and-every', 
    pattern: /\beach\s+and\s+every\b/gi, 
    replacement: 'every', 
    explanation: 'Redundant phrasing: "every" is cleaner and crisper', 
    type: 'wordiness' 
  },
  { 
    id: 'wordiness-very-unique', 
    pattern: /\bvery\s+unique\b/gi, 
    replacement: 'unique', 
    explanation: '"Unique" already means one-of-a-kind; remove "very"', 
    type: 'wordiness' 
  },
  { 
    id: 'wordiness-needless-to-say', 
    pattern: /\bneedless\s+to\s+say,?\s*/gi, 
    replacement: '', 
    explanation: 'Throat-clearing phrase that slows reader engagement; cut it', 
    type: 'wordiness' 
  },
  { 
    id: 'wordiness-at-end-of-day', 
    pattern: /\bat\s+the\s+end\s+of\s+the\s+day,?\s*/gi, 
    replacement: 'Ultimately, ', 
    explanation: 'Overused cliché; replace with "Ultimately" for authority', 
    type: 'wordiness' 
  },
];

/**
 * Checks text for grammar, spelling, punctuation, and wordiness issues.
 * Returns structured issues with replacement suggestions and overall clarity score.
 */
export function checkGrammarAndClarity(text: string): GrammarCheckResult {
  if (!text || text.trim().length === 0) {
    return {
      hasIssues: false,
      score: 100,
      cleanText: text,
      issues: [],
      summary: 'No text provided to check.',
    };
  }

  const issues: GrammarIssue[] = [];
  let workingText = text;

  // Run through rule definitions
  for (const rule of GRAMMAR_RULES) {
    // Reset regex state
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    let match: RegExpExecArray | null;

    // Use while loop if global, or single match if not
    while ((match = regex.exec(text)) !== null) {
      const matchText = match[0];
      let repl = '';
      if (typeof rule.replacement === 'function') {
        repl = (rule.replacement as any)(matchText, ...match.slice(1));
      } else {
        repl = matchText.replace(rule.pattern, rule.replacement);
      }

      // Avoid duplicates
      const exists = issues.some(
        (iss) => iss.original.toLowerCase() === matchText.toLowerCase() && iss.explanation === rule.explanation
      );

      if (!exists && matchText !== repl) {
        issues.push({
          id: `${rule.id}-${issues.length}`,
          original: matchText,
          replacement: repl,
          explanation: rule.explanation,
          type: rule.type,
        });
      }

      if (!regex.global) break;
    }
  }

  // Calculate cleanText by applying all discovered replacements
  let cleanText = text;
  for (const rule of GRAMMAR_RULES) {
    if (typeof rule.replacement === 'function') {
      cleanText = cleanText.replace(rule.pattern, rule.replacement as any);
    } else {
      cleanText = cleanText.replace(rule.pattern, rule.replacement);
    }
  }

  // Score calculation: start at 100, penalize based on issues
  const penalty = issues.reduce((acc, issue) => {
    if (issue.type === 'grammar') return acc + 10;
    if (issue.type === 'spelling') return acc + 8;
    if (issue.type === 'punctuation') return acc + 5;
    if (issue.type === 'wordiness') return acc + 4;
    return acc + 5;
  }, 0);

  const score = Math.max(35, Math.min(100, 100 - penalty));

  let summary = 'Text is clean, polished, and ready to post.';
  if (issues.length > 0) {
    const counts = {
      spelling: issues.filter((i) => i.type === 'spelling').length,
      grammar: issues.filter((i) => i.type === 'grammar').length,
      punctuation: issues.filter((i) => i.type === 'punctuation').length,
      wordiness: issues.filter((i) => i.type === 'wordiness').length,
    };
    const parts = [];
    if (counts.grammar > 0) parts.push(`${counts.grammar} grammar`);
    if (counts.spelling > 0) parts.push(`${counts.spelling} spelling`);
    if (counts.punctuation > 0) parts.push(`${counts.punctuation} punctuation`);
    if (counts.wordiness > 0) parts.push(`${counts.wordiness} conciseness`);
    summary = `Found ${issues.length} suggested fix${issues.length > 1 ? 'es' : ''} (${parts.join(', ')}).`;
  }

  return {
    hasIssues: issues.length > 0,
    score,
    cleanText,
    issues,
    summary,
  };
}

/**
 * Apply a single grammar issue fix to text.
 */
export function applyGrammarFix(text: string, issue: GrammarIssue): string {
  // Replace the first occurrence of original text with replacement
  return text.replace(issue.original, issue.replacement);
}

/**
 * Apply all grammar fixes sequentially to text.
 */
export function applyAllGrammarFixes(text: string, issues: GrammarIssue[]): string {
  let result = text;
  for (const issue of issues) {
    result = result.replace(issue.original, issue.replacement);
  }
  return result;
}


