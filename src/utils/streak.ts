import { DailyStreakData } from '../types';

const STREAK_STORAGE_KEY = 'tweetiq_daily_streak';

/**
 * Helper to get date string in local YYYY-MM-DD
 */
export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Computes difference in calendar days between two YYYY-MM-DD strings
 */
export const getDayDiff = (olderDateStr: string, newerDateStr: string): number => {
  const d1 = new Date(olderDateStr + 'T00:00:00');
  const d2 = new Date(newerDateStr + 'T00:00:00');
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Initializes realistic baseline streak data if not yet stored
 */
const getInitialStreakData = (): DailyStreakData => {
  const today = new Date();
  const todayStr = getLocalDateString(today);

  // Generate the last 7 days as active history by default so user has an established streak
  const initialHistory: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - i);
    initialHistory.push(getLocalDateString(pastDate));
  }

  return {
    currentStreak: 7,
    longestStreak: 18,
    lastActiveDate: todayStr,
    todayActive: true,
    history: initialHistory,
    freezesRemaining: 1,
    totalActiveDays: 34,
    consistencyScore: 98,
  };
};

/**
 * Retrieves the current streak data and reconciles with today's date
 */
export const getDailyStreakData = (): DailyStreakData => {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialStreakData();
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const data: DailyStreakData = JSON.parse(raw);
    const todayStr = getLocalDateString();
    
    // Check days since last active
    if (!data.lastActiveDate) {
      data.lastActiveDate = todayStr;
      data.todayActive = true;
      data.currentStreak = Math.max(1, data.currentStreak || 1);
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
      return data;
    }

    const diff = getDayDiff(data.lastActiveDate, todayStr);

    if (diff === 0) {
      // Already active today
      data.todayActive = true;
    } else if (diff === 1) {
      // Last active was yesterday, streak is valid but today hasn't been logged yet
      data.todayActive = false;
    } else if (diff > 1) {
      // Missed at least 1 full day
      if (data.freezesRemaining > 0 && diff === 2) {
        // Automatically consume freeze to protect streak
        data.freezesRemaining -= 1;
        data.todayActive = false;
      } else {
        // Streak broken, resets to 0 (or 1 once active today)
        data.currentStreak = 0;
        data.todayActive = false;
      }
    }

    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
    return data;
  } catch {
    return getInitialStreakData();
  }
};

/**
 * Records activity for today (e.g. when composing, posting, proofreading, or clicking check-in)
 */
export const recordTodayStreakActivity = (): DailyStreakData => {
  try {
    const current = getDailyStreakData();
    const todayStr = getLocalDateString();

    if (current.lastActiveDate === todayStr && current.todayActive) {
      return current; // already logged
    }

    const diff = getDayDiff(current.lastActiveDate, todayStr);
    let newStreak = current.currentStreak;

    if (diff === 1) {
      newStreak += 1;
    } else if (diff === 0) {
      newStreak = Math.max(1, newStreak);
    } else {
      // Reset streak
      newStreak = 1;
    }

    const newHistory = Array.isArray(current.history) ? [...current.history] : [];
    if (!newHistory.includes(todayStr)) {
      newHistory.push(todayStr);
    }

    const longest = Math.max(newStreak, current.longestStreak || 0);

    const updated: DailyStreakData = {
      ...current,
      currentStreak: newStreak,
      longestStreak: longest,
      lastActiveDate: todayStr,
      todayActive: true,
      history: newHistory,
      totalActiveDays: (current.totalActiveDays || 0) + 1,
      consistencyScore: Math.min(100, Math.max(80, Math.round((newStreak / Math.max(newStreak, 14)) * 100))),
    };

    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getInitialStreakData();
  }
};

/**
 * Returns formatted past 7 days for the streak week visualizer
 */
export const getPast7DaysVisual = (history: string[] = []): {
  dateStr: string;
  dayShort: string;
  dayNumber: string;
  isActive: boolean;
  isToday: boolean;
}[] => {
  const days: {
    dateStr: string;
    dayShort: string;
    dayNumber: string;
    isActive: boolean;
    isToday: boolean;
  }[] = [];

  const today = new Date();
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = getLocalDateString(d);
    const dayShort = dayLabels[d.getDay()][0]; // 'M', 'T', 'W', etc.
    const dayNumber = String(d.getDate());
    const isToday = i === 0;
    const isActive = history.includes(dateStr);

    days.push({
      dateStr,
      dayShort,
      dayNumber,
      isActive,
      isToday,
    });
  }

  return days;
};
