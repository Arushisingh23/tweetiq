import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Bookmark, 
  Eye, 
  Plus, 
  Calendar, 
  Download, 
  Trash2, 
  RefreshCw, 
  Check, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  X
} from 'lucide-react';
import { DailyEngagementLog, ThemeMode, Tweet } from '../types';

interface EngagementTrackerProps {
  theme: ThemeMode;
  feedTweets?: Tweet[];
  onClose?: () => void;
  isCompact?: boolean;
}

const STORAGE_KEY = 'tweetiq_engagement_tracker_logs';

// Default initial 14-day history for instant rich trendlines
const DEFAULT_LOGS: DailyEngagementLog[] = [
  { id: '1', date: '2026-09-14', displayDate: 'Sep 14', followers: 14120, netFollowersChange: 25, avgViralScore: 78, avgBookmarks: 74, avgLikes: 310, avgRetweets: 45, avgImpressions: 11400, tweetsCount: 2, notes: 'Intro thread' },
  { id: '2', date: '2026-09-15', displayDate: 'Sep 15', followers: 14168, netFollowersChange: 48, avgViralScore: 82, avgBookmarks: 92, avgLikes: 380, avgRetweets: 58, avgImpressions: 13200, tweetsCount: 3, notes: 'Design tip post' },
  { id: '3', date: '2026-09-16', displayDate: 'Sep 16', followers: 14210, netFollowersChange: 42, avgViralScore: 80, avgBookmarks: 88, avgLikes: 360, avgRetweets: 52, avgImpressions: 12800, tweetsCount: 2 },
  { id: '4', date: '2026-09-17', displayDate: 'Sep 17', followers: 14295, netFollowersChange: 85, avgViralScore: 89, avgBookmarks: 142, avgLikes: 540, avgRetweets: 88, avgImpressions: 19500, tweetsCount: 4, notes: 'Contrarian tech take' },
  { id: '5', date: '2026-09-18', displayDate: 'Sep 18', followers: 14360, netFollowersChange: 65, avgViralScore: 84, avgBookmarks: 110, avgLikes: 460, avgRetweets: 68, avgImpressions: 16100, tweetsCount: 3 },
  { id: '6', date: '2026-09-19', displayDate: 'Sep 19', followers: 14415, netFollowersChange: 55, avgViralScore: 81, avgBookmarks: 95, avgLikes: 405, avgRetweets: 60, avgImpressions: 14800, tweetsCount: 2 },
  { id: '7', date: '2026-09-20', displayDate: 'Sep 20', followers: 14470, netFollowersChange: 55, avgViralScore: 85, avgBookmarks: 118, avgLikes: 490, avgRetweets: 72, avgImpressions: 17200, tweetsCount: 3 },
  { id: '8', date: '2026-09-21', displayDate: 'Sep 21', followers: 14545, netFollowersChange: 75, avgViralScore: 88, avgBookmarks: 135, avgLikes: 580, avgRetweets: 86, avgImpressions: 21400, tweetsCount: 4, notes: 'Framework post' },
  { id: '9', date: '2026-09-22', displayDate: 'Sep 22', followers: 14610, netFollowersChange: 65, avgViralScore: 86, avgBookmarks: 125, avgLikes: 520, avgRetweets: 78, avgImpressions: 18900, tweetsCount: 3 },
  { id: '10', date: '2026-09-23', displayDate: 'Sep 23', followers: 14690, netFollowersChange: 80, avgViralScore: 91, avgBookmarks: 168, avgLikes: 680, avgRetweets: 104, avgImpressions: 26500, tweetsCount: 4, notes: 'Peak viral question' },
  { id: '11', date: '2026-09-24', displayDate: 'Sep 24', followers: 14782, netFollowersChange: 92, avgViralScore: 93, avgBookmarks: 184, avgLikes: 740, avgRetweets: 115, avgImpressions: 29800, tweetsCount: 4, notes: 'Viral cheat sheet' },
  { id: '12', date: '2026-09-25', displayDate: 'Sep 25', followers: 14840, netFollowersChange: 58, avgViralScore: 87, avgBookmarks: 138, avgLikes: 590, avgRetweets: 82, avgImpressions: 22100, tweetsCount: 3 },
  { id: '13', date: '2026-09-26', displayDate: 'Sep 26', followers: 14905, netFollowersChange: 65, avgViralScore: 89, avgBookmarks: 152, avgLikes: 630, avgRetweets: 94, avgImpressions: 24700, tweetsCount: 3 },
  { id: '14', date: '2026-09-27', displayDate: 'Today', followers: 14980, netFollowersChange: 75, avgViralScore: 92, avgBookmarks: 176, avgLikes: 710, avgRetweets: 108, avgImpressions: 28400, tweetsCount: 4, notes: 'Algorithmic growth streak' },
];

