// ═══════════════════════════════════════════
// CARBON ENGINE — Emission Calculation System
// ═══════════════════════════════════════════

/**
 * Average weeks per month constant used for converting weekly data to monthly.
 * @type {number}
 */
const WEEKS_PER_MONTH = 4.33;

/**
 * Months per year constant for annual projections.
 * @type {number}
 */
const MONTHS_PER_YEAR = 12;

/**
 * Rounding precision multiplier for hundredths place.
 * @type {number}
 */
const PRECISION = 100;

/**
 * Round-trip multiplier for flight emissions (outbound + return).
 * @type {number}
 */
const ROUND_TRIP_MULTIPLIER = 2;

/**
 * Distance threshold in km that separates short-haul from long-haul flights.
 * @type {number}
 */
const FLIGHT_DISTANCE_THRESHOLD_KM = 1500;

/**
 * Kilograms per metric ton conversion factor.
 * @type {number}
 */
const KG_PER_TON = 1000;

/**
 * Approximate natural gas volume consumed per heating hour (m³/hr).
 * @type {number}
 */
const GAS_VOLUME_PER_HOUR = 0.3;

/**
 * Days per month constant for food and water calculations.
 * @type {number}
 */
const DAYS_PER_MONTH = 30;

/**
 * Emission factors (kg CO₂ per unit) for all tracked activity categories.
 * Sources: EPA, DEFRA, IEA, peer-reviewed lifecycle assessments.
 * @type {Object}
 */
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

/**
 * National average monthly CO₂ emissions (kg) by country/region.
 * Used for comparative analysis against user footprint.
 * @type {Object<string, number>}
 */
const NATIONAL_AVERAGES = {
  US: 1370,
  EU: 680,
  UK: 640,
  India: 160,
  China: 640,
  global: 400,
};

/**
 * Rounds a number to two decimal places (hundredths).
 *
 * @param {number} value - The number to round.
 * @returns {number} The value rounded to two decimal places.
 */
function roundToHundredths(value) {
  return Math.round(value * PRECISION) / PRECISION;
}

/**
 * Safely extracts a valid object from the input, returning an empty object on invalid input.
 *
 * @param {*} data - The input to validate.
 * @returns {Object} The validated object or an empty object.
 */
function ensureObject(data) {
  return (data && typeof data === 'object' && !Array.isArray(data)) ? data : {};
}

/**
 * Calculates monthly transportation emissions based on commute and travel habits.
 * Accounts for car type, public transit usage, cycling, and air travel.
 *
 * @param {Object} data - Transportation input data.
 * @param {string} [data.carType='none'] - Vehicle type: 'gasoline', 'diesel', 'hybrid', 'electric', or 'none'.
 * @param {number} [data.carKmPerWeek=0] - Weekly car driving distance in kilometers.
 * @param {number} [data.busKmPerWeek=0] - Weekly bus travel distance in kilometers.
 * @param {number} [data.trainKmPerWeek=0] - Weekly train travel distance in kilometers.
 * @param {number} [data.subwayKmPerWeek=0] - Weekly subway travel distance in kilometers.
 * @param {number} [data.bicycleKmPerWeek=0] - Weekly cycling distance in kilometers.
 * @param {number} [data.flightsPerYear=0] - Number of flights taken per year.
 * @param {number} [data.avgFlightDistanceKm=1500] - Average one-way flight distance in kilometers.
 * @returns {number} Monthly CO₂ emissions in kilograms, rounded to two decimal places.
 *
 * @example
 * calculateTransportation({ carType: 'gasoline', carKmPerWeek: 100 })
 * // Returns: 90.93 (100 km × 4.33 weeks × 0.21 kg/km)
 */
