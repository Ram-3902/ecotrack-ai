import { describe, it, expect } from 'vitest';
import {
  generateInsights,
  getTopInsights,
  getInsightsByCategory,
  calculatePotentialSavings,
  getDifficultyLabel,
  RECOMMENDATIONS_DB,
} from '../../src/utils/insightsEngine';

describe('insightsEngine - generateInsights', () => {
  it('should return empty array when breakdown is null or undefined', () => {
    expect(generateInsights(null)).toEqual([]);
    expect(generateInsights(undefined)).toEqual([]);
  });

  it('should score and boost recommendations based on high-emission categories', () => {
    // Breakdown with transportation as the highest emission, then food, then energy
    const breakdown = {
      transportation: 500,
      food: 300,
      energy: 100,
      shopping: 50,
      water: 10,
    };

    const insights = generateInsights(breakdown);
    expect(insights.length).toBe(RECOMMENDATIONS_DB.length);

    // The result should be sorted by compositeScore descending
    for (let i = 0; i < insights.length - 1; i++) {
      expect(insights[i].compositeScore).toBeGreaterThanOrEqual(insights[i + 1].compositeScore);
    }

    // A transportation recommendation (highest category) should get relevanceScore = 3
    const transRec = insights.find(r => r.category === 'transportation');
    expect(transRec.relevanceScore).toBe(3);

    // A food recommendation (second highest category) should get relevanceScore = 2.5
    const foodRec = insights.find(r => r.category === 'food');
    expect(foodRec.relevanceScore).toBe(2.5);

    // A lifestyle / cross-cutting recommendation or category not in the main mapping
    // (like lifestyle or unrecognized) should get relevanceScore = 1.5 or 1 depending on mapping
    const lifeRec = insights.find(r => r.category === 'lifestyle');
    expect(lifeRec.relevanceScore).toBe(1.5); // categoryIndex of lifestyle is -1, so <= 3 index -> relevanceScore = 1.5
  });
});

describe('insightsEngine - getTopInsights', () => {
  it('should return default 5 insights', () => {
    const breakdown = { transportation: 200, energy: 100 };
    const top = getTopInsights(breakdown);
    expect(top.length).toBe(5);
  });

  it('should return top N insights', () => {
    const breakdown = { transportation: 200, energy: 100 };
    const top = getTopInsights(breakdown, 3);
    expect(top.length).toBe(3);
  });
});

describe('insightsEngine - getInsightsByCategory', () => {
  it('should filter insights by category', () => {
    const breakdown = { transportation: 200, energy: 100 };
    const energyInsights = getInsightsByCategory(breakdown, 'energy');
    
    expect(energyInsights.length).toBeGreaterThan(0);
    energyInsights.forEach(item => {
      expect(item.category).toBe('energy');
    });
  });
});

describe('insightsEngine - calculatePotentialSavings', () => {
  it('should calculate sum of impact and positive cost savings', () => {
    const selected = [
      { impactKg: 100, costSavings: 150 },
      { impactKg: 200, costSavings: -50 }, // negative cost savings should be ignored / treated as 0 in Math.max
      { impactKg: 300, costSavings: 200 },
    ];
    
    const result = calculatePotentialSavings(selected);
    expect(result.co2Kg).toBe(600);
    // 150 + 0 + 200 = 350
    expect(result.costSavings).toBe(350);
  });
});

describe('insightsEngine - getDifficultyLabel', () => {
  it('should return correct difficulty label and color', () => {
    expect(getDifficultyLabel(9)).toEqual({ label: 'Easy', color: '#10b981' });
    expect(getDifficultyLabel(6)).toEqual({ label: 'Moderate', color: '#fbbf24' });
    expect(getDifficultyLabel(3)).toEqual({ label: 'Challenging', color: '#f97316' });
  });
});