export const EngagementTracker: React.FC<EngagementTrackerProps> = ({
  theme,
  feedTweets = [],
  onClose,
  isCompact = false,
}) => {
  const isDark = theme === 'dark';

  // Load stored logs from localStorage
  const [logs, setLogs] = useState<DailyEngagementLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Error reading engagement logs:', err);
    }
    return DEFAULT_LOGS;
  });

  // Active chart metric
  type MetricKey = 'followers' | 'avgViralScore' | 'avgBookmarks' | 'avgImpressions';
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('followers');
  const [timeRange, setTimeRange] = useState<'7' | '14' | 'all'>('14');
  const [showLogForm, setShowLogForm] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Save to localStorage whenever logs change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch (err) {
      console.error('Failed to save logs to localStorage:', err);
    }
  }, [logs]);

  // Form state for logging a new day
  const latestLog = logs[logs.length - 1];
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formFollowers, setFormFollowers] = useState(latestLog ? latestLog.followers + 35 : 15000);
  const [formViralScore, setFormViralScore] = useState(90);
  const [formBookmarks, setFormBookmarks] = useState(160);
  const [formLikes, setFormLikes] = useState(650);
  const [formRetweets, setFormRetweets] = useState(95);
  const [formImpressions, setFormImpressions] = useState(25000);
  const [formTweetsCount, setFormTweetsCount] = useState(3);
  const [formNotes, setFormNotes] = useState('');

  // Auto-calculate performance from current feed tweets
  const handleAutoFillFromFeed = () => {
    if (!feedTweets || feedTweets.length === 0) {
      setStatusMessage('No feed tweets available to calculate averages.');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    const count = feedTweets.length;
    const totalScore = feedTweets.reduce((acc, t) => acc + (t.viralScore || 75), 0);
    const totalBookmarks = feedTweets.reduce((acc, t) => acc + (t.metrics?.bookmarks || 0), 0);
    const totalLikes = feedTweets.reduce((acc, t) => acc + (t.metrics?.likes || 0), 0);
    const totalRT = feedTweets.reduce((acc, t) => acc + (t.metrics?.retweets || 0), 0);
    const totalImp = feedTweets.reduce((acc, t) => acc + (t.metrics?.impressions || 0), 0);

    setFormViralScore(Math.round(totalScore / count));
    setFormBookmarks(Math.round(totalBookmarks / count));
    setFormLikes(Math.round(totalLikes / count));
    setFormRetweets(Math.round(totalRT / count));
    setFormImpressions(Math.round(totalImp / count));
    setFormTweetsCount(count);
    setFormNotes(`Auto-calculated from ${count} active feed tweets`);
    setStatusMessage('✓ Form auto-filled with real metrics from your current feed!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const prevFollowers = latestLog ? latestLog.followers : formFollowers;
    const netChange = formFollowers - prevFollowers;

    // Create formatted display date (e.g. "Sep 28")
    const dateObj = new Date(formDate);
    const displayDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const newLog: DailyEngagementLog = {
      id: Date.now().toString(),
      date: formDate,
      displayDate,
      followers: Number(formFollowers),
      netFollowersChange: netChange,
      avgViralScore: Number(formViralScore),
      avgBookmarks: Number(formBookmarks),
      avgLikes: Number(formLikes),
      avgRetweets: Number(formRetweets),
      avgImpressions: Number(formImpressions),
      tweetsCount: Number(formTweetsCount),
      notes: formNotes.trim() || undefined,
    };

    setLogs((prev) => [...prev, newLog]);
    setShowLogForm(false);
    setStatusMessage(`✓ Logged metrics for ${displayDate}! Followers: ${formFollowers} (${netChange >= 0 ? `+${netChange}` : netChange})`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset tracker data to default 14-day history?')) {
      setLogs(DEFAULT_LOGS);
      setStatusMessage('✓ Reset to default 14-day history.');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleExportCsv = () => {
    const headers = ['Date', 'Followers', 'Net Growth', 'Avg Reach Score (%)', 'Avg Bookmarks', 'Avg Likes', 'Avg Retweets', 'Avg Impressions', 'Tweets Count', 'Notes'];
    const rows = logs.map((l) => [
      l.date,
      l.followers,
      l.netFollowersChange,
      l.avgViralScore,
      l.avgBookmarks,
      l.avgLikes,
      l.avgRetweets,
      l.avgImpressions,
      l.tweetsCount,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tweetiq-engagement-tracker-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logs according to time range
  const filteredLogs = useMemo(() => {
    if (timeRange === '7') return logs.slice(-7);
    if (timeRange === '14') return logs.slice(-14);
    return logs;
  }, [logs, timeRange]);

  // Overall KPI statistics
  const kpiStats = useMemo(() => {
    if (filteredLogs.length === 0) {
      return { totalGain: 0, currentFollowers: 0, avgScore: 0, avgBookmarks: 0, avgImpressions: 0 };
    }

    const first = filteredLogs[0];
    const last = filteredLogs[filteredLogs.length - 1];
    const totalGain = last.followers - first.followers;
    const avgScore = Math.round(filteredLogs.reduce((acc, l) => acc + l.avgViralScore, 0) / filteredLogs.length);
    const avgBookmarks = Math.round(filteredLogs.reduce((acc, l) => acc + l.avgBookmarks, 0) / filteredLogs.length);
    const avgImpressions = Math.round(filteredLogs.reduce((acc, l) => acc + l.avgImpressions, 0) / filteredLogs.length);

    return {
      totalGain,
      currentFollowers: last.followers,
      avgScore,
      avgBookmarks,
      avgImpressions,
    };
  }, [filteredLogs]);

  // SVG Trend Line Calculation
  const chartData = useMemo(() => {
    if (filteredLogs.length === 0) return { path: '', areaPath: '', points: [], minVal: 0, maxVal: 0 };

    const values = filteredLogs.map((l) => l[selectedMetric] as number);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const width = 500;
    const height = 140;
    const padding = 20;

    const points = values.map((val, idx) => {
      const x = padding + (idx / (values.length - 1 || 1)) * (width - padding * 2);
      const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
      return { x, y, value: val, log: filteredLogs[idx] };
    });

    const path = points.reduce((acc, pt, idx) => {
      if (idx === 0) return `M ${pt.x},${pt.y}`;
      return `${acc} L ${pt.x},${pt.y}`;
    }, '');

    const areaPath = points.length > 0
      ? `${path} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`
      : '';

    return { path, areaPath, points, minVal, maxVal, width, height };
  }, [filteredLogs, selectedMetric]);

  const activePoint = hoveredIndex !== null ? chartData.points[hoveredIndex] : chartData.points[chartData.points.length - 1];

  const getMetricColor = (metric: MetricKey) => {
    switch (metric) {
      case 'followers': return '#1d9bf0';
      case 'avgViralScore': return '#10b981';
      case 'avgBookmarks': return '#f59e0b';
      case 'avgImpressions': return '#a855f7';
      default: return '#1d9bf0';
    }
  };

  const activeColor = getMetricColor(selectedMetric);

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-colors ${
      isDark ? 'bg-[#000000] text-[#eff3f4]' : 'bg-white text-gray-900'
    }`}>
      {/* Component Header */}
      <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
        isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1d9bf0]/15 border border-[#1d9bf0]/30 flex items-center justify-center text-[#1d9bf0]">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">Engagement Tracker</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold border border-emerald-500/30">
                localStorage Persistent
              </span>
            </div>
            <p className={`text-[11px] ${isDark ? 'text-[#71767b]' : 'text-gray-500'}`}>
              Daily follower growth &amp; tweet performance trends
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowLogForm((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] active:scale-95 text-white font-bold text-xs transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showLogForm ? 'Hide Form' : 'Log Today'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-400 font-semibold flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage('')}><X className="w-3 h-3" /></button>
        </div>
      )}

      {/* Main scrollable body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Card 1: Followers */}
          <div 
            onClick={() => setSelectedMetric('followers')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedMetric === 'followers'
                ? isDark
                  ? 'border-[#1d9bf0] bg-[#1d9bf0]/10 shadow-xs ring-1 ring-[#1d9bf0]/40'
                  : 'border-[#1d9bf0] bg-blue-50/60 shadow-xs ring-1 ring-[#1d9bf0]/30'
                : isDark
                ? 'border-[#2f3336] bg-[#0c0d10] hover:border-gray-600'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] mb-1 text-gray-400">
              <span className="font-semibold flex items-center gap-1">
                <Users className="w-3 h-3 text-[#1d9bf0]" /> Followers
              </span>
              <span className="text-emerald-500 font-bold flex items-center text-[10px]">
                <ArrowUpRight className="w-3 h-3" /> +{kpiStats.totalGain}
              </span>
            </div>
            <div className="text-lg font-black">{kpiStats.currentFollowers.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Net in {timeRange === 'all' ? 'total' : `${timeRange}d`}</div>
          </div>

          {/* Card 2: Avg Viral Score */}
          <div 
            onClick={() => setSelectedMetric('avgViralScore')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedMetric === 'avgViralScore'
                ? isDark
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-xs ring-1 ring-emerald-500/40'
                  : 'border-emerald-500 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-500/30'
                : isDark
                ? 'border-[#2f3336] bg-[#0c0d10] hover:border-gray-600'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] mb-1 text-gray-400">
              <span className="font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" /> Avg Reach
              </span>
              <span className="text-emerald-400 font-bold text-[10px]">Top 10%</span>
            </div>
            <div className="text-lg font-black text-emerald-400">{kpiStats.avgScore}%</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Predictor accuracy</div>
          </div>

          {/* Card 3: Avg Bookmarks */}
          <div 
            onClick={() => setSelectedMetric('avgBookmarks')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedMetric === 'avgBookmarks'
                ? isDark
                  ? 'border-amber-500 bg-amber-500/10 shadow-xs ring-1 ring-amber-500/40'
                  : 'border-amber-500 bg-amber-50/60 shadow-xs ring-1 ring-amber-500/30'
                : isDark
                ? 'border-[#2f3336] bg-[#0c0d10] hover:border-gray-600'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] mb-1 text-gray-400">
              <span className="font-semibold flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-amber-400" /> Bookmarks
              </span>
              <span className="text-amber-400 font-bold text-[10px]">5.0x Weight</span>
            </div>
            <div className="text-lg font-black text-amber-400">{kpiStats.avgBookmarks}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">Per tweet avg</div>
          </div>

          {/* Card 4: Avg Impressions */}
          <div 
            onClick={() => setSelectedMetric('avgImpressions')}
            className={`p-3 rounded-xl border cursor-pointer transition-all ${
              selectedMetric === 'avgImpressions'
                ? isDark
                  ? 'border-purple-500 bg-purple-500/10 shadow-xs ring-1 ring-purple-500/40'
                  : 'border-purple-500 bg-purple-50/60 shadow-xs ring-1 ring-purple-500/30'
                : isDark
                ? 'border-[#2f3336] bg-[#0c0d10] hover:border-gray-600'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] mb-1 text-gray-400">
              <span className="font-semibold flex items-center gap-1">
                <Eye className="w-3 h-3 text-purple-400" /> Impressions
              </span>
              <span className="text-purple-400 font-bold text-[10px]">Reach</span>
            </div>
            <div className="text-lg font-black text-purple-400">
              {(kpiStats.avgImpressions / 1000).toFixed(1)}K
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Per post reach</div>
          </div>
        </div>

        {/* Interactive Trend Line Chart Container */}
        <div className={`p-4 rounded-xl border ${
          isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
        }`}>
          {/* Chart Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                  {selectedMetric === 'followers' && 'Followers Growth Trend'}
                  {selectedMetric === 'avgViralScore' && 'Average Reach Score Trend (%)'}
                  {selectedMetric === 'avgBookmarks' && 'Daily Average Bookmarks (5x Algorithmic Weight)'}
                  {selectedMetric === 'avgImpressions' && 'Average Tweet Impressions'}
                </h4>
                {activePoint && (
                  <span className="text-xs font-mono font-bold" style={{ color: activeColor }}>
                    {activePoint.log.displayDate}: {selectedMetric === 'avgViralScore' ? `${activePoint.value}%` : activePoint.value.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                Hover over data points to inspect daily logs
              </p>
            </div>

            {/* Time range switcher */}
            <div className={`flex items-center gap-1 p-1 rounded-lg border self-start ${
              isDark ? 'bg-black border-[#2f3336]' : 'bg-gray-100 border-gray-200'
            }`}>
              <button
                onClick={() => setTimeRange('7')}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                  timeRange === '7' ? 'bg-[#1d9bf0] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('14')}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                  timeRange === '14' ? 'bg-[#1d9bf0] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                14 Days
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                  timeRange === 'all' ? 'bg-[#1d9bf0] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                All Time
              </button>
            </div>
          </div>

          {/* SVG Trend Line */}
          <div className="relative w-full h-[150px] select-none">
            <svg 
              viewBox={`0 0 ${chartData.width} ${chartData.height}`} 
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`gradient-${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={activeColor} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={activeColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="20" y1="20" x2="480" y2="20" stroke={isDark ? '#2f3336' : '#e5e7eb'} strokeDasharray="3 3" />
              <line x1="20" y1="70" x2="480" y2="70" stroke={isDark ? '#2f3336' : '#e5e7eb'} strokeDasharray="3 3" />
              <line x1="20" y1="120" x2="480" y2="120" stroke={isDark ? '#2f3336' : '#e5e7eb'} strokeDasharray="3 3" />

              {/* Area Under Curve */}
              {chartData.areaPath && (
                <path d={chartData.areaPath} fill={`url(#gradient-${selectedMetric})`} />
              )}

              {/* Trend Line Path */}
              {chartData.path && (
                <path 
                  d={chartData.path} 
                  fill="none" 
                  stroke={activeColor} 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              )}

              {/* Interactive Data Point Dots */}
              {chartData.points.map((pt, idx) => {
                const isHovered = hoveredIndex === idx;
                return (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 3.5}
                      fill={isHovered ? '#ffffff' : activeColor}
                      stroke={activeColor}
                      strokeWidth={isHovered ? 2.5 : 1}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Timeline X-Axis Labels */}
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono mt-1 border-t pt-1.5 border-gray-200/20">
            <span>{filteredLogs[0]?.displayDate}</span>
            <span>{filteredLogs[Math.floor(filteredLogs.length / 2)]?.displayDate}</span>
            <span>{filteredLogs[filteredLogs.length - 1]?.displayDate}</span>
          </div>
        </div>

        {/* Add/Log New Day Form */}
        {showLogForm && (
          <form 
            onSubmit={handleAddLog}
            className={`p-4 rounded-xl border space-y-3 animate-in fade-in duration-150 ${
              isDark ? 'bg-[#121318] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-xs flex items-center gap-1.5 text-[#1d9bf0]">
                <Plus className="w-3.5 h-3.5" />
                <span>Log Daily Snapshot to localStorage</span>
              </h4>
              <button
                type="button"
                onClick={handleAutoFillFromFeed}
                className="text-[11px] text-[#1d9bf0] hover:underline flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Calculate from Feed</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">Date</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-xs ${
                    isDark ? 'bg-black border-[#2f3336] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">Follower Count</label>
                <input
                  type="number"
                  value={formFollowers}
                  onChange={(e) => setFormFollowers(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border text-xs font-mono ${
                    isDark ? 'bg-black border-[#2f3336] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">Avg Reach Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formViralScore}
                  onChange={(e) => setFormViralScore(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border text-xs font-mono ${
                    isDark ? 'bg-black border-[#2f3336] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">Avg Bookmarks</label>
                <input
                  type="number"
                  value={formBookmarks}
                  onChange={(e) => setFormBookmarks(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border text-xs font-mono ${
                    isDark ? 'bg-black border-[#2f3336] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">Avg Likes</label>
                <input
                  type="number"
                  value={formLikes}
                  onChange={(e) => setFormLikes(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border text-xs font-mono ${
                    isDark ? 'bg-black border-[#2f3336] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">Avg Retweets</label>
                <input
                  type="number"
                  value={formRetweets}
                  onChange={(e) => setFormRetweets(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border text-xs font-mono ${
                    isDark ? 'bg-black border-[#2f3336] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">Avg Impressions</label>
                <input
                  type="number"
                  value={formImpressions}
                  onChange={(e) => setFormImpressions(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border text-xs font-mono ${
                    isDark ? 'bg-black border-[#2f3336] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">Tweets Posted</label>
                <input
                  type="number"
                  value={formTweetsCount}
                  onChange={(e) => setFormTweetsCount(Number(e.target.value))}
                  className={`w-full p-2 rounded-lg border text-xs font-mono ${
                    isDark ? 'bg-black border-[#2f3336] text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-gray-400 mb-0.5">Daily Notes / Experiment</label>
              <input
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="e.g. Tested short questions at 8:45 AM, strong bookmark spike"
                className={`w-full p-2 rounded-lg border text-xs ${
                  isDark ? 'bg-black border-[#2f3336] text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold text-xs transition-colors shadow-xs"
              >
                Save Daily Log
              </button>
              <button
                type="button"
                onClick={() => setShowLogForm(false)}
                className={`px-3 py-2 rounded-lg border text-xs ${
                  isDark ? 'border-gray-800 text-gray-400 hover:text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* History Table */}
        <div className={`rounded-xl border overflow-hidden ${
          isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-200 bg-white'
        }`}>
          <div className={`p-3 border-b flex items-center justify-between text-xs ${
            isDark ? 'border-[#2f3336] bg-black/40' : 'border-gray-100 bg-gray-50'
          }`}>
            <span className="font-bold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>Logged Daily Records ({logs.length} entries)</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="text-[11px] text-[#1d9bf0] hover:underline flex items-center gap-1 font-semibold"
                title="Download CSV export"
              >
                <Download className="w-3 h-3" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleResetToDefault}
                className="text-[11px] text-gray-400 hover:text-red-400 flex items-center gap-1"
                title="Reset to sample data"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[220px]">
            <table className="w-full text-left text-xs font-mono">
              <thead className={`border-b text-[10px] text-gray-400 uppercase tracking-wider sticky top-0 ${
                isDark ? 'bg-[#0f1015] border-[#2f3336]' : 'bg-gray-100 border-gray-200'
              }`}>
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Followers</th>
                  <th className="p-2.5">Net Gain</th>
                  <th className="p-2.5">Avg Reach</th>
                  <th className="p-2.5">Avg Bookmarks</th>
                  <th className="p-2.5">Tweets</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/10">
                {[...logs].reverse().map((entry) => (
                  <tr 
                    key={entry.id} 
                    className={`hover:bg-white/5 transition-colors ${
                      isDark ? 'text-gray-300' : 'text-gray-800'
                    }`}
                  >
                    <td className="p-2.5 font-sans font-medium text-xs whitespace-nowrap">
                      {entry.displayDate}
                    </td>
                    <td className="p-2.5 font-bold">
                      {entry.followers.toLocaleString()}
                    </td>
                    <td className="p-2.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        entry.netFollowersChange >= 0
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-red-500/15 text-red-400'
                      }`}>
                        {entry.netFollowersChange >= 0 ? `+${entry.netFollowersChange}` : entry.netFollowersChange}
                      </span>
                    </td>
                    <td className="p-2.5 text-emerald-400 font-bold">
                      {entry.avgViralScore}%
                    </td>
                    <td className="p-2.5 text-amber-400 font-bold">
                      {entry.avgBookmarks}
                    </td>
                    <td className="p-2.5 text-gray-400">
                      {entry.tweetsCount}
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => handleDeleteLog(entry.id)}
                        className="text-gray-500 hover:text-red-400 p-1 rounded"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