export function calculateTransportation(data) {
  const safeData = ensureObject(data);
  const {
    carType = 'none',
    carKmPerWeek = 0,
    busKmPerWeek = 0,
    trainKmPerWeek = 0,
    subwayKmPerWeek = 0,
    flightsPerYear = 0,
    avgFlightDistanceKm = FLIGHT_DISTANCE_THRESHOLD_KM,
  } = safeData;

  let monthly = 0;

  // Car emissions
  if (carType !== 'none' && carKmPerWeek > 0) {
    const factor = EMISSION_FACTORS.transportation[`car_${carType}`] || EMISSION_FACTORS.transportation.car_gasoline;
    monthly += carKmPerWeek * WEEKS_PER_MONTH * factor;
  }

  // Public transport
  monthly += busKmPerWeek * WEEKS_PER_MONTH * EMISSION_FACTORS.transportation.bus;
  monthly += trainKmPerWeek * WEEKS_PER_MONTH * EMISSION_FACTORS.transportation.train;
  monthly += subwayKmPerWeek * WEEKS_PER_MONTH * EMISSION_FACTORS.transportation.subway;

  // Flights (distributed monthly)
  const flightFactor = avgFlightDistanceKm > FLIGHT_DISTANCE_THRESHOLD_KM
    ? EMISSION_FACTORS.transportation.flight_long
    : EMISSION_FACTORS.transportation.flight_short;
  monthly += (flightsPerYear * avgFlightDistanceKm * flightFactor * ROUND_TRIP_MULTIPLIER) / MONTHS_PER_YEAR;

  return roundToHundredths(monthly);
}

/**
 * Calculates monthly home energy emissions based on electricity usage and heating.
 * Accounts for renewable energy share and heating fuel type.
 *
 * @param {Object} data - Energy input data.
 * @param {number} [data.electricityKwhPerMonth=0] - Monthly electricity consumption in kWh.
 * @param {number} [data.renewablePercent=0] - Percentage of electricity from renewable sources (0-100).
 * @param {string} [data.heatingType='electric'] - Heating fuel type: 'electric' or 'natural_gas'.
 * @param {number} [data.heatingHoursPerDay=0] - Daily heating hours.
 * @returns {number} Monthly CO₂ emissions in kilograms, rounded to two decimal places.
 *
 * @example
 * calculateEnergy({ electricityKwhPerMonth: 400, renewablePercent: 50 })
 * // Returns: 94.0
 */
export function calculateEnergy(data) {
  const safeData = ensureObject(data);
  const {
    electricityKwhPerMonth = 0,
    renewablePercent = 0,
    heatingType = 'electric',
    heatingHoursPerDay = 0,
  } = safeData;

  let monthly = 0;

  // Electricity (split between grid and renewable fractions)
  const gridFraction = (100 - renewablePercent) / 100;
  const renewableFraction = renewablePercent / 100;
  monthly += electricityKwhPerMonth * gridFraction * EMISSION_FACTORS.electricity.grid_average;
  monthly += electricityKwhPerMonth * renewableFraction * EMISSION_FACTORS.electricity.renewable;

  // Heating (natural gas only — electric heating is already in electricity calculation)
  if (heatingType === 'natural_gas') {
    monthly += heatingHoursPerDay * DAYS_PER_MONTH * GAS_VOLUME_PER_HOUR * EMISSION_FACTORS.electricity.natural_gas_heating;
  }

  return roundToHundredths(monthly);
}

/**
 * Calculates monthly food emissions based on diet type and food waste percentage.
 *
 * @param {Object} data - Food input data.
 * @param {string} [data.dietType='mixed'] - Diet type: 'vegan', 'vegetarian', 'pescatarian', 'mixed', or 'heavy_meat'.
 * @param {number} [data.foodWastePercent=15] - Percentage of food that is wasted (0-100).
 * @returns {number} Monthly CO₂ emissions in kilograms, rounded to two decimal places.
 *
 * @example
 * calculateFood({ dietType: 'vegetarian', foodWastePercent: 10 })
 * // Returns: 82.5 (2.5 kg/day × 30 days × 1.10 waste multiplier)
 */
