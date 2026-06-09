// ═══════════════════════════════════════════
// SAMPLE DATA — Demo Data Generator
// ═══════════════════════════════════════════

/**
 * Number of months of historical data to generate.
 * @type {number}
 */
const HISTORY_MONTHS = 12;

/**
 * Baseline monthly emission (kg CO₂) for historical data generation.
 * @type {number}
 */
const HISTORY_BASE_EMISSION = 420;

/**
 * Monthly reduction rate (kg CO₂) simulating a gradual improvement trend.
 * @type {number}
 */
const HISTORY_MONTHLY_REDUCTION = 12;

/**
 * Maximum random variation (kg CO₂) applied to historical data points.
 * @type {number}
 */
const HISTORY_VARIATION_RANGE = 60;

/**
 * Minimum allowed monthly emission (kg CO₂) in historical data.
 * @type {number}
 */
const HISTORY_MIN_EMISSION = 150;

/**
 * Number of weeks of weekly data to generate.
 * @type {number}
 */
const WEEKLY_DATA_POINTS = 8;

/**
 * Milliseconds in one day, used for date arithmetic.
 * @type {number}
 */
const MS_PER_DAY = 86400000;

/**
 * Generates 12 months of sample historical emission data for dashboard charts.
 * Simulates a gradual downward trend with realistic random variation.
 * Each entry includes a date, monthly total, and per-category breakdown.
 *
 * @returns {Array<{date: string, month: string, year: number, monthlyTotal: number, breakdown: Object}>}
 *   Array of 12 monthly data points, oldest first.
 *
 * @example
 * const history = generateSampleHistory();
 * // history[0].month => 'Jun' (12 months ago)
 * // history[11].month => 'May' (current month)
 */
export function generateSampleHistory() {
  const history = [];
  const now = new Date();

  for (let i = HISTORY_MONTHS - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);

    // Simulate a gradual reduction trend with some variation
    const baseEmission = HISTORY_BASE_EMISSION - i * HISTORY_MONTHLY_REDUCTION;
    const variation = (Math.random() - 0.5) * HISTORY_VARIATION_RANGE;
    const monthlyTotal = Math.max(HISTORY_MIN_EMISSION, Math.round(baseEmission + variation));

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
 * Generates 8 weeks of sample weekly emission data.
 * Simulates a gradual improvement trend for weekly summary views.
 *
 * @returns {Array<{week: string, date: string, total: number}>}
 *   Array of weekly data points, oldest first.
 *
 * @example
 * const weekly = generateSampleWeekly();
 * // weekly[0].week => 'W1'
 * // weekly[7].week => 'W8'
 */
export function generateSampleWeekly() {
  const weeks = [];
  const now = new Date();

  for (let i = WEEKLY_DATA_POINTS - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i * 7);

    const baseWeekly = 85 - i * 2;
    const variation = (Math.random() - 0.5) * 15;

    weeks.push({
      week: `W${WEEKLY_DATA_POINTS - i}`,
      date: date.toISOString(),
      total: Math.max(50, Math.round(baseWeekly + variation)),
    });
  }

  return weeks;
}

/**
 * Generates a complete sample carbon data snapshot for first-time users.
 * Provides realistic default values for all emission categories,
 * including form data that can be used to recalculate emissions.
 *
 * @returns {Object} Complete carbon data snapshot.
 * @returns {number} returns.monthlyTotal - Monthly emissions in kg CO₂.
 * @returns {number} returns.yearlyTotal - Annual emissions in kg CO₂.
 * @returns {number} returns.yearlyTons - Annual emissions in metric tons CO₂.
 * @returns {number} returns.score - Planetary health score (0-100).
 * @returns {Object} returns.breakdown - Per-category emission breakdown.
 * @returns {Object} returns.formData - Input form values used for calculation.
 * @returns {string} returns.timestamp - ISO timestamp of data generation.
 *
 * @example
 * const data = generateSampleCarbonData();
 * // data.monthlyTotal => 671.21
 * // data.score => 35
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
 * Generates sample reduction goals for first-time users.
 * Provides a mix of completed and in-progress goals across categories.
 *
 * @returns {Array<Object>} Array of sample goal objects.
 *
 * @example
 * const goals = generateSampleGoals();
 * // goals.length => 3
 * // goals[1].completed => true
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
      deadline: new Date(Date.now() + 90 * MS_PER_DAY).toISOString(),
      createdAt: new Date(Date.now() - 30 * MS_PER_DAY).toISOString(),
      completed: false,
    },
    {
      id: '2',
      title: 'Switch to green energy provider',
      category: 'energy',
      targetReduction: 80,
      currentProgress: 80,
      unit: '%',
      deadline: new Date(Date.now() + 30 * MS_PER_DAY).toISOString(),
      createdAt: new Date(Date.now() - 60 * MS_PER_DAY).toISOString(),
      completed: true,
    },
    {
      id: '3',
      title: 'Go vegetarian 3 days/week',
      category: 'food',
      targetReduction: 43,
      currentProgress: 28,
      unit: '%',
      deadline: new Date(Date.now() + 60 * MS_PER_DAY).toISOString(),
      createdAt: new Date(Date.now() - 15 * MS_PER_DAY).toISOString(),
      completed: false,
    },
  ];
}

/**
 * Generates sample community statistics and leaderboard data.
 * Provides global metrics, a ranked leaderboard with the current user,
 * and a set of planetary milestones with achievement status.
 *
 * @returns {Object} Community data snapshot.
 * @returns {number} returns.totalCO2Reduced - Total kg CO₂ reduced by all users.
 * @returns {number} returns.totalTrees - Equivalent trees planted.
 * @returns {number} returns.totalUsers - Number of active users.
 * @returns {number} returns.totalCountries - Number of countries represented.
 * @returns {Array<Object>} returns.leaderboard - Ranked user entries.
 * @returns {Array<Object>} returns.milestones - Community achievement milestones.
 *
 * @example
 * const community = generateCommunityData();
 * // community.leaderboard[9].name => 'You'
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
 * Initializes sample data in localStorage on first application launch.
 * Seeds carbon data, history, goals, and challenge progress with realistic defaults.
 * This function is idempotent — subsequent calls after initialization are no-ops.
 *
 * @returns {void}
 *
 * @example
 * initializeSampleData(); // Seeds data on first call
 * initializeSampleData(); // No-op on subsequent calls
 */
export function initializeSampleData() {
  const SAMPLE_KEY = 'ecotrack_sample_initialized';

  try {
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
  } catch (e) {
    console.warn('[SampleData] Failed to initialize sample data:', e.message || e);
  }
}
