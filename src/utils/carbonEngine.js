// ═══════════════════════════════════════════
// CARBON ENGINE — Emission Calculation System
// ═══════════════════════════════════════════

// Emission factors (kg CO₂ per unit)
const EMISSION_FACTORS = {
  transportation: {
    car_gasoline: 0.21,     // kg CO₂ per km
    car_diesel: 0.17,       // kg CO₂ per km
    car_hybrid: 0.11,       // kg CO₂ per km
    car_electric: 0.05,     // kg CO₂ per km
    bus: 0.089,             // kg CO₂ per km
    train: 0.041,           // kg CO₂ per km
    subway: 0.033,          // kg CO₂ per km
    bicycle: 0,             // kg CO₂ per km
    walking: 0,             // kg CO₂ per km
    motorcycle: 0.113,      // kg CO₂ per km
    flight_short: 0.255,    // kg CO₂ per km (< 1500 km)
    flight_long: 0.195,     // kg CO₂ per km (> 1500 km)
  },
  electricity: {
    grid_average: 0.42,     // kg CO₂ per kWh (US average)
    renewable: 0.05,        // kg CO₂ per kWh
    natural_gas_heating: 2.0, // kg CO₂ per m³
  },
  food: {
    vegan: 1.5,             // kg CO₂ per day
    vegetarian: 2.5,        // kg CO₂ per day
    pescatarian: 3.0,       // kg CO₂ per day
    mixed: 4.5,             // kg CO₂ per day
    heavy_meat: 7.2,        // kg CO₂ per day
  },
  shopping: {
    clothing_item: 15,      // kg CO₂ per item
    electronics_small: 50,  // kg CO₂ per item
    electronics_large: 300, // kg CO₂ per item
    furniture: 100,         // kg CO₂ per item
    general_spending: 0.5,  // kg CO₂ per dollar
  },
  water: {
    per_liter: 0.0003,      // kg CO₂ per liter
    shower_per_min: 0.042,  // kg CO₂ per minute
  },
};

// National averages (kg CO₂ per month)
const NATIONAL_AVERAGES = {
  US: 1370,
  EU: 680,
  UK: 640,
  India: 160,
  China: 640,
  global: 400,
};

/**
 * Calculate transportation emissions per month
 */
export function calculateTransportation(data) {
  const {
    carType = 'none',
    carKmPerWeek = 0,
    busKmPerWeek = 0,
    trainKmPerWeek = 0,
    subwayKmPerWeek = 0,
    bicycleKmPerWeek = 0,
    flightsPerYear = 0,
    avgFlightDistanceKm = 1500,
  } = data;

  let monthly = 0;

  // Car emissions
  if (carType !== 'none' && carKmPerWeek > 0) {
    const factor = EMISSION_FACTORS.transportation[`car_${carType}`] || EMISSION_FACTORS.transportation.car_gasoline;
    monthly += carKmPerWeek * 4.33 * factor;
  }

  // Public transport
  monthly += busKmPerWeek * 4.33 * EMISSION_FACTORS.transportation.bus;
  monthly += trainKmPerWeek * 4.33 * EMISSION_FACTORS.transportation.train;
  monthly += subwayKmPerWeek * 4.33 * EMISSION_FACTORS.transportation.subway;

  // Flights (distributed monthly)
  const flightFactor = avgFlightDistanceKm > 1500
    ? EMISSION_FACTORS.transportation.flight_long
    : EMISSION_FACTORS.transportation.flight_short;
  monthly += (flightsPerYear * avgFlightDistanceKm * flightFactor * 2) / 12;

  return Math.round(monthly * 100) / 100;
}

/**
 * Calculate home energy emissions per month
 */
export function calculateEnergy(data) {
  const {
    electricityKwhPerMonth = 0,
    renewablePercent = 0,
    heatingType = 'electric',
    heatingHoursPerDay = 0,
  } = data;

  let monthly = 0;

  // Electricity
  const gridFraction = (100 - renewablePercent) / 100;
  monthly += electricityKwhPerMonth * gridFraction * EMISSION_FACTORS.electricity.grid_average;
  monthly += electricityKwhPerMonth * (renewablePercent / 100) * EMISSION_FACTORS.electricity.renewable;

  // Heating
  if (heatingType === 'natural_gas') {
    monthly += heatingHoursPerDay * 30 * 0.3 * EMISSION_FACTORS.electricity.natural_gas_heating;
  }

  return Math.round(monthly * 100) / 100;
}

