// ═══════════════════════════════════════════
// INSIGHTS ENGINE — AI-Powered Recommendations
// ═══════════════════════════════════════════

/**
 * Relevance boost multiplier for the highest-emission category.
 * @type {number}
 */
const TOP_CATEGORY_BOOST = 3;

/**
 * Relevance boost multiplier for the second-highest-emission category.
 * @type {number}
 */
const SECOND_CATEGORY_BOOST = 2.5;

/**
 * Relevance boost multiplier for the third-highest-emission category.
 * @type {number}
 */
const THIRD_CATEGORY_BOOST = 2;

/**
 * Relevance boost multiplier for lower-ranked emission categories.
 * @type {number}
 */
const LOWER_CATEGORY_BOOST = 1.5;

/**
 * Normalization divisor for impact score calculation.
 * @type {number}
 */
const IMPACT_NORMALIZER = 100;

/**
 * Normalization divisor for ease score calculation.
 * @type {number}
 */
const EASE_NORMALIZER = 10;

/**
 * Comprehensive database of carbon reduction recommendations.
 * Each entry includes impact estimates, ease-of-implementation scores,
 * cost savings projections, and categorical tags for filtering.
 *
 * @type {Array<{id: string, category: string, title: string, description: string, impactKg: number, easeScore: number, costSavings: number, icon: string, tags: string[]}>}
 */
