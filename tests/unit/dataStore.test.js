import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  saveCarbonData,
  getCarbonData,
  getHistory,
  clearHistory,
  getChallengeProgress,
  saveChallengeProgress,
  completeChallenge,
  getChatHistory,
  saveChatMessage,
  clearChatHistory,
  getGoals,
  saveGoal,
  updateGoal,
  getTheme,
  setTheme,
  getProfile,
  saveProfile,
  resetAllData,
} from '../../src/utils/dataStore';

describe('dataStore - localStorage operations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should save and get carbon data, updating history', () => {
    const data = {
      monthlyTotal: 300,
      breakdown: { transportation: 100, energy: 200 },
      score: 70,
    };

    saveCarbonData(data);
    const retrieved = getCarbonData();
    expect(retrieved.monthlyTotal).toBe(300);
    expect(retrieved.score).toBe(70);
    expect(retrieved.timestamp).toBeDefined();

    // Verify it automatically added to history
    const history = getHistory();
    expect(history.length).toBe(1);
    expect(history[0].monthlyTotal).toBe(300);
    expect(history[0].score).toBe(70);
  });

  it('should clear history correctly', () => {
    const data = { monthlyTotal: 300 };
    saveCarbonData(data);
    expect(getHistory().length).toBe(1);

    clearHistory();
    expect(getHistory()).toEqual([]);
  });

  it('should manage challenge progress and streaks correctly', () => {
    // 1. Initial/Default progress
    const initialProgress = getChallengeProgress();
    expect(initialProgress.completed).toEqual([]);
    expect(initialProgress.currentStreak).toBe(0);
    expect(initialProgress.longestStreak).toBe(0);
    expect(initialProgress.totalPoints).toBe(0);

    // 2. Complete a challenge today (streak starts at 1)
    const prog1 = completeChallenge('c1', 50);
    expect(prog1.completed).toContain('c1');
    expect(prog1.totalPoints).toBe(50);
    expect(prog1.currentStreak).toBe(1);
    expect(prog1.longestStreak).toBe(1);
    expect(prog1.lastCompletedDate).toBeDefined();

    // 3. Completing the same challenge again should not change anything
    const prog2 = completeChallenge('c1', 50);
    expect(prog2.totalPoints).toBe(50);

    // 4. Complete another challenge today (streak stays 1, points increase)
    const prog3 = completeChallenge('c2', 30);
    expect(prog3.completed).toContain('c2');
    expect(prog3.totalPoints).toBe(80);
    expect(prog3.currentStreak).toBe(1);
  });

  it('should increment streak when completed on consecutive days', () => {
    vi.useFakeTimers();

    // Complete first challenge on day 1
    const day1 = new Date(2026, 5, 9, 12, 0, 0);
    vi.setSystemTime(day1);
    completeChallenge('c1', 50);
    expect(getChallengeProgress().currentStreak).toBe(1);

    // Complete second challenge on day 2 (yesterday = day 1)
    const day2 = new Date(2026, 5, 10, 12, 0, 0);
    vi.setSystemTime(day2);
    completeChallenge('c2', 50);
    expect(getChallengeProgress().currentStreak).toBe(2);
    expect(getChallengeProgress().longestStreak).toBe(2);

    // Complete third challenge on day 4 (skipping a day, streak should reset to 1)
    const day4 = new Date(2026, 5, 12, 12, 0, 0);
    vi.setSystemTime(day4);
    completeChallenge('c3', 50);
    expect(getChallengeProgress().currentStreak).toBe(1);
    expect(getChallengeProgress().longestStreak).toBe(2); // Longest streak remains 2

    vi.useRealTimers();
  });

  it('should log and clear chat history', () => {
    expect(getChatHistory()).toEqual([]);

    saveChatMessage('user', 'Hello');
    saveChatMessage('assistant', 'Hi there');

    const history = getChatHistory();
    expect(history.length).toBe(2);
    expect(history[0]).toMatchObject({ role: 'user', text: 'Hello' });
    expect(history[1]).toMatchObject({ role: 'assistant', text: 'Hi there' });

    clearChatHistory();
    expect(getChatHistory()).toEqual([]);
  });

  it('should manage goals', () => {
    expect(getGoals()).toEqual([]);

    const goal = { title: 'Reduce energy', category: 'energy' };
    const goalsList = saveGoal(goal);
    expect(goalsList.length).toBe(1);
    expect(goalsList[0].title).toBe('Reduce energy');
    expect(goalsList[0].completed).toBe(false);
    expect(goalsList[0].id).toBeDefined();

    const goalId = goalsList[0].id;
    const updated = updateGoal(goalId, { completed: true });
    expect(updated[0].completed).toBe(true);
  });

  it('should save and retrieve theme and profile settings', () => {
    expect(getTheme()).toBe('light');
    setTheme('dark');
    expect(getTheme()).toBe('dark');

    expect(getProfile()).toEqual({ name: 'Eco Explorer' });
    saveProfile({ name: 'Jane Doe', country: 'US' });
    expect(getProfile()).toEqual({ name: 'Jane Doe', country: 'US' });
  });

  it('should reset all data from localStorage', () => {
    setTheme('dark');
    saveProfile({ name: 'Jane Doe' });

    resetAllData();
    expect(getTheme()).toBe('light');
    expect(getProfile()).toEqual({ name: 'Eco Explorer' });
  });
});
