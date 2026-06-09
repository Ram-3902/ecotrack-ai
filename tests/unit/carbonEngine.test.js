import { describe, it, expect } from 'vitest';
import {
  calculateTransportation,
  calculateEnergy,
  calculateFood,
  calculateShopping,
  calculateWater,
  calculateTotal,
  calculateCarbonScore,
  getScoreInfo,
  compareWithAverage,
} from '../../src/utils/carbonEngine';

describe('carbonEngine - calculateTransportation', () => {
  it('should return 0 when data is empty', () => {
    expect(calculateTransportation({})).toBe(0);
  });

  it('should calculate car emissions correctly', () => {
    // Gasoline: 80 km/week * 4.33 weeks * 0.21 kg/km = 72.74
    expect(calculateTransportation({ carType: 'gasoline', carKmPerWeek: 80 })).toBeCloseTo(72.74, 1);
    
    // Electric: 100 km/week * 4.33 * 0.05 = 21.65
    expect(calculateTransportation({ carType: 'electric', carKmPerWeek: 100 })).toBeCloseTo(21.65, 1);

    // Hybrid: 150 km/week * 4.33 * 0.11 = 71.45
    expect(calculateTransportation({ carType: 'hybrid', carKmPerWeek: 150 })).toBeCloseTo(71.45, 1);
  });

  it('should calculate public transit emissions correctly', () => {
    // Bus: 50 km/week * 4.33 * 0.089 = 19.27
    // Train: 30 km/week * 4.33 * 0.041 = 5.33
    // Subway: 20 km/week * 4.33 * 0.033 = 2.86
    expect(calculateTransportation({
      busKmPerWeek: 50,
      trainKmPerWeek: 30,
      subwayKmPerWeek: 20,
    })).toBeCloseTo(27.46, 1);
  });

  it('should calculate flights emissions correctly', () => {
    // Short flights (< 1500 km): 2 flights * 1000 km * 0.255 * 2 (round trip) / 12 months = 85
    expect(calculateTransportation({ flightsPerYear: 2, avgFlightDistanceKm: 1000 })).toBe(85.00);

    // Long flights (> 1500 km): 1 flight * 2000 km * 0.195 * 2 / 12 = 65
    expect(calculateTransportation({ flightsPerYear: 1, avgFlightDistanceKm: 2000 })).toBe(65.00);
  });
});

describe('carbonEngine - calculateEnergy', () => {
  it('should calculate electricity emissions with renewable mix', () => {
    // 300 kWh * 80% grid * 0.42 + 300 * 20% renewable * 0.05 = 100.8 + 3 = 103.8
    expect(calculateEnergy({ electricityKwhPerMonth: 300, renewablePercent: 20 })).toBe(103.8);
  });

  it('should calculate heating emissions for natural gas', () => {
    // 2 hours/day * 30 days * 0.3 * 2.0 kg/m3 = 36 kg
    expect(calculateEnergy({ heatingType: 'natural_gas', heatingHoursPerDay: 2 })).toBe(36.00);
  });

  it('should return 0 for electric heating (already counted in electricity)', () => {
    expect(calculateEnergy({ heatingType: 'electric', heatingHoursPerDay: 2 })).toBe(0.00);
  });
});

describe('carbonEngine - calculateFood', () => {
  it('should calculate emissions based on diet and food waste', () => {
    // Vegan: 1.5 * 30 * 1.10 (10% waste) = 49.5
    expect(calculateFood({ dietType: 'vegan', foodWastePercent: 10 })).toBe(49.5);

    // Heavy Meat: 7.2 * 30 * 1.20 (20% waste) = 259.2
    expect(calculateFood({ dietType: 'heavy_meat', foodWastePercent: 20 })).toBe(259.2);

    // Default mixed: 4.5 * 30 * 1.15 = 155.25
    expect(calculateFood({})).toBe(155.25);
  });
});

describe('carbonEngine - calculateShopping', () => {
  it('should calculate shopping emissions correctly', () => {
    // Clothing: 2 * 15 = 30
    // Electronics small: 3 * 50 / 12 = 12.5
    // Electronics large: 1 * 300 / 12 = 25
    // General spending: 200 * 0.5 = 100
    // Total = 167.50
    expect(calculateShopping({
      clothingItemsPerMonth: 2,
      electronicsSmallPerYear: 3,
      electronicsLargePerYear: 1,
      monthlySpending: 200,
    })).toBe(167.50);
  });
});

