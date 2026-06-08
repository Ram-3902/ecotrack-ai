// ═══════════════════════════════════════════
// CHALLENGE DATA — Eco Challenges & Badges
// ═══════════════════════════════════════════

export const CHALLENGES = {
  daily: [
    { id: 'd1', title: 'Meatless Meal', description: 'Have at least one fully plant-based meal today', points: 10, icon: '🥦', category: 'food' },
    { id: 'd2', title: '5-Minute Shower', description: 'Keep your shower under 5 minutes', points: 10, icon: '🚿', category: 'water' },
    { id: 'd3', title: 'Unplug & Disconnect', description: 'Unplug 3 devices you\'re not using', points: 10, icon: '🔌', category: 'energy' },
    { id: 'd4', title: 'Walk or Bike', description: 'Use walking or cycling for at least one trip today', points: 15, icon: '🚴', category: 'transport' },
    { id: 'd5', title: 'Reusable Bottle', description: 'Use only reusable water bottles today (no single-use plastic)', points: 10, icon: '🧴', category: 'waste' },
    { id: 'd6', title: 'Zero Food Waste', description: 'Eat all your food today with no waste', points: 15, icon: '🍽️', category: 'food' },
    { id: 'd7', title: 'Natural Light Only', description: 'Use natural lighting as long as possible before turning on lights', points: 10, icon: '☀️', category: 'energy' },
    { id: 'd8', title: 'Bring Your Own Bag', description: 'Use reusable bags for any shopping trip', points: 10, icon: '🛍️', category: 'waste' },
    { id: 'd9', title: 'Cold Wash Laundry', description: 'Wash clothes in cold water', points: 10, icon: '🧺', category: 'energy' },
    { id: 'd10', title: 'Digital Detox Hour', description: 'Turn off screens for 1 hour to save energy', points: 10, icon: '📵', category: 'energy' },
  ],
  weekly: [
    { id: 'w1', title: 'Meatless Week', description: 'Go fully vegetarian for the entire week', points: 50, icon: '🌿', category: 'food' },
    { id: 'w2', title: 'Car-Free Week', description: 'Avoid driving for 7 days straight', points: 60, icon: '🚫🚗', category: 'transport' },
    { id: 'w3', title: 'Zero Waste Week', description: 'Produce no landfill waste for one week', points: 75, icon: '♻️', category: 'waste' },
    { id: 'w4', title: 'Local Food Only', description: 'Buy only locally sourced food for the week', points: 40, icon: '🌽', category: 'food' },
    { id: 'w5', title: 'Energy Audit', description: 'Check and optimize all energy usage in your home', points: 35, icon: '⚡', category: 'energy' },
    { id: 'w6', title: 'Green Commute Week', description: 'Use public transit, bike, or walk for all commutes', points: 50, icon: '🚌', category: 'transport' },
    { id: 'w7', title: 'Repair Something', description: 'Fix a broken item instead of replacing it', points: 30, icon: '🔧', category: 'waste' },
    { id: 'w8', title: 'Spread Awareness', description: 'Share a sustainability fact with 5 people', points: 25, icon: '📢', category: 'community' },
  ],
  monthly: [
    { id: 'm1', title: 'Plant a Tree', description: 'Plant a tree or donate to a reforestation project', points: 100, icon: '🌳', category: 'nature' },
    { id: 'm2', title: 'Carbon Neutral Month', description: 'Offset all emissions for the month through verified credits', points: 150, icon: '⚖️', category: 'offset' },
    { id: 'm3', title: 'Switch to Green Energy', description: 'Sign up for a renewable energy provider', points: 200, icon: '☀️', category: 'energy' },
    { id: 'm4', title: 'Wardrobe Audit', description: 'Donate/swap at least 10 clothing items instead of buying new', points: 80, icon: '👗', category: 'waste' },
    { id: 'm5', title: '30-Day Vegan Challenge', description: 'Follow a fully vegan diet for 30 days', points: 120, icon: '🥑', category: 'food' },
    { id: 'm6', title: 'Start Composting', description: 'Set up a composting system at home', points: 100, icon: '🌱', category: 'waste' },
  ],
};