export function calculateFood(data) {
  const safeData = ensureObject(data);
  const {
    dietType = 'mixed',
    foodWastePercent = 15,
  } = safeData;

  const baseDailyEmission = EMISSION_FACTORS.food[dietType] || EMISSION_FACTORS.food.mixed;
  const wasteMultiplier = 1 + (foodWastePercent / 100);
  const monthly = baseDailyEmission * DAYS_PER_MONTH * wasteMultiplier;

  return roundToHundredths(monthly);
}

/**
 * Calculates monthly shopping/consumer emissions based on purchasing habits.
 *
 * @param {Object} data - Shopping input data.
 * @param {number} [data.clothingItemsPerMonth=0] - Number of new clothing items purchased per month.
 * @param {number} [data.electronicsSmallPerYear=0] - Number of small electronics purchased per year.
 * @param {number} [data.electronicsLargePerYear=0] - Number of large electronics purchased per year.
 * @param {number} [data.monthlySpending=0] - Monthly general goods spending in dollars.
 * @returns {number} Monthly CO₂ emissions in kilograms, rounded to two decimal places.
 *
 * @example
 * calculateShopping({ clothingItemsPerMonth: 3, monthlySpending: 200 })
 * // Returns: 145.0
 */
export function calculateShopping(data) {
  const safeData = ensureObject(data);
  const {
    clothingItemsPerMonth = 0,
    electronicsSmallPerYear = 0,
    electronicsLargePerYear = 0,
    monthlySpending = 0,
  } = safeData;

  let monthly = 0;

  monthly += clothingItemsPerMonth * EMISSION_FACTORS.shopping.clothing_item;
  monthly += (electronicsSmallPerYear * EMISSION_FACTORS.shopping.electronics_small) / MONTHS_PER_YEAR;
  monthly += (electronicsLargePerYear * EMISSION_FACTORS.shopping.electronics_large) / MONTHS_PER_YEAR;
  monthly += monthlySpending * EMISSION_FACTORS.shopping.general_spending;

  return roundToHundredths(monthly);
}

/**
 * Calculates monthly water-related emissions based on shower duration and daily water usage.
 *
 * @param {Object} data - Water usage input data.
 * @param {number} [data.showerMinutesPerDay=8] - Average daily shower duration in minutes.
 * @param {number} [data.litersPerDay=100] - Average daily water consumption in liters.
 * @returns {number} Monthly CO₂ emissions in kilograms, rounded to two decimal places.
 *
 * @example
 * calculateWater({ showerMinutesPerDay: 10, litersPerDay: 120 })
 * // Returns: 13.68
 */
export function calculateWater(data) {
  const safeData = ensureObject(data);
  const {
    showerMinutesPerDay = 8,
    litersPerDay = 100,
  } = safeData;

  let monthly = 0;

  monthly += showerMinutesPerDay * DAYS_PER_MONTH * EMISSION_FACTORS.water.shower_per_min;
  monthly += litersPerDay * DAYS_PER_MONTH * EMISSION_FACTORS.water.per_liter;

  return roundToHundredths(monthly);
}

/**
 * Calculates total emissions across all categories and produces a complete footprint summary.
 * Aggregates transportation, energy, food, shopping, and water emissions into monthly,
 * yearly, and tons-per-year metrics.
 *
 * @param {Object} formData - Combined input data object with category sub-objects.
 * @param {Object} [formData.transportation] - Transportation activity data.
 * @param {Object} [formData.energy] - Home energy data.
 * @param {Object} [formData.food] - Food and diet data.
 * @param {Object} [formData.shopping] - Shopping and consumption data.
 * @param {Object} [formData.water] - Water usage data.
 * @returns {Object} Complete emission breakdown.
 * @returns {Object} returns.breakdown - Per-category monthly emissions (kg CO₂).
 * @returns {number} returns.monthlyTotal - Total monthly emissions (kg CO₂).
 * @returns {number} returns.yearlyTotal - Projected annual emissions (kg CO₂).
 * @returns {number} returns.yearlyTons - Projected annual emissions (metric tons CO₂).
 *
 * @example
 * const result = calculateTotal({
 *   transportation: { carType: 'gasoline', carKmPerWeek: 100 },
 *   food: { dietType: 'mixed' }
 * });
 * // result.monthlyTotal => combined kg CO₂/month
 */
