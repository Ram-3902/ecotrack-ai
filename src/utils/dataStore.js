// ═══════════════════════════════════════════
// DATA STORE — LocalStorage Persistence Layer
// ═══════════════════════════════════════════

import {
  sanitizeTextInput,
  validateNumericInput,
  validateSelectInput,
  validateStorageData,
  validateChallengeId,
  MAX_SHORT_TEXT_LENGTH,
} from './inputSecurity.js';

/** @type {Object<string, string>} Storage key constants for all persisted data. */
const STORAGE_KEYS = {
  CARBON_DATA: 'ecotrack_carbon_data',
  HISTORY: 'ecotrack_history',
  CHALLENGES: 'ecotrack_challenges',
  CHAT_HISTORY: 'ecotrack_chat',
  GOALS: 'ecotrack_goals',
  THEME: 'ecotrack_theme',
  PROFILE: 'ecotrack_profile',
};

/** @type {string[]} Allowed goal categories for validation. */
const ALLOWED_GOAL_CATEGORIES = ['transportation', 'energy', 'food', 'shopping'];

/** @type {string[]} Allowed theme values for validation. */
const ALLOWED_THEMES = ['light', 'dark'];

/** @type {string[]} Allowed chat message roles for validation. */
const ALLOWED_ROLES = ['user', 'ai'];

/** @type {Object} Schema for validating carbon data from storage. */
const CARBON_DATA_SCHEMA = {
  monthlyTotal: 'number',
  yearlyTotal: 'number',
  yearlyTons: 'number',
  score: 'number',
  breakdown: 'object',
};

/** @type {Object} Schema for validating challenge progress from storage. */
const CHALLENGE_PROGRESS_SCHEMA = {
  completed: 'array',
  currentStreak: 'number',
  longestStreak: 'number',
  totalPoints: 'number',
};

// ── Generic Storage ──

/**
 * Retrieves and parses a value from localStorage.
 * Returns null if the key doesn't exist or if parsing fails.
 * Clears corrupted entries on parse failure.
 *
 * @param {string} key - The localStorage key to retrieve.
 * @returns {*} The parsed value, or null on failure.
 */
function getItem(key) {
  try {
    const data = localStorage.getItem(key);
    if (data === null) return null;
    return JSON.parse(data);
  } catch {
    // Clear corrupted data to prevent repeated parse failures
    console.warn(`[DataStore] Corrupted data detected for key "${key}", clearing entry.`);
    try { localStorage.removeItem(key); } catch { /* ignore removal failure */ }
    return null;
  }
}

/**
 * Serializes and persists a value to localStorage.
 * Silently catches quota exceeded and other write errors.
 *
 * @param {string} key - The localStorage key to set.
 * @param {*} value - The value to serialize and store.
 */
function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[DataStore] localStorage write failed:', e.message || e);
  }
}

// ── Carbon Data ──

/**
 * Validates and persists carbon footprint data to localStorage.
 * All numeric fields are validated and clamped to safe ranges.
 * Also appends a timestamped entry to history.
 *
 * @param {Object} data - The carbon data object.
 * @param {number} data.monthlyTotal - Monthly CO₂ in kg.
 * @param {Object} data.breakdown - Per-category emission breakdown.
 * @param {number} data.score - Planetary health score (0-100).
 */
export function saveCarbonData(data) {
  if (!data || typeof data !== 'object') return;

  const sanitizedData = {
    ...data,
    monthlyTotal: validateNumericInput(data.monthlyTotal, 0, 100000, 0),
    yearlyTotal: validateNumericInput(data.yearlyTotal, 0, 1200000, 0),
    yearlyTons: validateNumericInput(data.yearlyTons, 0, 1200, 0),
    score: validateNumericInput(data.score, 0, 100, 50),
    timestamp: new Date().toISOString(),
  };

  // Validate breakdown fields if present
  if (data.breakdown && typeof data.breakdown === 'object') {
    sanitizedData.breakdown = {};
    for (const [cat, val] of Object.entries(data.breakdown)) {
      sanitizedData.breakdown[cat] = validateNumericInput(val, 0, 100000, 0);
    }
  }

  setItem(STORAGE_KEYS.CARBON_DATA, sanitizedData);

  // Also add to history
  const history = getHistory();
  history.push({
    date: new Date().toISOString(),
    monthlyTotal: sanitizedData.monthlyTotal,
    breakdown: sanitizedData.breakdown,
    score: sanitizedData.score,
  });
  setItem(STORAGE_KEYS.HISTORY, history);
}

