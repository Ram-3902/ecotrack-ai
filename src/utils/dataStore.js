// ═══════════════════════════════════════════
// DATA STORE — LocalStorage Persistence Layer
// ═══════════════════════════════════════════

const STORAGE_KEYS = {
  CARBON_DATA: 'ecotrack_carbon_data',
  HISTORY: 'ecotrack_history',
  CHALLENGES: 'ecotrack_challenges',
  CHAT_HISTORY: 'ecotrack_chat',
  GOALS: 'ecotrack_goals',
  THEME: 'ecotrack_theme',
  PROFILE: 'ecotrack_profile',
};

// ── Generic Storage ──

function getItem(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

// ── Carbon Data ──

export function saveCarbonData(data) {
  setItem(STORAGE_KEYS.CARBON_DATA, {
    ...data,
    timestamp: new Date().toISOString(),
  });

  // Also add to history
  const history = getHistory();
  history.push({
    date: new Date().toISOString(),
    monthlyTotal: data.monthlyTotal,
    breakdown: data.breakdown,
    score: data.score,
  });
  setItem(STORAGE_KEYS.HISTORY, history);
}

export function getCarbonData() {
  return getItem(STORAGE_KEYS.CARBON_DATA);
}

// ── History / Tracking ──

export function getHistory() {
  return getItem(STORAGE_KEYS.HISTORY) || [];
}

export function clearHistory() {
  setItem(STORAGE_KEYS.HISTORY, []);
}

// ── Challenge Progress ──

export function getChallengeProgress() {
  return getItem(STORAGE_KEYS.CHALLENGES) || {
    completed: [],
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    totalPoints: 0,
  };
}

export function saveChallengeProgress(progress) {
  setItem(STORAGE_KEYS.CHALLENGES, progress);
}

export function completeChallenge(challengeId, points) {
  const progress = getChallengeProgress();
  if (!progress.completed.includes(challengeId)) {
    progress.completed.push(challengeId);
    progress.totalPoints += points;

    // Update streak
    const today = new Date().toDateString();
    const lastDate = progress.lastCompletedDate
      ? new Date(progress.lastCompletedDate).toDateString()
      : null;

    if (lastDate === today) {
      // Already completed today, no streak change
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (lastDate === yesterday.toDateString()) {
        progress.currentStreak += 1;
      } else {
        progress.currentStreak = 1;
      }
      progress.longestStreak = Math.max(progress.longestStreak, progress.currentStreak);
    }

    progress.lastCompletedDate = new Date().toISOString();
    saveChallengeProgress(progress);
  }
  return progress;
}

// ── Chat History ──

export function getChatHistory() {
  return getItem(STORAGE_KEYS.CHAT_HISTORY) || [];
}

export function saveChatMessage(role, text) {
  const history = getChatHistory();
  history.push({ role, text, timestamp: new Date().toISOString() });
  setItem(STORAGE_KEYS.CHAT_HISTORY, history);
}

export function clearChatHistory() {
  setItem(STORAGE_KEYS.CHAT_HISTORY, []);
}

// ── Goals ──

export function getGoals() {
  return getItem(STORAGE_KEYS.GOALS) || [];
}

export function saveGoal(goal) {
  const goals = getGoals();
  goals.push({
    id: Date.now().toString(),
    ...goal,
    createdAt: new Date().toISOString(),
    completed: false,
  });
  setItem(STORAGE_KEYS.GOALS, goals);
  return goals;
}

export function updateGoal(id, updates) {
  const goals = getGoals();
  const idx = goals.findIndex(g => g.id === id);
  if (idx !== -1) {
    goals[idx] = { ...goals[idx], ...updates };
    setItem(STORAGE_KEYS.GOALS, goals);
  }
  return goals;
}

// ── Theme ──

export function getTheme() {
  return getItem(STORAGE_KEYS.THEME) || 'light';
}

export function setTheme(theme) {
  setItem(STORAGE_KEYS.THEME, theme);
}

// ── Profile ──

export function getProfile() {
  return getItem(STORAGE_KEYS.PROFILE) || { name: 'Eco Explorer' };
}

export function saveProfile(profile) {
  setItem(STORAGE_KEYS.PROFILE, profile);
}

// ── Reset All ──

export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}
