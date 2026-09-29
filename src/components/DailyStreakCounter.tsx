import React, { useState, useEffect } from 'react';
import { Flame, Check, Shield, Trophy, ChevronDown, ChevronUp, Sparkles, Calendar, Zap, AlertCircle } from 'lucide-react';
import { DailyStreakData, ThemeMode } from '../types';
import { getDailyStreakData, recordTodayStreakActivity, getPast7DaysVisual } from '../utils/streak';

interface DailyStreakCounterProps {
  theme: ThemeMode;
  onActivityLogged?: () => void;
  compact?: boolean;
}

export const DailyStreakCounter: React.FC<DailyStreakCounterProps> = ({
  theme,
  onActivityLogged,
  compact = false,
}) => {
  const isDark = theme === 'dark';
  const [streakData, setStreakData] = useState<DailyStreakData>(getDailyStreakData);
  const [isExpanded, setIsExpanded] = useState(false);
  const [celebrateEffect, setCelebrateEffect] = useState(false);

  // Sync streak state on mount and register a listener if other tabs/components update it
  useEffect(() => {
    const refresh = () => {
      setStreakData(getDailyStreakData());
    };
    refresh();

    window.addEventListener('storage', refresh);
    window.addEventListener('tweetiq-activity-logged', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('tweetiq-activity-logged', refresh);
    };
  }, []);

  const handleManualCheckIn = () => {
    const updated = recordTodayStreakActivity();
    setStreakData(updated);
    setCelebrateEffect(true);
    setTimeout(() => setCelebrateEffect(false), 2400);

    // Dispatch global event for other components
    window.dispatchEvent(new Event('tweetiq-activity-logged'));
    if (onActivityLogged) onActivityLogged();
  };

  const past7Days = getPast7DaysVisual(streakData.history);

  // Calculate progress toward next milestone (e.g., 7, 10, 14, 21, 30, 50, 100)
  const milestones = [3, 7, 10, 14, 21, 30, 50, 100];
  const nextMilestone = milestones.find((m) => m > streakData.currentStreak) || streakData.currentStreak + 7;
  const prevMilestone = [...milestones].reverse().find((m) => m <= streakData.currentStreak) || 0;
  const milestoneProgress = Math.min(
    100,
    Math.max(10, Math.round(((streakData.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100))
  );

  return (
    <div
      className={`border-b transition-colors relative ${
        isDark ? 'bg-[#090a0d] border-[#2f3336]' : 'bg-gray-50/70 border-gray-200'
      }`}
    >
      {/* Creator Profile & Main Streak Row */}
      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          {/* User Profile Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt="Alex Growth"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#ff7a00]/30"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
                  isDark ? 'border-[#000000]' : 'border-white'
                } ${streakData.todayActive ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}
                title={streakData.todayActive ? 'Active Today' : 'Pending Daily Post'}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs truncate leading-tight">Alex Growth</span>
                <svg className="w-3.5 h-3.5 text-[#1d9bf0] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.475 9.55.6 10.92.6 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4zm-12.7 4.7l-3.5-3.5 1.4-1.4 2.1 2.1 6.3-6.3 1.4 1.4-7.7 7.7z" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <span className="truncate">@alex_growth</span>
                <span>·</span>
                <span className="text-[10px] text-emerald-500 font-semibold">{streakData.consistencyScore}% consistency</span>
              </div>
            </div>
          </div>

          {/* Interactive Streak Pill / Trigger */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 py-1 px-2.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
              celebrateEffect
                ? 'bg-[#ff7a00]/25 border-[#ff7a00] scale-105'
                : streakData.todayActive
                ? isDark
                  ? 'bg-[#ff7a00]/10 border-[#ff7a00]/30 hover:border-[#ff7a00]/60 text-white'
                  : 'bg-orange-50 border-orange-200 hover:border-orange-300 text-orange-950'
                : isDark
                ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60 text-amber-200'
                : 'bg-amber-50 border-amber-200 hover:border-amber-300 text-amber-900'
            }`}
            title="Click to view daily streak breakdown & reach multiplier"
          >
            <div className="flex items-center gap-1.5">
              <span className="relative flex items-center justify-center">
                <Flame
                  className={`w-4 h-4 ${
                    streakData.currentStreak > 0
                      ? 'text-[#ff6b00] fill-[#ff6b00] animate-pulse'
                      : 'text-gray-400'
                  }`}
                />
              </span>
              <div className="text-left">
                <div className="flex items-baseline gap-1 leading-none">
                  <span className="font-mono font-bold text-xs tracking-tight">
                    {streakData.currentStreak}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#ff7a00]">
                    {streakData.currentStreak === 1 ? 'Day' : 'Days'}
                  </span>
                </div>
              </div>
            </div>

            {isExpanded ? (
              <ChevronUp className="w-3 h-3 text-gray-400 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 text-gray-400 ml-0.5" />
            )}
          </button>
        </div>

        {/* 7-Day Mini Calendar Strip */}
        <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span>Past 7 Days:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {past7Days.map((day, idx) => (
              <div
                key={day.dateStr}
                className="flex flex-col items-center gap-0.5"
                title={`${day.dateStr}${day.isToday ? ' (Today)' : ''}: ${day.isActive ? 'Active' : 'Inactive'}`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-mono font-semibold transition-all ${
                    day.isActive
                      ? 'bg-[#ff7a00] text-black font-bold shadow-xs'
                      : day.isToday
                      ? isDark
                        ? 'border border-dashed border-[#ff7a00] text-[#ff7a00] bg-[#ff7a00]/10'
                        : 'border border-dashed border-orange-400 text-orange-600 bg-orange-50'
                      : isDark
                      ? 'bg-white/5 text-gray-500'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day.isActive ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : (
                    <span>{day.dayShort}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Check-in action if not checked in today */}
          {!streakData.todayActive ? (
            <button
              onClick={handleManualCheckIn}
              className="text-[10px] bg-[#ff7a00] hover:bg-[#e06900] text-black font-bold px-2 py-0.5 rounded transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0 ml-1"
              title="Record today's active session"
            >
              <Zap className="w-2.5 h-2.5 fill-black" />
              <span>Check-in</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-semibold shrink-0 ml-1">
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Logged</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Streak Details & Algorithmic Multipliers Drawer */}
      {isExpanded && (
        <div
          className={`px-3 pb-3 pt-1 border-t space-y-2.5 text-xs animate-in slide-in-from-top-2 duration-150 ${
            isDark ? 'border-[#2f3336] bg-[#0c0d10]' : 'border-gray-100 bg-white'
          }`}
        >
          {/* Milestone Progress Bar */}
          <div className={`p-2.5 rounded-lg border ${
            isDark ? 'bg-[#121418] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-gray-300 dark:text-gray-200">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Next Milestone: {nextMilestone} Days</span>
              </div>
              <span className="font-mono text-[10px] text-gray-400">
                {nextMilestone - streakData.currentStreak} days to go
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-[#ff7a00] h-full rounded-full transition-all duration-500"
                style={{ width: `${milestoneProgress}%` }}
              />
            </div>
          </div>

          {/* 3 Key Consistency Metrics */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className={`p-2 rounded-lg border ${
              isDark ? 'bg-[#121418] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-[10px] text-gray-400">Best Streak</div>
              <div className="font-mono font-bold text-xs text-[#ff7a00]">
                {streakData.longestStreak}d
              </div>
            </div>

            <div className={`p-2 rounded-lg border ${
              isDark ? 'bg-[#121418] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-[10px] text-gray-400">Total Active</div>
              <div className="font-mono font-bold text-xs text-[#1d9bf0]">
                {streakData.totalActiveDays}d
              </div>
            </div>

            <div className={`p-2 rounded-lg border ${
              isDark ? 'bg-[#121418] border-[#2f3336]' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="text-[10px] text-gray-400">Reach Multiplier</div>
              <div className="font-mono font-bold text-xs text-emerald-500">
                +{Math.min(25, Math.max(5, streakData.currentStreak * 2))}%
              </div>
            </div>
          </div>

          {/* Streak Freeze & Algorithm Perk Notice */}
          <div className={`p-2 rounded-lg flex items-center justify-between text-[11px] ${
            isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Streak Freeze Shield:</span>
            </div>
            <span className="font-semibold text-cyan-400">
              {streakData.freezesRemaining > 0 ? `${streakData.freezesRemaining} Active` : '0 Available'}
            </span>
          </div>

          {/* Check-in CTA button inside drawer */}
          {!streakData.todayActive && (
            <button
              onClick={handleManualCheckIn}
              className="w-full py-1.5 px-3 rounded-lg bg-[#ff7a00] hover:bg-[#e06900] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Confirm Today's Active Session</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