const RECOMMENDATIONS_DB = [
  // ── Transportation ──
  {
    id: 'trans-1',
    category: 'transportation',
    title: 'Switch to Public Transit',
    description: 'Replace 3 car trips per week with bus or train. Public transit produces 45% fewer emissions per passenger mile than single-occupancy vehicles.',
    impactKg: 480,
    easeScore: 7,
    costSavings: 2400,
    icon: '🚌',
    tags: ['commute', 'car'],
  },
  {
    id: 'trans-2',
    category: 'transportation',
    title: 'Start Cycling Short Trips',
    description: 'Bike for trips under 5km instead of driving. This also improves cardiovascular health and saves on fuel costs.',
    impactKg: 300,
    easeScore: 6,
    costSavings: 1200,
    icon: '🚴',
    tags: ['commute', 'fitness'],
  },
  {
    id: 'trans-3',
    category: 'transportation',
    title: 'Carpooling to Work',
    description: 'Share your commute with 1-2 colleagues. Splitting a car ride cuts per-person emissions by 50-66%.',
    impactKg: 400,
    easeScore: 5,
    costSavings: 1800,
    icon: '🚗',
    tags: ['commute', 'social'],
  },
  {
    id: 'trans-4',
    category: 'transportation',
    title: 'One Fewer Flight Per Year',
    description: 'Skip one round-trip flight annually. A single transatlantic flight generates about 1.6 tons of CO₂ per passenger.',
    impactKg: 1600,
    easeScore: 4,
    costSavings: 800,
    icon: '✈️',
    tags: ['travel', 'flight'],
  },
  {
    id: 'trans-5',
    category: 'transportation',
    title: 'Work from Home 2 Days/Week',
    description: 'Remote work eliminates commute emissions entirely on those days, plus reduces office energy usage.',
    impactKg: 350,
    easeScore: 6,
    costSavings: 1500,
    icon: '🏠',
    tags: ['commute', 'remote'],
  },
  {
    id: 'trans-6',
    category: 'transportation',
    title: 'Consider an EV for Next Car',
    description: 'Electric vehicles produce 50-70% fewer lifetime emissions than gasoline cars, even accounting for battery production.',
    impactKg: 2000,
    easeScore: 3,
    costSavings: 1000,
    icon: '⚡',
    tags: ['car', 'investment'],
  },

  // ── Energy ──
  {
    id: 'energy-1',
    category: 'energy',
    title: 'Switch to LED Bulbs',
    description: 'Replace all incandescent bulbs with LEDs. They use 75% less energy and last 25 times longer.',
    impactKg: 200,
    easeScore: 9,
    costSavings: 225,
    icon: '💡',
    tags: ['home', 'lighting'],
  },
  {
    id: 'energy-2',
    category: 'energy',
    title: 'Optimize Thermostat Settings',
    description: 'Lower heating by 2°C in winter and raise cooling by 2°C in summer. Each degree saves about 3% on your energy bill.',
    impactKg: 350,
    easeScore: 8,
    costSavings: 300,
    icon: '🌡️',
    tags: ['home', 'heating'],
  },
  {
    id: 'energy-3',
    category: 'energy',
    title: 'Unplug Phantom Loads',
    description: 'Electronics on standby consume 5-10% of household electricity. Use smart power strips to eliminate phantom loads.',
    impactKg: 150,
    easeScore: 8,
    costSavings: 200,
    icon: '🔌',
    tags: ['home', 'electronics'],
  },
  {
    id: 'energy-4',
    category: 'energy',
    title: 'Install Solar Panels',
    description: 'Residential solar can offset 80-100% of electricity emissions. Many areas offer tax credits and financing options.',
    impactKg: 3000,
    easeScore: 2,
    costSavings: 1500,
    icon: '☀️',
    tags: ['home', 'renewable', 'investment'],
  },
  {
    id: 'energy-5',
    category: 'energy',
    title: 'Air Dry Laundry',
    description: 'Skip the dryer and air dry clothes when possible. A single dryer load uses about 5 kWh of energy.',
    impactKg: 250,
    easeScore: 7,
    costSavings: 180,
    icon: '👕',
    tags: ['home', 'laundry'],
  },
  {
    id: 'energy-6',
    category: 'energy',
    title: 'Switch to Green Energy Provider',
    description: 'Choose a renewable energy tariff from your utility. Many providers now offer 100% renewable plans at competitive rates.',
    impactKg: 1500,
    easeScore: 6,
    costSavings: 0,
    icon: '🌬️',
    tags: ['home', 'renewable'],
  },

  // ── Food ──
  {
    id: 'food-1',
    category: 'food',
    title: 'Meatless Mondays',
    description: 'Skip meat one day per week. Beef production generates 20x more emissions than plant proteins per gram of protein.',
    impactKg: 180,
    easeScore: 8,
    costSavings: 300,
    icon: '🥦',
    tags: ['diet', 'easy'],
  },
  {
    id: 'food-2',
    category: 'food',
    title: 'Reduce Beef Consumption by 50%',
    description: 'Replace half your beef with chicken, fish, or plant-based alternatives. Beef has the highest carbon footprint of any common food.',
    impactKg: 500,
    easeScore: 6,
    costSavings: 400,
    icon: '🥩',
    tags: ['diet', 'meat'],
  },
  {
    id: 'food-3',
    category: 'food',
    title: 'Reduce Food Waste',
    description: 'Plan meals, use leftovers, and compost scraps. Food waste in landfills produces methane, a potent greenhouse gas.',
    impactKg: 300,
    easeScore: 7,
    costSavings: 600,
    icon: '♻️',
    tags: ['waste', 'planning'],
  },
  {
    id: 'food-4',
    category: 'food',
    title: 'Buy Local & Seasonal',
    description: 'Choose locally grown, seasonal produce to reduce transportation emissions. Farmers markets are a great starting point.',
    impactKg: 200,
    easeScore: 6,
    costSavings: 200,
    icon: '🌽',
    tags: ['shopping', 'local'],
  },
  {
    id: 'food-5',
    category: 'food',
    title: 'Try Plant-Based Milk',
    description: 'Switch from dairy to oat, almond, or soy milk. Dairy milk produces 3x more emissions than plant-based alternatives.',
    impactKg: 120,
    easeScore: 9,
    costSavings: 50,
    icon: '🥛',
    tags: ['diet', 'dairy'],
  },
  {
    id: 'food-6',
    category: 'food',
    title: 'Start a Kitchen Garden',
    description: 'Grow herbs, tomatoes, or salad greens at home. Zero food miles and zero packaging for the freshest produce.',
    impactKg: 80,
    easeScore: 5,
    costSavings: 150,
    icon: '🌱',
    tags: ['garden', 'home'],
  },

  // ── Shopping ──
  {
    id: 'shop-1',
    category: 'shopping',
    title: 'Buy Second-Hand Clothing',
    description: 'Thrift shopping extends garment life and avoids the massive carbon cost of new textile manufacturing.',
    impactKg: 200,
    easeScore: 7,
    costSavings: 500,
    icon: '👗',
    tags: ['fashion', 'reuse'],
  },
  {
    id: 'shop-2',
    category: 'shopping',
    title: 'Repair Instead of Replace',
    description: 'Fix broken items before buying new ones. Repair cafés and YouTube tutorials make this easier than ever.',
    impactKg: 250,
    easeScore: 5,
    costSavings: 800,
    icon: '🔧',
    tags: ['repair', 'electronics'],
  },
  {
    id: 'shop-3',
    category: 'shopping',
    title: 'Choose Eco-Certified Products',
    description: 'Look for Energy Star, FSC, and Fair Trade labels. These certifications ensure lower environmental impact.',
    impactKg: 150,
    easeScore: 7,
    costSavings: 100,
    icon: '🏷️',
    tags: ['shopping', 'certifications'],
  },
  {
    id: 'shop-4',
    category: 'shopping',
    title: 'Use Reusable Bags & Containers',
    description: 'Bring your own bags, water bottles, and food containers. Each reusable bag replaces 700+ plastic bags over its lifetime.',
    impactKg: 50,
    easeScore: 9,
    costSavings: 100,
    icon: '🛍️',
    tags: ['waste', 'reusable'],
  },
  {
    id: 'shop-5',
    category: 'shopping',
    title: 'Adopt Minimalist Shopping',
    description: 'Practice the "one in, one out" rule. Before buying, ask: do I need this, or do I want this?',
    impactKg: 400,
    easeScore: 5,
    costSavings: 2000,
    icon: '🧘',
    tags: ['mindset', 'minimalism'],
  },

  // ── Water ──
  {
    id: 'water-1',
    category: 'water',
    title: 'Shorter Showers (5 min max)',
    description: 'Cutting shower time from 10 to 5 minutes saves 40 liters of hot water per shower, reducing both water and energy use.',
    impactKg: 100,
    easeScore: 8,
    costSavings: 150,
    icon: '🚿',
    tags: ['bathroom', 'habit'],
  },
  {
    id: 'water-2',
    category: 'water',
    title: 'Fix Leaky Faucets',
    description: 'A dripping faucet wastes 15 liters per day. Fixing leaks is one of the simplest ways to conserve water.',
    impactKg: 40,
    easeScore: 9,
    costSavings: 80,
    icon: '🔧',
    tags: ['maintenance', 'easy'],
  },
  {
    id: 'water-3',
    category: 'water',
    title: 'Install Low-Flow Fixtures',
    description: 'Low-flow showerheads and faucet aerators reduce water usage by 30-50% without sacrificing water pressure.',
    impactKg: 80,
    easeScore: 7,
    costSavings: 120,
    icon: '💧',
    tags: ['home', 'investment'],
  },
  {
    id: 'water-4',
    category: 'water',
    title: 'Collect Rainwater for Garden',
    description: 'Use rain barrels to collect water for gardening. This reduces treated water consumption and your water bill.',
    impactKg: 30,
    easeScore: 5,
    costSavings: 60,
    icon: '🌧️',
    tags: ['garden', 'outdoor'],
  },

  // ── Lifestyle / Cross-cutting ──
  {
    id: 'life-1',
    category: 'lifestyle',
    title: 'Switch to Paperless',
    description: 'Go digital for bills, receipts, and notes. The average office worker uses 10,000 sheets of paper per year.',
    impactKg: 60,
    easeScore: 9,
    costSavings: 50,
    icon: '📱',
    tags: ['digital', 'office'],
  },
  {
    id: 'life-2',
    category: 'lifestyle',
    title: 'Plant a Tree',
    description: 'A single mature tree absorbs approximately 22 kg of CO₂ per year and provides shade, habitat, and cleaner air.',
    impactKg: 22,
    easeScore: 6,
    costSavings: 0,
    icon: '🌳',
    tags: ['nature', 'offset'],
  },
  {
    id: 'life-3',
    category: 'lifestyle',
    title: 'Offset Remaining Emissions',
    description: 'After reducing what you can, consider verified carbon offsets for the rest. Look for Gold Standard certified projects.',
    impactKg: 1000,
    easeScore: 8,
    costSavings: -200,
    icon: '🌍',
    tags: ['offset', 'investment'],
  },
];

