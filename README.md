# TweetIQ - Twitter & X Analytics & Growth Suite

TweetIQ is an advanced Twitter/X analytics engine, Chrome extension, and viral post assistant built to analyze algorithmic reach, proofread post clarity and grammar, optimize opening hooks, and simulate live feed engagement.

---

## 📁 Repository Structure & File Breakdown

The table below describes what each feature file in this repository contains and its role in the application:

| Path / File | Feature Area | Description & File Contents |
| :--- | :--- | :--- |
| `server.ts` | **Backend & AI Engine** | Express server hosting Gemini 3.8 Flash endpoints (`/api/check-grammar`, `/api/analyze-tweet`, `/api/generate-hooks`, `/api/ghostwriter`, `/api/post-coach`) with Vite middleware integration. |
| `index.html` | **Application Entry Point** | HTML5 root document configured with typography, metadata, OpenGraph tags, and theme script. |
| `metadata.json` | **Applet Metadata** | Project identification, description, and capability permissions for AI Studio deployment. |
| `package.json` | **Dependencies & Scripts** | NPM configuration, build scripts (`dev`, `build`, `lint`), and package dependencies. |
| `src/App.tsx` | **Application Controller** | Primary state manager handling theme switching, modal routing, tweet collections, and views. |
| `src/main.tsx` | **React Bootstrap** | Mounts the root React application into the DOM with strict mode and global styles. |
| `src/index.css` | **Global Styles** | Tailwind CSS root directive and custom design tokens for light and dark modes. |
| `src/types/index.ts` | **Type Definitions** | TypeScript contracts for Tweets, TweetMetrics, GrammarIssue, GrammarCheckResult, and AlgorithmWeights. |
| `src/utils/analytics.ts` | **Core Algorithmic Engine** | Deterministic virality scoring, link penalties, client-side grammar & clarity rules, and CSV exporter. |
| `src/data/feedData.ts` | **Timeline Data** | Verified creator tweets and realistic metrics powering the interactive feed simulation. |
| `src/data/tweetiqData.ts` | **Growth Templates** | Pre-built hook formulas, evergreen queue recycler, and engagement frameworks. |
| `src/data/extensionFiles.ts` | **Chrome Extension Bundle** | Full Manifest V3 source code (background service worker, content scripts, overlay CSS, and popup HTML). |
| `src/components/Navbar.tsx` | **Navigation Header** | Navigation bar with view switcher (Landing, Feed, Side Panel, Web Store), theme toggle, and export button. |
| `src/components/TwitterFeed.tsx` | **Feed Simulator** | Twitter/X timeline interface with real-time reach score predictor, inline grammar alerts, and post filters. |
| `src/components/TweetIQSidePanel.tsx` | **Growth Side Panel** | Docked assistant with tweet composer, live grammar badge, schedule queue, and reach breakdown. |
| `src/components/GrammarCheckerModal.tsx`| **Grammar & Clarity Checker**| Interactive proofreader modal with clarity score, category filtering (Spelling, Grammar, Punctuation, Conciseness), and 1-click fixes. |
| `src/components/DiagnosticModal.tsx` | **Algorithmic Teardown** | Deep post analysis breaking down curiosity gaps, link penalties, bookmark incentives, and hook grades. |
| `src/components/HookRemixModal.tsx` | **Viral Hook Remixer** | Generates 5 high-converting hook variations (Contrarian, Data, Bookmark Goldmine, Story, Hard Truth). |
| `src/components/EngagementTracker.tsx` | **Growth Analytics** | Historical engagement tracker plotting follower velocity, bookmark ratios, and impression trends. |
| `src/components/LandingPageView.tsx` | **Product Landing Page** | SaaS marketing page demonstrating extension capabilities, feature walkthroughs, and conversion tiers. |
| `src/components/ChromeExportModal.tsx` | **Extension Exporter** | One-click ZIP bundler allowing creators to download and install the unpacked Chrome Extension in Developer Mode. |
| `src/components/ChromeWebStoreView.tsx` | **Store Showcase** | Interactive mock of the Chrome Web Store listing page with installation instructions and user reviews. |
| `src/components/MediaKitModal.tsx` | **Sponsor Media Kit** | Dynamic rate card and sponsor deck generator calculating CPM, impression volume, and slot pricing. |
| `src/components/PricingModal.tsx` | **Pricing & Licensing** | Subscription and lifetime license checkout simulation with feature tier comparisons. |

---

## 🚀 Key Features

1. **AI Grammar & Clarity Proofreading**:
   * Instant browser-side rule engine (0ms latency) checking spelling, homophones, punctuation, and wordiness.
   * Deep AI scan powered by Gemini 3.8 Flash for semantic flow and tone optimization.
   * 1-click fix buttons to instantly polish tweets before posting.

2. **Real-Time Virality & Hook Scoring**:
   * Evaluates formatting, readability, whitespace, numerical anchors, and curiosity loops.
   * Detects algorithmic penalties (e.g., outbound links that suppress reach by ~50%).

3. **Chrome Extension (Manifest V3)**:
   * Inspect and score posts directly on `twitter.com` and `x.com`.
   * Exportable as an unpacked extension ready for developer mode loading.

4. **Multi-Archetype Hook Remixer**:
   * Converts ideas into Contrarian, Data & Numbers, Bookmark Goldmine, Story, and Hard Truth formats.

5. **Creator Analytics & Monetization**:
   * Historical engagement logging and growth trajectory graphing.
   * Automated sponsor media kit generator with real-time rate card estimates.

---

## 🛠️ Development & Build

```bash
# Install dependencies
npm install

# Start local fullstack development server
npm run dev

# Build production bundle
npm run build

# Typecheck and lint
npm run lint
```
