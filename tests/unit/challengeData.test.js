import { describe, it, expect } from 'vitest';
import {
  getEarnedBadges,
  calculatePoints,
  getCompletedCategories,
  BADGES,
} from '../../src/utils/challengeData';

describe('challengeData - getEarnedBadges', () => {
  it('should evaluate requirements and award badges accordingly', () => {
    // 1. Minimum progress
    const progressMin = {
      completedCount: 0,
      currentStreak: 0,
      totalPoints: 0,
      reductionPercent: 0,
      categoriesCompleted: [],
    };
    const badgesMin = getEarnedBadges(progressMin);
    expect(badgesMin.length).toBe(BADGES.length);
    badgesMin.forEach(b => {
      expect(b.earned).toBe(false);
    });

    // 2. Award First Step (challenges count >= 1) and Point Collector (points >= 100)
    const progressMid = {
      completedCount: 5,
      currentStreak: 4,
      totalPoints: 120,
      reductionPercent: 12, // awards b10 (reduction >= 10%)
      categoriesCompleted: ['food', 'water'],
    };
    const badgesMid = getEarnedBadges(progressMid);
    
    // First Step (b1: challenges count 1) - bronze - earned: true
    const b1 = badgesMid.find(b => b.id === 'b1');
    expect(b1.earned).toBe(true);
    expect(b1.tierColor).toBe('#cd7f32'); // bronze

    // Eco Warrior (b2: challenges count 10) - silver - earned: false
    const b2 = badgesMid.find(b => b.id === 'b2');
    expect(b2.earned).toBe(false);

    // 3-Day Streak (b5: streak >= 3) - bronze - earned: true
    const b5 = badgesMid.find(b => b.id === 'b5');
    expect(b5.earned).toBe(true);

    // 7-Day Streak (b6: streak >= 7) - silver - earned: false
    const b6 = badgesMid.find(b => b.id === 'b6');
    expect(b6.earned).toBe(false);

    // Point Collector (b8: points >= 100) - bronze - earned: true
    const b8 = badgesMid.find(b => b.id === 'b8');
    expect(b8.earned).toBe(true);

    // Point Master (b9: points >= 500) - silver - earned: false
    const b9 = badgesMid.find(b => b.id === 'b9');
    expect(b9.earned).toBe(false);

    // Carbon Cutter (b10: reduction >= 10) - silver - earned: true
    const b10 = badgesMid.find(b => b.id === 'b10');
    expect(b10.earned).toBe(true);
    expect(b10.tierColor).toBe('#c0c0c0'); // silver

    // Sustainability Pro (b11: categories >= 5) - gold - earned: false
    const b11 = badgesMid.find(b => b.id === 'b11');
    expect(b11.earned).toBe(false);

    // 3. Ultimate badge (totalPoints >= 1000 and completedCount >= 50)
    const progressHero = {
      completedCount: 55,
      currentStreak: 35,
      totalPoints: 1200,
      reductionPercent: 15,
      categoriesCompleted: ['food', 'water', 'energy', 'transport', 'waste'],
    };
    const badgesHero = getEarnedBadges(progressHero);

    // Climate Hero (b12) - earned: true
    const b12 = badgesHero.find(b => b.id === 'b12');
    expect(b12.earned).toBe(true);
    expect(b12.tierColor).toBe('#e5e4e2'); // platinum

    // Sustainability Pro (b11) - earned: true (all 5 categories)
    expect(badgesHero.find(b => b.id === 'b11').earned).toBe(true);
  });
});

describe('challengeData - calculatePoints', () => {
  it('should sum points of completed challenges', () => {
    // d1: 10 points
    // d2: 10 points
    // w1: 50 points
    // invalid ID: 0 points
    expect(calculatePoints(['d1', 'd2', 'w1', 'invalid-id'])).toBe(70);
  });

  it('should return 0 for empty array', () => {
    expect(calculatePoints([])).toBe(0);
  });
});

describe('challengeData - getCompletedCategories', () => {
  it('should return list of unique categories completed', () => {
    // d1 (food), d2 (water), w1 (food)
    expect(getCompletedCategories(['d1', 'd2', 'w1'])).toEqual(expect.arrayContaining(['food', 'water']));
    expect(getCompletedCategories(['d1', 'd2', 'w1']).length).toBe(2);
  });

  it('should return empty array when no valid challenges completed', () => {
    expect(getCompletedCategories(['invalid-id'])).toEqual([]);
  });
});