/**
 * Retrieves and validates carbon data from localStorage.
 *
 * @returns {Object|null} The validated carbon data, or null if not found or invalid.
 */
export function getCarbonData() {
  const data = getItem(STORAGE_KEYS.CARBON_DATA);
  return validateStorageData(data, CARBON_DATA_SCHEMA);
}

// ── History / Tracking ──

/**
 * Retrieves the emission history array from localStorage.
 *
 * @returns {Array<Object>} Array of historical emission data entries.
 */
export function getHistory() {
  const data = getItem(STORAGE_KEYS.HISTORY);
  return Array.isArray(data) ? data : [];
}

/**
 * Clears all emission history entries from localStorage.
 */
export function clearHistory() {
  setItem(STORAGE_KEYS.HISTORY, []);
}

// ── Challenge Progress ──

/**
 * Retrieves and validates the challenge progress from localStorage.
 *
 * @returns {Object} The challenge progress object with defaults for missing fields.
 * @returns {string[]} returns.completed - Array of completed challenge IDs.
 * @returns {number} returns.currentStreak - Current completion streak in days.
 * @returns {number} returns.longestStreak - Longest streak achieved.
 * @returns {string|null} returns.lastCompletedDate - ISO timestamp of last completion.
 * @returns {number} returns.totalPoints - Total XP earned.
 */
export function getChallengeProgress() {
  const data = getItem(STORAGE_KEYS.CHALLENGES);
  const validated = validateStorageData(data, CHALLENGE_PROGRESS_SCHEMA);

  return validated || {
    completed: [],
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    totalPoints: 0,
  };
}

/**
 * Persists challenge progress to localStorage with field validation.
 *
 * @param {Object} progress - The challenge progress object.
 */
export function saveChallengeProgress(progress) {
  if (!progress || typeof progress !== 'object') return;

  const sanitized = {
    completed: Array.isArray(progress.completed) ? progress.completed : [],
    currentStreak: validateNumericInput(progress.currentStreak, 0, 99999, 0),
    longestStreak: validateNumericInput(progress.longestStreak, 0, 99999, 0),
    lastCompletedDate: progress.lastCompletedDate || null,
    totalPoints: validateNumericInput(progress.totalPoints, 0, 9999999, 0),
  };

  setItem(STORAGE_KEYS.CHALLENGES, sanitized);
}

/**
 * Marks a challenge as completed, updates streak, and persists progress.
 * Validates the challenge ID format and points value before processing.
 *
 * @param {string} challengeId - The challenge ID to mark as completed (e.g., 'd1', 'w3').
 * @param {number} points - The XP points to award for this challenge.
 * @returns {Object} The updated challenge progress object.
 */