/**
 * Calculate food emissions per month
 */
export function calculateFood(data) {
  const {
    dietType = 'mixed',
    foodWastePercent = 15,
  } = data;

  const baseDailyEmission = EMISSION_FACTORS.food[dietType] || EMISSION_FACTORS.food.mixed;
  const wasteMultiplier = 1 + (foodWastePercent / 100);
  const monthly = baseDailyEmission * 30 * wasteMultiplier;

  return Math.round(monthly * 100) / 100;
}

/**
 * Calculate shopping emissions per month
 */
export function calculateShopping(data) {
  const {
    clothingItemsPerMonth = 0,
    electronicsSmallPerYear = 0,
    electronicsLargePerYear = 0,
    monthlySpending = 0,
  } = data;

  let monthly = 0;

  monthly += clothingItemsPerMonth * EMISSION_FACTORS.shopping.clothing_item;
  monthly += (electronicsSmallPerYear * EMISSION_FACTORS.shopping.electronics_small) / 12;
  monthly += (electronicsLargePerYear * EMISSION_FACTORS.shopping.electronics_large) / 12;
  monthly += monthlySpending * EMISSION_FACTORS.shopping.general_spending;

  return Math.round(monthly * 100) / 100;
}

/**
 * Calculate water emissions per month
 */
export function calculateWater(data) {
  const {
    showerMinutesPerDay = 8,
    litersPerDay = 100,
  } = data;

  let monthly = 0;

  monthly += showerMinutesPerDay * 30 * EMISSION_FACTORS.water.shower_per_min;
  monthly += litersPerDay * 30 * EMISSION_FACTORS.water.per_liter;

  return Math.round(monthly * 100) / 100;
}

/**
 * Calculate total emissions
 */
export function calculateTotal(formData) {
  const transportation = calculateTransportation(formData.transportation || {});
  const energy = calculateEnergy(formData.energy || {});
  const food = calculateFood(formData.food || {});
  const shopping = calculateShopping(formData.shopping || {});
  const water = calculateWater(formData.water || {});

  const monthlyTotal = transportation + energy + food + shopping + water;
  const yearlyTotal = monthlyTotal * 12;

  return {
    breakdown: {
      transportation,
      energy,
      food,
      shopping,
      water,
    },
    monthlyTotal: Math.round(monthlyTotal * 100) / 100,
    yearlyTotal: Math.round(yearlyTotal * 100) / 100,
    yearlyTons: Math.round((yearlyTotal / 1000) * 100) / 100,
  };
}

/**
 * Calculate carbon score (0–100, higher is better/greener)
 */
export function calculateCarbonScore(monthlyKg) {
  // Based on global averages: 400 kg/month = 50 (average)
  // < 100 kg/month = 95+ (excellent)
  // > 1500 kg/month = 5 (poor)
  if (monthlyKg <= 0) return 100;
  if (monthlyKg <= 50) return 98;
  if (monthlyKg <= 100) return 92;
  if (monthlyKg <= 200) return 82;
  if (monthlyKg <= 300) return 70;
  if (monthlyKg <= 400) return 58;
  if (monthlyKg <= 600) return 45;
  if (monthlyKg <= 800) return 35;
  if (monthlyKg <= 1000) return 25;
  if (monthlyKg <= 1500) return 15;
  return 5;
}

/**
 * Get score label and color
 */
export function getScoreInfo(score) {
  if (score >= 80) return { label: 'Excellent', color: '#10b981', emoji: '🌟' };
  if (score >= 60) return { label: 'Good', color: '#34d399', emoji: '🌿' };
  if (score >= 40) return { label: 'Average', color: '#fbbf24', emoji: '🌱' };
  if (score >= 20) return { label: 'Needs Work', color: '#f97316', emoji: '⚠️' };
  return { label: 'Critical', color: '#f43f5e', emoji: '🔴' };
}

/**
 * Compare with national average
 */
export function compareWithAverage(monthlyKg, country = 'global') {
  const avg = NATIONAL_AVERAGES[country] || NATIONAL_AVERAGES.global;
  const diff = monthlyKg - avg;
  const percent = Math.round((diff / avg) * 100);

  return {
    average: avg,
    difference: Math.round(diff),
    percentDiff: percent,
    isBelowAverage: diff < 0,
    label: diff < 0
      ? `${Math.abs(percent)}% below average`
      : `${percent}% above average`,
  };
}

export { EMISSION_FACTORS, NATIONAL_AVERAGES };