/**
 * Maps internal category names to recommendation database categories.
 * Used for associating emission breakdown categories with recommendation entries.
 * @type {Object<string, string>}
 */
const CATEGORY_MAP = {
  transportation: 'transportation',
  energy: 'energy',
  food: 'food',
  shopping: 'shopping',
  water: 'water',
};

/**
 * Generates personalized carbon reduction recommendations based on a user's emission breakdown.
 * Recommendations are scored using a composite of environmental impact, ease of implementation,
 * and relevance to the user's highest-emission categories.
 *
 * @param {Object} breakdown - Per-category monthly emission breakdown in kg CO₂.
 * @param {number} [breakdown.transportation] - Monthly transportation emissions.
 * @param {number} [breakdown.energy] - Monthly energy emissions.
 * @param {number} [breakdown.food] - Monthly food emissions.
 * @param {number} [breakdown.shopping] - Monthly shopping emissions.
 * @param {number} [breakdown.water] - Monthly water emissions.
 * @returns {Array<Object>} Sorted array of recommendation objects, each enriched with
 *   `relevanceScore` and `compositeScore` fields. Highest composite score first.
 *
 * @example
 * generateInsights({ transportation: 200, energy: 100, food: 150, shopping: 50, water: 10 })
 * // Returns recommendations prioritized for transportation (highest emissions)
 */