export function calculateTotal(formData) {
  const safeFormData = ensureObject(formData);

  const transportation = calculateTransportation(safeFormData.transportation);
  const energy = calculateEnergy(safeFormData.energy);
  const food = calculateFood(safeFormData.food);
  const shopping = calculateShopping(safeFormData.shopping);
  const water = calculateWater(safeFormData.water);

  const monthlyTotal = transportation + energy + food + shopping + water;
  const yearlyTotal = monthlyTotal * MONTHS_PER_YEAR;

  return {
    breakdown: {
      transportation,
      energy,
      food,
      shopping,
      water,
    },
    monthlyTotal: roundToHundredths(monthlyTotal),
    yearlyTotal: roundToHundredths(yearlyTotal),
    yearlyTons: roundToHundredths(yearlyTotal / KG_PER_TON),
  };
}

/**
 * Calculates a planetary health score (0–100) based on monthly emissions.
 * Higher scores indicate lower emissions and better environmental impact.
 * Score ranges are calibrated against global per-capita averages.
 *
 * @param {number} monthlyKg - Monthly CO₂ emissions in kilograms.
 * @returns {number} Score from 0-100, where 100 = zero emissions and 5 = extreme emissions.
 *
 * @example
 * calculateCarbonScore(150)  // Returns: 82
 * calculateCarbonScore(500)  // Returns: 45
 * calculateCarbonScore(0)    // Returns: 100
 */
export function calculateCarbonScore(monthlyKg) {
  if (typeof monthlyKg !== 'number' || !Number.isFinite(monthlyKg)) return 50;

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
 * Returns a human-readable label, color, and emoji for a given planetary health score.
 *
 * @param {number} score - The planetary health score (0-100).
 * @returns {{label: string, color: string, emoji: string}} Object containing:
 *   - label: Human-readable rating category
 *   - color: Hex color code for visual representation
 *   - emoji: Decorative emoji for the rating level
 *
 * @example
 * getScoreInfo(85) // { label: 'Excellent', color: '#10b981', emoji: '🌟' }
 * getScoreInfo(45) // { label: 'Average', color: '#fbbf24', emoji: '🌱' }
 */
export function getScoreInfo(score) {
  if (score >= 80) return { label: 'Excellent', color: '#10b981', emoji: '🌟' };
  if (score >= 60) return { label: 'Good', color: '#34d399', emoji: '🌿' };
  if (score >= 40) return { label: 'Average', color: '#fbbf24', emoji: '🌱' };
  if (score >= 20) return { label: 'Needs Work', color: '#f97316', emoji: '⚠️' };
  return { label: 'Critical', color: '#f43f5e', emoji: '🔴' };
}

/**
 * Compares a user's monthly emissions against a national or global average.
 * Returns the difference, percentage, and a human-readable comparison label.
 *
 * @param {number} monthlyKg - User's monthly emissions in kg CO₂.
 * @param {string} [country='global'] - Country code for comparison ('US', 'EU', 'UK', 'India', 'China', 'global').
 * @returns {Object} Comparison result object.
 * @returns {number} returns.average - The national/global average monthly emissions (kg).
 * @returns {number} returns.difference - Absolute difference from average (kg).
 * @returns {number} returns.percentDiff - Percentage difference from average.
 * @returns {boolean} returns.isBelowAverage - Whether the user is below (better than) average.
 * @returns {string} returns.label - Human-readable comparison string.
 *
 * @example
 * compareWithAverage(300, 'global')
 * // { average: 400, difference: -100, percentDiff: -25, isBelowAverage: true, label: '25% below average' }
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
