export interface ChromeExtensionFile {
  filename: string;
  description: string;
  language: string;
  content: string;
}

export const EXTENSION_FILES: ChromeExtensionFile[] = [
  {
    filename: 'manifest.json',
    description: 'Chrome Extension Manifest V3 configuration',
    language: 'json',
    content: `{
  "manifest_version": 3,
  "name": "TweetIQ - Twitter & X Analytics & Growth Extension",
  "version": "1.0.0",
  "description": "Real-time viral score predictor, hook analyzer, bookmark velocity metrics, and deep diagnostic overlay for Twitter and X.com.",
  "permissions": [
    "storage",
    "activeTab",
    "sidePanel"
  ],
  "host_permissions": [
    "https://twitter.com/*",
    "https://x.com/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "https://twitter.com/*",
        "https://x.com/*"
      ],
      "js": ["content.js"],
      "css": ["content.css"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "TweetIQ - Analytics & Growth Suite",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "side_panel": {
    "default_path": "sidepanel.html"
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}`,
  },
  {
    filename: 'content.js',
    description: 'In-feed DOM observer and widget injector for Twitter/X',
    language: 'javascript',
    content: `// TweetIQ Content Script - Injects real-time viral analytics into Twitter / X feed
(function () {
  console.log('[TweetIQ] Content script initialized on X / Twitter.');

  const PROCESSED_ATTR = 'data-tweetiq-injected';

  function parseMetricCount(str) {
    if (!str) return 0;
    str = str.trim().toUpperCase();
    if (str.endsWith('K')) return Math.round(parseFloat(str) * 1000);
    if (str.endsWith('M')) return Math.round(parseFloat(str) * 1000000);
    const cleaned = str.replace(/,/g, '');
    return isNaN(cleaned) ? 0 : parseInt(cleaned, 10);
  }

  function calculateScore(metrics, text) {
    const { likes = 0, retweets = 0, replies = 0, bookmarks = 0, views = 1000 } = metrics;
    // Modern X algorithm weights bookmarks at 5x, retweets 3x, replies 2x, likes 1x
    const weightedEngagements = (bookmarks * 5) + (retweets * 3) + (replies * 2) + (likes * 1);
    const engagementRatio = views > 0 ? (weightedEngagements / views) * 1000 : 50;
    
    let base = Math.min(98, Math.max(30, Math.round(engagementRatio * 3 + 45)));
    
    // Check link suppression penalty
    if (/https?:\\/\\//.test(text)) {
      base = Math.max(25, base - 15);
    }
    // Numbers bonus
    if (/\\d+/.test(text)) {
      base = Math.min(99, base + 5);
    }
    return base;
  }

  function injectBadge(tweetNode) {
    if (tweetNode.hasAttribute(PROCESSED_ATTR)) return;
    tweetNode.setAttribute(PROCESSED_ATTR, 'true');

    // Extract text content
    const textNode = tweetNode.querySelector('[data-testid="tweetText"]');
    const text = textNode ? textNode.innerText : '';

    // Extract action row metrics
    const metricsGroup = tweetNode.querySelector('[role="group"]');
    if (!metricsGroup) return;

    const textContent = metricsGroup.innerText || '';
    const numbers = textContent.match(/\\d+[.,]?\\d*[KM]?/gi) || [];
    
    const replies = parseMetricCount(numbers[0] || '0');
    const retweets = parseMetricCount(numbers[1] || '0');
    const likes = parseMetricCount(numbers[2] || '0');
    const views = parseMetricCount(numbers[3] || '1000');
    const bookmarks = Math.round(likes * 0.45); // estimated if not directly exposed in row

    const score = calculateScore({ likes, retweets, replies, bookmarks, views }, text);

    // Create TweetIQ Injected Action Element
    const badge = document.createElement('div');
    badge.className = 'tweetiq-tweet-badge';
    badge.innerHTML = \`
      <div class="tweetiq-pill \${score >= 90 ? 'tweetiq-viral' : score >= 75 ? 'tweetiq-solid' : 'tweetiq-avg'}">
        <span class="tweetiq-dot"></span>
        <span class="tweetiq-score-val">\${score}</span>
        <span class="tweetiq-lbl">IQ</span>
      </div>
      <button class="tweetiq-inspect-btn" title="Inspect Hook & Algorithmic Score with TweetIQ">
        ⚡ Inspect
      </button>
    \`;

    badge.querySelector('.tweetiq-inspect-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      showDiagnosticModal(text, score, { likes, retweets, replies, bookmarks, views });
    });

    metricsGroup.appendChild(badge);
  }

  function showDiagnosticModal(text, score, metrics) {
    let existing = document.getElementById('tweetiq-diag-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'tweetiq-diag-overlay';
    overlay.className = 'tweetiq-modal-backdrop';
    overlay.innerHTML = \`
      <div class="tweetiq-modal-card">
        <div class="tweetiq-modal-header">
          <div class="tweetiq-brand-logo">
            <span class="tweetiq-logo-dot"></span>
            <strong>TweetIQ Diagnostic</strong>
          </div>
          <button id="tweetiq-close-diag" class="tweetiq-close-btn">&times;</button>
        </div>
        <div class="tweetiq-modal-body">
          <div class="tweetiq-score-banner">
            <div class="tweetiq-big-score">\${score}<span>/100</span></div>
            <div class="tweetiq-score-desc">
              <h4>\${score >= 90 ? 'Explosive Viral Tier' : score >= 75 ? 'High Performance Tier' : 'Standard Feed Reach'}</h4>
              <p>Estimated Reach: \${(metrics.views || 5000).toLocaleString()} views</p>
            </div>
          </div>
          <div class="tweetiq-weights-breakdown">
            <div class="tweetiq-stat-row">
              <span>Bookmark Multiplier (5.0x)</span>
              <strong>\${(metrics.bookmarks || 0).toLocaleString()} saves</strong>
            </div>
            <div class="tweetiq-stat-row">
              <span>Repost Multiplier (3.0x)</span>
              <strong>\${(metrics.retweets || 0).toLocaleString()} reposts</strong>
            </div>
            <div class="tweetiq-stat-row">
              <span>Link Penalty Check</span>
              <strong style="color: \${/https?:\\/\\//.test(text) ? '#f87171' : '#4ade80'}">
                \${/https?:\\/\\//.test(text) ? '-15 pts (Outbound Link Detected)' : 'Passed (Clean Feed Text)'}
              </strong>
            </div>
          </div>
          <div class="tweetiq-action-box">
            <p><strong>TweetIQ Recommendation:</strong> \${/https?:\\/\\//.test(text) ? 'Move link to first reply to regain ~50% suppressed impressions.' : 'Strong hook with high retention format.'}</p>
          </div>
        </div>
      </div>
    \`;

    document.body.appendChild(overlay);
    document.getElementById('tweetiq-close-diag').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }

  // Observe dynamically rendered tweets on scroll
  const observer = new MutationObserver(() => {
    const tweets = document.querySelectorAll('article[data-testid="tweet"]');
    tweets.forEach(injectBadge);
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
`,
  },
  {
    filename: 'content.css',
    description: 'Injected CSS styles for Twitter/X overlay badges',
    language: 'css',
    content: `/* Injected styles for TweetIQ on Twitter / X */
.tweetiq-tweet-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 12px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 12px;
}

.tweetiq-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.tweetiq-pill:hover {
  transform: translateY(-1px);
}

.tweetiq-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.tweetiq-viral {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.35);
}
.tweetiq-viral .tweetiq-dot { background: #10b981; }

.tweetiq-solid {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.35);
}
.tweetiq-solid .tweetiq-dot { background: #f59e0b; }

.tweetiq-avg {
  background: rgba(100, 116, 139, 0.15);
  color: #94a3b8;
  border: 1px solid rgba(100, 116, 139, 0.35);
}
.tweetiq-avg .tweetiq-dot { background: #94a3b8; }

.tweetiq-lbl {
  font-size: 10px;
  opacity: 0.75;
}

.tweetiq-inspect-btn {
  background: #1d9bf0;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.tweetiq-inspect-btn:hover {
  opacity: 0.9;
}

/* Modal styles */
.tweetiq-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
}

.tweetiq-modal-card {
  background: #000000;
  border: 1px solid #2f3336;
  border-radius: 14px;
  width: 90%;
  max-width: 440px;
  color: #eff3f4;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}

.tweetiq-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #2f3336;
}

.tweetiq-brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1d9bf0;
}

.tweetiq-logo-dot {
  width: 8px;
  height: 8px;
  background: #1d9bf0;
  border-radius: 50%;
}

.tweetiq-close-btn {
  background: transparent;
  border: none;
  color: #71767b;
  font-size: 22px;
  cursor: pointer;
}

.tweetiq-modal-body {
  padding: 18px;
}

.tweetiq-score-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #16181c;
  padding: 14px 18px;
  border-radius: 10px;
  margin-bottom: 14px;
}

.tweetiq-big-score {
  font-size: 32px;
  font-weight: 800;
  color: #10b981;
}
.tweetiq-big-score span {
  font-size: 14px;
  color: #71767b;
}

.tweetiq-stat-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #2f3336;
  font-size: 13px;
}

.tweetiq-action-box {
  margin-top: 14px;
  padding: 12px;
  background: rgba(29, 155, 240, 0.1);
  border-left: 3px solid #1d9bf0;
  border-radius: 4px;
  font-size: 13px;
}
`,
  },
  {
    filename: 'background.js',
    description: 'Manifest V3 Service Worker with Side Panel activation',
    language: 'javascript',
    content: `// TweetIQ Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('TweetIQ extension successfully installed.');
});

// Enable side panel when extension icon is clicked
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));
}
`,
  },
  {
    filename: 'popup.html',
    description: 'Extension popup quick composer & score predictor',
    language: 'html',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>TweetIQ</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="header">
    <div class="logo">
      <span class="indicator"></span>
      <strong>TweetIQ</strong>
    </div>
    <span class="badge">Live</span>
  </div>

  <div class="composer">
    <textarea id="tweetInput" placeholder="Draft your tweet or hook here..."></textarea>
    <div class="toolbar">
      <span id="charCount">0/280</span>
      <button id="predictBtn">Predict Score</button>
    </div>
  </div>

  <div id="results" class="results-card hidden">
    <div class="score-row">
      <div class="score-circle">
        <span id="viralScore">--</span>
      </div>
      <div class="score-info">
        <h4 id="tierLabel">Analyzing...</h4>
        <p id="hookFeedback">Evaluation will appear here.</p>
      </div>
    </div>
  </div>

  <script src="popup.js"></script>
</body>
</html>
`,
  },
  {
    filename: 'popup.js',
    description: 'Popup script with real-time heuristic scoring',
    language: 'javascript',
    content: `document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('tweetInput');
  const charCount = document.getElementById('charCount');
  const predictBtn = document.getElementById('predictBtn');
  const results = document.getElementById('results');
  const viralScore = document.getElementById('viralScore');
  const tierLabel = document.getElementById('tierLabel');
  const hookFeedback = document.getElementById('hookFeedback');

  textarea.addEventListener('input', () => {
    charCount.textContent = textarea.value.length + '/280';
    if (textarea.value.length > 280) {
      charCount.style.color = '#ef4444';
    } else {
      charCount.style.color = '#71767b';
    }
  });

  predictBtn.addEventListener('click', () => {
    const text = textarea.value.trim();
    if (!text) return;

    let score = 65;
    if (/\\d+/.test(text)) score += 12;
    if (text.includes('\\n')) score += 8;
    if (/https?:\\/\\//.test(text)) score -= 18; // Link penalty
    if (text.length > 50 && text.length < 240) score += 10;
    score = Math.min(98, Math.max(25, score));

    results.classList.remove('hidden');
    viralScore.textContent = score;

    if (score >= 90) {
      tierLabel.textContent = 'Viral Velocity Tier';
      hookFeedback.textContent = 'High pattern interrupt & readability whitespace.';
    } else if (score >= 75) {
      tierLabel.textContent = 'Strong Hook';
      hookFeedback.textContent = 'Good engagement potential. Add a quantifiable stat.';
    } else {
      tierLabel.textContent = 'Needs Optimization';
      hookFeedback.textContent = 'Remove outbound link or strengthen the opening loop.';
    }
  });
});
`,
  },
  {
    filename: 'popup.css',
    description: 'Styling for the extension popup',
    language: 'css',
    content: `body {
  width: 340px;
  margin: 0;
  padding: 14px;
  background: #000000;
  color: #eff3f4;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1d9bf0;
  font-size: 15px;
}
.indicator {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
}
.badge {
  font-size: 11px;
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  padding: 2px 6px;
  border-radius: 4px;
}
textarea {
  width: 100%;
  height: 90px;
  background: #16181c;
  border: 1px solid #2f3336;
  border-radius: 8px;
  color: #eff3f4;
  padding: 8px;
  font-size: 13px;
  resize: none;
  box-sizing: border-box;
}
textarea:focus {
  outline: none;
  border-color: #1d9bf0;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
#charCount {
  font-size: 12px;
  color: #71767b;
}
button {
  background: #1d9bf0;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
.results-card {
  margin-top: 14px;
  background: #16181c;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #2f3336;
}
.hidden { display: none; }
.score-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.score-circle {
  font-size: 26px;
  font-weight: 800;
  color: #10b981;
}
.score-info h4 {
  margin: 0 0 4px 0;
  font-size: 13px;
}
.score-info p {
  margin: 0;
  font-size: 11px;
  color: #71767b;
}
`,
  },
  {
    filename: 'README.md',
    description: 'Instructions to load unpacked extension into Google Chrome',
    language: 'markdown',
    content: `# TweetIQ - Twitter & X Analytics Chrome Extension

## How to load into Google Chrome in 30 seconds:

1. Click the **"Download Unpacked Extension (.zip)"** button in TweetIQ.
2. Unzip the downloaded folder to your computer (e.g. into \`~/Documents/tweetiq-extension\`).
3. Open Google Chrome and navigate to:
   \`chrome://extensions\`
4. In the top right corner, turn ON **"Developer mode"**.
5. In the top left, click **"Load unpacked"**.
6. Select the unzipped \`tweetiq-extension\` folder.
7. Visit [twitter.com](https://twitter.com) or [x.com](https://x.com) — you will immediately see the TweetIQ Viral Score badges and deep diagnostic overlays injected into every tweet in your feed!
`,
  },
];