export function generateInsights(breakdown) {
  if (!breakdown || typeof breakdown !== 'object' || Array.isArray(breakdown)) {
    return [];
  }

  // Find highest-emission categories, sorted descending
  const categories = Object.entries(breakdown)
    .filter(([, value]) => typeof value === 'number' && Number.isFinite(value))
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);

  // Score each recommendation based on impact, ease, and relevance
  const scored = RECOMMENDATIONS_DB.map(rec => {
    let relevanceScore = 1;

    // Boost recommendations for high-emission categories
    const catIndex = categories.indexOf(CATEGORY_MAP[rec.category] || rec.category);
    if (catIndex === 0) relevanceScore = TOP_CATEGORY_BOOST;
    else if (catIndex === 1) relevanceScore = SECOND_CATEGORY_BOOST;
    else if (catIndex === 2) relevanceScore = THIRD_CATEGORY_BOOST;
    else if (catIndex <= 3) relevanceScore = LOWER_CATEGORY_BOOST;

    // Combined score: impact × ease × relevance
    const compositeScore = (rec.impactKg / IMPACT_NORMALIZER) * (rec.easeScore / EASE_NORMALIZER) * relevanceScore;

    return {
      ...rec,
      relevanceScore,
      compositeScore: Math.round(compositeScore * 100) / 100,
    };
  });

  // Sort by composite score (highest first)
  scored.sort((a, b) => b.compositeScore - a.compositeScore);

  return scored;
}

/**
 * Returns the top N most relevant recommendations for a user's emission profile.
 *
 * @param {Object} breakdown - Per-category monthly emission breakdown.
 * @param {number} [n=5] - Number of top recommendations to return.
 * @returns {Array<Object>} The top N recommendation objects.
 *
 * @example
 * getTopInsights({ transportation: 200, food: 100 }, 3)
 * // Returns the 3 highest-scored recommendations
 */
export function getTopInsights(breakdown, n = 5) {
  return generateInsights(breakdown).slice(0, n);
}

/**
 * Returns recommendations filtered to a specific emission category.
 *
 * @param {Object} breakdown - Per-category monthly emission breakdown.
 * @param {string} category - The category to filter by (e.g., 'transportation', 'food').
 * @returns {Array<Object>} Filtered and scored recommendations for the specified category.
 *
 * @example
 * getInsightsByCategory({ transportation: 200, food: 100 }, 'food')
 * // Returns only food-related recommendations, sorted by composite score
 */
export function getInsightsByCategory(breakdown, category) {
  if (typeof category !== 'string') return [];
  return generateInsights(breakdown).filter(r => r.category === category);
}

/**
 * Calculates the total potential CO₂ savings and cost savings from a list of recommendations.
 * Negative cost savings (investment costs) are excluded from the total.
 *
 * @param {Array<Object>} recommendations - Array of recommendation objects to aggregate.
 * @returns {{co2Kg: number, costSavings: number}} Aggregated savings totals.
 *
 * @example
 * calculatePotentialSavings([{ impactKg: 480, costSavings: 2400 }, { impactKg: 300, costSavings: 1200 }])
 * // Returns: { co2Kg: 780, costSavings: 3600 }
 */
export function calculatePotentialSavings(recommendations) {
  if (!Array.isArray(recommendations)) return { co2Kg: 0, costSavings: 0 };

  return recommendations.reduce(
    (acc, rec) => ({
      co2Kg: acc.co2Kg + (typeof rec.impactKg === 'number' ? rec.impactKg : 0),
      costSavings: acc.costSavings + Math.max(0, typeof rec.costSavings === 'number' ? rec.costSavings : 0),
    }),
    { co2Kg: 0, costSavings: 0 }
  );
}

/**
 * Returns a difficulty label and corresponding color for a given ease score.
 *
 * @param {number} easeScore - Ease-of-implementation score (1-10, higher = easier).
 * @returns {{label: string, color: string}} Object containing human-readable difficulty label and hex color.
 *
 * @example
 * getDifficultyLabel(9)  // { label: 'Easy', color: '#10b981' }
 * getDifficultyLabel(5)  // { label: 'Moderate', color: '#fbbf24' }
 * getDifficultyLabel(2)  // { label: 'Challenging', color: '#f97316' }
 */
export function getDifficultyLabel(easeScore) {
  if (easeScore >= 8) return { label: 'Easy', color: '#10b981' };
  if (easeScore >= 5) return { label: 'Moderate', color: '#fbbf24' };
  return { label: 'Challenging', color: '#f97316' };
}

export { RECOMMENDATIONS_DB };