export function completeChallenge(challengeId, points) {
  // Validate challenge ID format
  if (!validateChallengeId(challengeId)) {
    console.warn(`[DataStore] Invalid challenge ID format: "${challengeId}"`);
    return getChallengeProgress();
  }

  // Validate points
  const validPoints = validateNumericInput(points, 0, 500, 0);

  const progress = getChallengeProgress();
  if (!progress.completed.includes(challengeId)) {
    progress.completed.push(challengeId);
    progress.totalPoints += validPoints;

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

/**
 * Retrieves the chat message history array from localStorage.
 *
 * @returns {Array<Object>} Array of chat message objects.
 */
export function getChatHistory() {
  const data = getItem(STORAGE_KEYS.CHAT_HISTORY);
  return Array.isArray(data) ? data : [];
}

/**
 * Saves a chat message to the persisted history.
 * Validates the role and sanitizes the message text.
 *
 * @param {string} role - The message sender role ('user' or 'ai').
 * @param {string} text - The message text content.
 */
export function saveChatMessage(role, text) {
  const validRole = validateSelectInput(role, ALLOWED_ROLES, 'user');
  const sanitizedText = sanitizeTextInput(text);

  const history = getChatHistory();
  history.push({ role: validRole, text: sanitizedText, timestamp: new Date().toISOString() });
  setItem(STORAGE_KEYS.CHAT_HISTORY, history);
}

/**
 * Clears all chat history from localStorage.
 */
export function clearChatHistory() {
  setItem(STORAGE_KEYS.CHAT_HISTORY, []);
}

// ── Goals ──

/**
 * Retrieves the goals array from localStorage.
 *
 * @returns {Array<Object>} Array of goal objects.
 */
export function getGoals() {
  const data = getItem(STORAGE_KEYS.GOALS);
  return Array.isArray(data) ? data : [];
}

/**
 * Validates, sanitizes, and saves a new goal to localStorage.
 * Goal title is sanitized for XSS prevention, category is whitelist-validated,
 * and numeric fields are clamped to safe ranges.
 *
 * @param {Object} goal - The goal object to save.
 * @param {string} goal.title - The goal title (will be sanitized).
 * @param {string} goal.category - The goal category (must be in allowed list).
 * @param {number} goal.targetReduction - The reduction target percentage (1-100).
 * @returns {Array<Object>} The updated goals array.
 */
export function saveGoal(goal) {
  if (!goal || typeof goal !== 'object') return getGoals();

  const goals = getGoals();
  goals.push({
    id: Date.now().toString(),
    title: sanitizeTextInput(goal.title || '', MAX_SHORT_TEXT_LENGTH),
    category: validateSelectInput(goal.category, ALLOWED_GOAL_CATEGORIES, 'transportation'),
    targetReduction: validateNumericInput(goal.targetReduction, 1, 100, 20),
    currentProgress: validateNumericInput(goal.currentProgress, 0, 100, 0),
    unit: '%',
    deadline: goal.deadline || new Date(Date.now() + 60 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    completed: false,
  });
  setItem(STORAGE_KEYS.GOALS, goals);
  return goals;
}

/**
 * Updates an existing goal by ID with validated fields.
 *
 * @param {string} id - The goal ID to update.
 * @param {Object} updates - The fields to update.
 * @returns {Array<Object>} The updated goals array.
 */
export function updateGoal(id, updates) {
  if (typeof id !== 'string') return getGoals();

  const goals = getGoals();
  const idx = goals.findIndex(g => g.id === id);
  if (idx !== -1) {
    // Sanitize any title updates
    if (updates.title !== undefined) {
      updates.title = sanitizeTextInput(updates.title, MAX_SHORT_TEXT_LENGTH);
    }
    goals[idx] = { ...goals[idx], ...updates };
    setItem(STORAGE_KEYS.GOALS, goals);
  }
  return goals;
}

// ── Theme ──

/**
 * Retrieves the current theme preference from localStorage.
 *
 * @returns {string} The theme name ('light' or 'dark').
 */
export function getTheme() {
  const theme = getItem(STORAGE_KEYS.THEME);
  return validateSelectInput(theme, ALLOWED_THEMES, 'light');
}

/**
 * Validates and persists the theme preference to localStorage.
 *
 * @param {string} theme - The theme to set ('light' or 'dark').
 */
export function setTheme(theme) {
  const validTheme = validateSelectInput(theme, ALLOWED_THEMES, 'light');
  setItem(STORAGE_KEYS.THEME, validTheme);
}

// ── Profile ──

/**
 * Retrieves the user profile from localStorage.
 *
 * @returns {Object} The user profile object with a 'name' field.
 */
export function getProfile() {
  return getItem(STORAGE_KEYS.PROFILE) || { name: 'Eco Explorer' };
}

/**
 * Validates and persists the user profile to localStorage.
 * The profile name is sanitized to prevent XSS.
 *
 * @param {Object} profile - The profile object.
 * @param {string} profile.name - The user's display name (will be sanitized).
 */
export function saveProfile(profile) {
  if (!profile || typeof profile !== 'object') return;

  const sanitized = {
    ...profile,
    name: sanitizeTextInput(profile.name || 'Eco Explorer', MAX_SHORT_TEXT_LENGTH),
  };
  setItem(STORAGE_KEYS.PROFILE, sanitized);
}

// ── Reset All ──

/**
 * Removes all EcoTrack data from localStorage.
 * This action is irreversible.
 */
export function resetAllData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    try { localStorage.removeItem(key); } catch { /* ignore removal failure */ }
  });
}