export const BADGES = [
  { id: 'b1', name: 'First Step', description: 'Complete your first challenge', icon: '🌱', requirement: { type: 'challenges', count: 1 }, tier: 'bronze' },
  { id: 'b2', name: 'Eco Warrior', description: 'Complete 10 challenges', icon: '⚔️', requirement: { type: 'challenges', count: 10 }, tier: 'silver' },
  { id: 'b3', name: 'Green Champion', description: 'Complete 25 challenges', icon: '🏆', requirement: { type: 'challenges', count: 25 }, tier: 'gold' },
  { id: 'b4', name: 'Planet Protector', description: 'Complete 50 challenges', icon: '🛡️', requirement: { type: 'challenges', count: 50 }, tier: 'platinum' },
  { id: 'b5', name: '3-Day Streak', description: 'Complete daily challenges 3 days in a row', icon: '🔥', requirement: { type: 'streak', count: 3 }, tier: 'bronze' },
  { id: 'b6', name: '7-Day Streak', description: 'Complete daily challenges 7 days in a row', icon: '🔥🔥', requirement: { type: 'streak', count: 7 }, tier: 'silver' },
  { id: 'b7', name: '30-Day Streak', description: 'Complete daily challenges 30 days in a row', icon: '💎', requirement: { type: 'streak', count: 30 }, tier: 'gold' },
  { id: 'b8', name: 'Point Collector', description: 'Earn 100 points', icon: '💰', requirement: { type: 'points', count: 100 }, tier: 'bronze' },
  { id: 'b9', name: 'Point Master', description: 'Earn 500 points', icon: '💎', requirement: { type: 'points', count: 500 }, tier: 'silver' },
  { id: 'b10', name: 'Carbon Cutter', description: 'Reduce estimated emissions by 10%', icon: '✂️', requirement: { type: 'reduction', count: 10 }, tier: 'silver' },
  { id: 'b11', name: 'Sustainability Pro', description: 'Complete challenges in all 5 categories', icon: '🌍', requirement: { type: 'categories', count: 5 }, tier: 'gold' },
  { id: 'b12', name: 'Climate Hero', description: 'Earn 1000 points and complete 50 challenges', icon: '🦸', requirement: { type: 'ultimate', count: 1 }, tier: 'platinum' },
];

const TIER_COLORS = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  platinum: '#e5e4e2',
};

/**
 * Get earned badges based on user progress
 */
export function getEarnedBadges(progress) {
  const {
    completedCount = 0,
    currentStreak = 0,
    totalPoints = 0,
    reductionPercent = 0,
    categoriesCompleted = [],
  } = progress;

  return BADGES.map(badge => {
    let earned = false;
    const req = badge.requirement;

    switch (req.type) {
      case 'challenges':
        earned = completedCount >= req.count;
        break;
      case 'streak':
        earned = currentStreak >= req.count;
        break;
      case 'points':
        earned = totalPoints >= req.count;
        break;
      case 'reduction':
        earned = reductionPercent >= req.count;
        break;
      case 'categories':
        earned = categoriesCompleted.length >= req.count;
        break;
      case 'ultimate':
        earned = totalPoints >= 1000 && completedCount >= 50;
        break;
      default:
        break;
    }

    return { ...badge, earned, tierColor: TIER_COLORS[badge.tier] };
  });
}

/**
 * Calculate points for completed challenges
 */
export function calculatePoints(completedIds) {
  const allChallenges = [
    ...CHALLENGES.daily,
    ...CHALLENGES.weekly,
    ...CHALLENGES.monthly,
  ];

  return completedIds.reduce((total, id) => {
    const challenge = allChallenges.find(c => c.id === id);
    return total + (challenge?.points || 0);
  }, 0);
}

/**
 * Get unique categories from completed challenges
 */
export function getCompletedCategories(completedIds) {
  const allChallenges = [
    ...CHALLENGES.daily,
    ...CHALLENGES.weekly,
    ...CHALLENGES.monthly,
  ];

  const categories = new Set();
  completedIds.forEach(id => {
    const challenge = allChallenges.find(c => c.id === id);
    if (challenge) categories.add(challenge.category);
  });

  return [...categories];
}