describe('carbonEngine - calculateWater', () => {
  it('should calculate water emissions correctly', () => {
    // Shower: 8 min/day * 30 days * 0.042 = 10.08
    // Liters: 120 liters/day * 30 days * 0.0003 = 1.08
    // Total = 11.16
    expect(calculateWater({ showerMinutesPerDay: 8, litersPerDay: 120 })).toBe(11.16);
  });
});

describe('carbonEngine - calculateTotal', () => {
  it('should aggregate all categories correctly', () => {
    const formData = {
      transportation: { carType: 'gasoline', carKmPerWeek: 80 }, // 72.74
      energy: { electricityKwhPerMonth: 300, renewablePercent: 20 }, // 103.8
      food: { dietType: 'vegan', foodWastePercent: 10 }, // 49.5
      shopping: { clothingItemsPerMonth: 2 }, // 30
      water: { showerMinutesPerDay: 8, litersPerDay: 120 }, // 11.16
    };

    const total = calculateTotal(formData);
    expect(total.breakdown.transportation).toBe(72.74);
    expect(total.breakdown.energy).toBe(103.8);
    expect(total.breakdown.food).toBe(49.5);
    expect(total.breakdown.shopping).toBe(30);
    expect(total.breakdown.water).toBe(11.16);
    expect(total.monthlyTotal).toBeCloseTo(267.2, 1);
    expect(total.yearlyTotal).toBeCloseTo(3206.4, 1);
    expect(total.yearlyTons).toBeCloseTo(3.21, 2);
  });
});

describe('carbonEngine - calculateCarbonScore', () => {
  it('should return correct scores for thresholds', () => {
    expect(calculateCarbonScore(0)).toBe(100);
    expect(calculateCarbonScore(45)).toBe(98);
    expect(calculateCarbonScore(80)).toBe(92);
    expect(calculateCarbonScore(150)).toBe(82);
    expect(calculateCarbonScore(250)).toBe(70);
    expect(calculateCarbonScore(350)).toBe(58);
    expect(calculateCarbonScore(500)).toBe(45);
    expect(calculateCarbonScore(700)).toBe(35);
    expect(calculateCarbonScore(900)).toBe(25);
    expect(calculateCarbonScore(1200)).toBe(15);
    expect(calculateCarbonScore(2000)).toBe(5);
  });
});

describe('carbonEngine - getScoreInfo', () => {
  it('should return correct label, color, emoji', () => {
    expect(getScoreInfo(85)).toEqual({ label: 'Excellent', color: '#10b981', emoji: '🌟' });
    expect(getScoreInfo(75)).toEqual({ label: 'Good', color: '#34d399', emoji: '🌿' });
    expect(getScoreInfo(50)).toEqual({ label: 'Average', color: '#fbbf24', emoji: '🌱' });
    expect(getScoreInfo(30)).toEqual({ label: 'Needs Work', color: '#f97316', emoji: '⚠️' });
    expect(getScoreInfo(10)).toEqual({ label: 'Critical', color: '#f43f5e', emoji: '🔴' });
  });
});

describe('carbonEngine - compareWithAverage', () => {
  it('should compare correctly with national averages', () => {
    // US average is 1370
    // Input 1000 kg -> 1000 - 1370 = -370 diff. -370/1370 = -27% below average
    const resUS = compareWithAverage(1000, 'US');
    expect(resUS.average).toBe(1370);
    expect(resUS.difference).toBe(-370);
    expect(resUS.percentDiff).toBe(-27);
    expect(resUS.isBelowAverage).toBe(true);
    expect(resUS.label).toBe('27% below average');

    // Global average is 400
    // Input 500 kg -> 500 - 400 = 100 diff. 100/400 = 25% above average
    const resGlobal = compareWithAverage(500, 'global');
    expect(resGlobal.average).toBe(400);
    expect(resGlobal.difference).toBe(100);
    expect(resGlobal.percentDiff).toBe(25);
    expect(resGlobal.isBelowAverage).toBe(false);
    expect(resGlobal.label).toBe('25% above average');
  });
});
