// ═══════════════════════════════════════════
// SAMPLE DATA — Demo Data Generator
// ═══════════════════════════════════════════

/**
 * Generate sample historical data for the dashboard
 */
export function generateSampleHistory() {
  const history = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);

    // Simulate a gradual reduction trend with some variation
    const baseEmission = 420 - i * 12; // Gradual improvement
    const variation = (Math.random() - 0.5) * 60;
    const monthlyTotal = Math.max(150, Math.round(baseEmission + variation));

    // Distribute across categories with some randomness
    const transportRatio = 0.30 + (Math.random() - 0.5) * 0.08;
    const energyRatio = 0.25 + (Math.random() - 0.5) * 0.06;
    const foodRatio = 0.25 + (Math.random() - 0.5) * 0.06;
    const shoppingRatio = 0.12 + (Math.random() - 0.5) * 0.04;
    const waterRatio = 1 - transportRatio - energyRatio - foodRatio - shoppingRatio;

    history.push({
      date: date.toISOString(),
      month: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear(),
      monthlyTotal,
      breakdown: {
        transportation: Math.round(monthlyTotal * transportRatio),
        energy: Math.round(monthlyTotal * energyRatio),
        food: Math.round(monthlyTotal * foodRatio),
        shopping: Math.round(monthlyTotal * shoppingRatio),
        water: Math.round(monthlyTotal * waterRatio),
      },
    });
  }

  return history;
}

/**
 * Generate sample weekly data
 */
export function generateSampleWeekly() {
  const weeks = [];
  const now = new Date();

  for (let i = 7; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 7);

    const baseWeekly = 85 - i * 2;
    const variation = (Math.random() - 0.5) * 15;

    weeks.push({
      week: `W${8 - i}`,
      date: date.toISOString(),
      total: Math.max(50, Math.round(baseWeekly + variation)),
    });
  }

  return weeks;
}

/**
 * Generate sample carbon data (current snapshot)
 */
export function generateSampleCarbonData() {
  return {
    monthlyTotal: 671.21,
    yearlyTotal: 8054.52,
    yearlyTons: 8.05,
    score: 35,
    breakdown: {
      transportation: 209.73,
      energy: 127.58,
      food: 155.25,
      shopping: 167.50,
      water: 11.16,
    },
    formData: {
      transportation: {
        carType: 'gasoline',
        carKmPerWeek: 80,
        busKmPerWeek: 20,
        trainKmPerWeek: 10,
        flightsPerYear: 2,
        avgFlightDistanceKm: 1500,
      },
      energy: {
        electricityKwhPerMonth: 350,
        renewablePercent: 15,
        heatingType: 'electric',
      },
      food: {
        dietType: 'mixed',
        foodWastePercent: 15,
      },
      shopping: {
        clothingItemsPerMonth: 2,
        electronicsSmallPerYear: 3,
        electronicsLargePerYear: 1,
        monthlySpending: 200,
      },
      water: {
        showerMinutesPerDay: 8,
        litersPerDay: 120,
      },
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Generate sample goals
 */
export function generateSampleGoals() {
  return [
    {
      id: '1',
      title: 'Reduce driving by 30%',
      category: 'transportation',
      targetReduction: 30,
      currentProgress: 18,
      unit: '%',
      deadline: new Date(Date.now() + 90 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      completed: false,
    },
    {
      id: '2',
      title: 'Switch to green energy provider',
      category: 'energy',
      targetReduction: 80,
      currentProgress: 80,
      unit: '%',
      deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      completed: true,
    },
    {
      id: '3',
      title: 'Go vegetarian 3 days/week',
      category: 'food',
      targetReduction: 43,
      currentProgress: 28,
      unit: '%',
      deadline: new Date(Date.now() + 60 * 86400000).toISOString(),
      createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
      completed: false,
    },
  ];
}

/**
 * Generate sample community data
 */
export function generateCommunityData() {
  return {
    totalCO2Reduced: 2847500,  // kg
    totalTrees: 142375,
    totalUsers: 28475,
    totalCountries: 87,
    leaderboard: [
      { rank: 1, name: 'GreenMachine', avatar: '🌿', score: 4850, badges: 11, reduction: 72 },
      { rank: 2, name: 'EcoWarrior23', avatar: '⚔️', score: 4620, badges: 10, reduction: 68 },
      { rank: 3, name: 'PlantPowered', avatar: '🌱', score: 4380, badges: 10, reduction: 65 },
      { rank: 4, name: 'SolarSam', avatar: '☀️', score: 4100, badges: 9, reduction: 61 },
      { rank: 5, name: 'BikeToWork', avatar: '🚴', score: 3870, badges: 9, reduction: 58 },
      { rank: 6, name: 'ZeroWasteZoe', avatar: '♻️', score: 3650, badges: 8, reduction: 55 },
      { rank: 7, name: 'TreeHugger99', avatar: '🌳', score: 3420, badges: 8, reduction: 52 },
      { rank: 8, name: 'CleanEnergy', avatar: '⚡', score: 3200, badges: 7, reduction: 49 },
      { rank: 9, name: 'CompostKing', avatar: '🌱', score: 2980, badges: 7, reduction: 46 },
      { rank: 10, name: 'You', avatar: '👤', score: 2760, badges: 6, reduction: 42 },
    ],
    milestones: [
      { target: 1000000, label: '1M kg CO₂ Reduced', achieved: true, date: '2025-03-15' },
      { target: 2000000, label: '2M kg CO₂ Reduced', achieved: true, date: '2025-09-22' },
      { target: 2500000, label: '2.5M kg CO₂ Reduced', achieved: true, date: '2026-01-10' },
      { target: 3000000, label: '3M kg CO₂ Reduced', achieved: false, date: null },
      { target: 5000000, label: '5M kg CO₂ Reduced', achieved: false, date: null },
    ],
  };
}

/**
 * Initialize sample data if none exists
 */
export function initializeSampleData() {
  const SAMPLE_KEY = 'ecotrack_sample_initialized';
  if (localStorage.getItem(SAMPLE_KEY)) return;

  // Save sample carbon data
  const carbonData = generateSampleCarbonData();
  localStorage.setItem('ecotrack_carbon_data', JSON.stringify(carbonData));

  // Save sample history
  const history = generateSampleHistory();
  localStorage.setItem('ecotrack_history', JSON.stringify(history));

  // Save sample goals
  const goals = generateSampleGoals();
  localStorage.setItem('ecotrack_goals', JSON.stringify(goals));

  // Save sample challenge progress
  const challengeProgress = {
    completed: ['d1', 'd2', 'd4', 'd5', 'd8', 'w1', 'w6', 'w8'],
    currentStreak: 5,
    longestStreak: 12,
    lastCompletedDate: new Date().toISOString(),
    totalPoints: 215,
  };
  localStorage.setItem('ecotrack_challenges', JSON.stringify(challengeProgress));

  localStorage.setItem(SAMPLE_KEY, 'true');
}
