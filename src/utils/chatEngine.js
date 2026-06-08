// ═══════════════════════════════════════════
// CHAT ENGINE — AI Sustainability Assistant
// ═══════════════════════════════════════════

const KNOWLEDGE_BASE = [
  {
    keywords: ['carbon footprint', 'what is carbon', 'co2', 'carbon dioxide', 'greenhouse'],
    response: `Great question! Your **carbon footprint** is the total amount of greenhouse gases (mainly CO₂) produced by your activities. The average person generates about 4-8 tons of CO₂ per year globally, but in developed countries, it can be 10-20+ tons.

Your footprint comes from:
🚗 **Transportation** (driving, flying)
🏠 **Home energy** (electricity, heating)
🍔 **Food** (especially meat & dairy)
🛍️ **Shopping** (manufacturing goods)
💧 **Water** (pumping & heating)

The good news? Even small changes can make a big difference!`,
    followUps: ['How can I reduce my carbon footprint?', 'What has the biggest impact?', 'How does diet affect emissions?'],
  },
  {
    keywords: ['reduce', 'lower', 'decrease', 'cut', 'how can i', 'tips'],
    response: `Here are the **top 5 most impactful** ways to reduce your carbon footprint:

1. 🚗 **Reduce car travel** — Walk, bike, or use public transit. One fewer car trip per week saves ~250 kg CO₂/year
2. ✈️ **Fly less** — A single transatlantic flight = ~1.6 tons CO₂. Consider trains for shorter trips
3. 🥦 **Eat more plants** — Going vegetarian can cut food emissions by 50%. Even "Meatless Monday" helps!
4. ⚡ **Switch to green energy** — Renewable electricity can eliminate 50-100% of your home energy emissions
5. 🔌 **Be energy efficient** — LED bulbs, smart thermostats, and unplugging devices add up fast

Start with the easiest changes and build from there. Consistency beats perfection!`,
    followUps: ['Tell me more about transportation', 'How do I eat more sustainably?', 'What about renewable energy?'],
  },
  {
    keywords: ['transportation', 'car', 'drive', 'driving', 'commute', 'travel'],
    response: `Transportation typically makes up **25-30% of your carbon footprint**. Here's how to reduce it:

🚌 **Public Transit** — Buses emit ~89g CO₂/km vs cars at ~170-210g
🚴 **Cycling** — Zero emissions + great exercise. E-bikes make longer commutes feasible
🏠 **Remote Work** — Even 2 days/week cuts commute emissions by 40%
🚗 **Carpooling** — Sharing rides cuts per-person emissions by 50-66%
⚡ **Electric Vehicles** — EVs produce 50-70% fewer lifetime emissions than gas cars
🛤️ **Trains over Planes** — For trips under 800km, trains emit 80% less CO₂ than flying

**Quick Win**: Track your weekly km driven and set a goal to reduce by 20%.`,
    followUps: ['Are electric cars really better?', 'What about flying?', 'How does carpooling work?'],
  },
  {
    keywords: ['electric car', 'ev', 'electric vehicle', 'tesla', 'hybrid'],
    response: `**Electric vehicles are significantly better for the climate** — here's the data:

📊 **Lifetime Emissions**: EVs produce 50-70% fewer total emissions than gas cars, even including battery manufacturing
🔋 **Battery Impact**: Manufacturing an EV battery does produce emissions (~8-15 tons CO₂), but this is offset within 2-3 years of driving
⚡ **Grid Matters**: The cleaner your electricity grid, the greener your EV. With solar panels, it's almost zero-emission
💰 **Cost Savings**: EVs cost 2-3x less per km to "fuel" and require less maintenance

**Hybrid vehicles** are a good middle ground if a full EV isn't feasible, reducing emissions by 30-40%.

**Pro tip**: Check if your area offers EV tax credits or incentives — many governments offer $2,000-$7,500 in rebates!`,
    followUps: ['How do I charge an EV at home?', 'What about renewable energy?', 'Are there EV incentives?'],
  },
  {
    keywords: ['fly', 'flying', 'flight', 'airplane', 'aviation', 'plane'],
    response: `Flying is one of the **most carbon-intensive activities** per hour:

✈️ A round-trip flight from NYC to London = ~1.6 tons CO₂ per passenger
📊 That's roughly **8% of the average American's annual footprint** in a single trip

**How to reduce flight emissions:**
🛤️ Take the train for trips under 800km (80% fewer emissions)
💻 Use video calls instead of business travel when possible
📅 Combine trips — one longer vacation vs multiple short flights
💺 Fly economy (business class has 3x the footprint per passenger)
🌱 Purchase verified carbon offsets (Gold Standard or Verra certified)

**Fun fact**: The "flight shame" movement in Sweden has reduced domestic flights by 9%!`,
    followUps: ['What are carbon offsets?', 'How do I travel sustainably?', 'Tell me about trains'],
  },
  {
    keywords: ['diet', 'food', 'eat', 'meat', 'vegan', 'vegetarian', 'plant'],
    response: `Your diet has a **huge impact** on your carbon footprint — food accounts for 10-30% of emissions:

🥩 **Beef**: 27 kg CO₂ per kg — the highest of any common food
🐑 **Lamb**: 39 kg CO₂ per kg
🧀 **Cheese**: 13.5 kg CO₂ per kg
🐔 **Chicken**: 6.9 kg CO₂ per kg
🐟 **Fish**: 5-15 kg CO₂ per kg
🥦 **Vegetables**: 0.5-2 kg CO₂ per kg
🫘 **Legumes**: 0.9 kg CO₂ per kg

**Impact of dietary changes:**
- Going vegetarian: **-50%** food emissions
- Going vegan: **-70%** food emissions
- Meatless Monday: **-14%** food emissions

You don't need to go fully vegan — even reducing meat by 2-3 meals per week makes a meaningful difference!`,
    followUps: ['What are the best plant proteins?', 'How does food waste affect emissions?', 'What about local food?'],
  },
  {
    keywords: ['energy', 'electricity', 'power', 'solar', 'renewable', 'green energy', 'wind'],
    response: `Home energy typically accounts for **20-30% of your footprint**. Here's how to green it up:

☀️ **Solar Panels**: Can offset 80-100% of electricity emissions. Payback period: 6-10 years
🌬️ **Green Tariffs**: Many utilities offer 100% renewable plans, often at similar cost
💡 **LED Lighting**: Uses 75% less energy than incandescent, lasts 25x longer
🌡️ **Smart Thermostat**: Saves 10-15% on heating/cooling annually
🔌 **Phantom Loads**: Standby electronics waste 5-10% of home electricity
🏠 **Insulation**: Proper insulation cuts heating needs by 30-50%

**Priority actions by impact:**
1. Switch to renewable electricity provider (~1.5 tons CO₂/year savings)
2. Improve insulation (~0.5-1 ton/year)
3. Install smart thermostat (~0.3 tons/year)
4. Switch to LED lighting (~0.2 tons/year)`,
    followUps: ['Tell me about solar panels', 'How do smart thermostats help?', 'What is a green energy tariff?'],
  },
  {
    keywords: ['solar panel', 'solar energy', 'photovoltaic'],
    response: `**Solar panels are one of the best long-term climate investments:**

📊 **By the numbers:**
- Average home system: 5-10 kW
- Annual savings: 3,000-8,000 kg CO₂
- Payback period: 6-10 years
- Lifespan: 25-30 years
- Cost: $10,000-$25,000 (before incentives)

💰 **Financial incentives:**
- Federal tax credit: 30% in the US (through 2032)
- State/local rebates: $1,000-$5,000 additional
- Net metering: Sell excess power back to the grid
- ROI: 10-20% annually after payback

🔋 **Battery storage** (like Tesla Powerwall) lets you store solar energy for nighttime use and provides backup power.

**Pro tip**: Get 3+ quotes from different installers, and check EnergySage for transparent pricing!`,
    followUps: ['What about battery storage?', 'How does net metering work?', 'Are there tax credits?'],
  },
  {
    keywords: ['water', 'shower', 'bath', 'conservation'],
    response: `Water conservation reduces both **water waste and energy emissions** (heating water is energy-intensive):

🚿 **Shorter Showers**: Cutting from 10→5 min saves 40 liters of hot water daily
🔧 **Fix Leaks**: A dripping faucet wastes 15 liters/day (5,500 liters/year!)
💧 **Low-Flow Fixtures**: Reduce water use 30-50% without sacrificing pressure
🧺 **Full Loads Only**: Run dishwashers and washing machines only when full
🌧️ **Rainwater Harvesting**: Collect rainwater for garden irrigation
🌿 **Native Plants**: Xeriscape gardens need 50-75% less water

**Did you know?** Heating water accounts for 18% of home energy use in the average household. Every liter of hot water saved also saves energy!`,
    followUps: ['How can I save energy at home?', 'What about food waste?', 'Tell me about gardening'],
  },
  {
    keywords: ['offset', 'carbon offset', 'carbon credit', 'neutralize'],
    response: `**Carbon offsets** let you compensate for emissions you can't yet eliminate:

🌳 **How they work**: You fund projects that reduce or remove CO₂ elsewhere (reforestation, renewable energy, methane capture)
💰 **Cost**: Typically $5-$50 per ton of CO₂
✅ **Quality matters** — look for these certifications:
- **Gold Standard** (highest quality)
- **Verra/VCS** (well-established)
- **Plan Vivo** (community-focused)

⚠️ **Important caveats:**
- Offsets should be a **last resort**, not a first step
- First: reduce → then: offset the remainder
- Avoid "greenwashing" — some projects have questionable impact
- Prefer removal (reforestation) over avoidance (preventing deforestation)

**Recommended approach**: Reduce 80% through lifestyle changes, offset the remaining 20%.`,
    followUps: ['How much would it cost to offset my footprint?', 'What are the best offset projects?', 'Is carbon offsetting effective?'],
  },
  {
    keywords: ['recycle', 'recycling', 'waste', 'trash', 'zero waste', 'compost'],
    response: `Reducing waste goes beyond just recycling — here's the **waste hierarchy**:

1. 🚫 **Refuse**: Don't buy what you don't need
2. ✂️ **Reduce**: Buy less, choose minimal packaging
3. 🔄 **Reuse**: Repair, repurpose, donate
4. ♻️ **Recycle**: Paper, glass, metal, certain plastics
5. 🌱 **Rot**: Compost food scraps and yard waste

**Composting impact:**
- Diverts 30% of household waste from landfills
- Prevents methane emissions (28x more potent than CO₂)
- Creates nutrient-rich soil for gardens

**Recycling facts:**
- Recycling aluminum saves 95% of the energy vs. new production
- Recycling paper saves 70% of energy
- Only 9% of plastic ever produced has been recycled 😔

**Pro tip**: Focus on refusing and reducing first — they have the biggest impact!`,
    followUps: ['How do I start composting?', 'What plastics can be recycled?', 'Tell me about zero waste living'],
  },
  {
    keywords: ['tree', 'plant', 'reforestation', 'forest', 'nature'],
    response: `**Trees are nature's carbon capture technology:**

🌳 A mature tree absorbs ~22 kg CO₂/year
🌲 One acre of forest absorbs ~2.5 tons CO₂/year
🌍 Global forests absorb ~2.6 billion tons CO₂/year

**Ways to contribute:**
- 🌱 Plant trees in your yard or community
- 🤝 Support reforestation organizations (One Tree Planted, Eden Reforestation)
- 🏛️ Advocate for urban tree canopy expansion
- 💚 Choose products from sustainably managed forests (FSC certified)

**Top reforestation organizations:**
- **One Tree Planted**: $1 per tree, global projects
- **Eden Reforestation**: $0.10 per tree, employs local communities
- **Ecosia**: Search engine that plants trees with ad revenue

**Fun fact**: The world needs to plant ~1 trillion trees to absorb 10 years of CO₂ emissions!`,
    followUps: ['How many trees should I plant?', 'What about carbon offsets?', 'Tell me about biodiversity'],
  },
  {
    keywords: ['fashion', 'clothing', 'fast fashion', 'sustainable fashion'],
    response: `The fashion industry produces **8-10% of global emissions** — more than aviation and shipping combined:

👗 **Fast fashion impact:**
- Average garment worn only 7 times before disposal
- 85% of textiles end up in landfills
- Producing one cotton t-shirt uses 2,700 liters of water

🌿 **Sustainable fashion tips:**
1. **Buy less, choose well** — quality over quantity
2. **Second-hand shopping** — thrift stores, Depop, ThredUp
3. **Clothing swaps** — exchange with friends
4. **Repair & alter** — extend garment life
5. **Choose sustainable brands** — look for B Corp, GOTS, Fair Trade
6. **Wash less, wash cold** — reduces energy and microplastic shedding

**The 30-wear test**: Before buying, ask "Will I wear this at least 30 times?" If not, skip it.`,
    followUps: ['What are sustainable fabric choices?', 'How does washing affect the environment?', 'Tell me about minimalism'],
  },
  {
    keywords: ['climate change', 'global warming', 'climate crisis', 'climate emergency'],
    response: `**Climate change is the defining challenge of our time** — but there's hope:

📊 **Current state:**
- Global temperature has risen ~1.1°C since pre-industrial times
- We need to limit warming to 1.5°C to avoid the worst impacts
- CO₂ levels are at 420 ppm — highest in 800,000 years

🌍 **Why it matters:**
- More extreme weather events (hurricanes, droughts, floods)
- Rising sea levels threatening coastal cities
- Biodiversity loss and ecosystem disruption
- Agricultural disruption and food insecurity

💚 **Reasons for hope:**
- Renewable energy is now cheaper than fossil fuels in most regions
- EV adoption is accelerating exponentially
- Over 70 countries have net-zero commitments
- Individual action creates ripple effects in communities

**Your role matters**: If every person reduced their footprint by 20%, it would be equivalent to taking 1.3 billion cars off the road!`,
    followUps: ['What can I do about climate change?', 'What is net zero?', 'How does individual action help?'],
  },
  {
    keywords: ['net zero', 'carbon neutral', 'zero emissions'],
    response: `**Net zero** means balancing the greenhouse gases you emit with an equivalent amount removed:

⚖️ **How it works:**
1. **Measure** your total emissions
2. **Reduce** as much as possible (the priority)
3. **Remove/offset** the remainder through verified projects

🏢 **Who's committed:**
- 70+ countries (including EU, US, China, India)
- 5,000+ companies
- Target year: Most aim for 2050

👤 **Personal net zero roadmap:**
1. Calculate your footprint (use our calculator! 🌿)
2. Reduce transportation emissions by 50%
3. Switch to renewable energy
4. Adopt a plant-forward diet
5. Offset remaining 1-2 tons/year (~$20-$100)

The average path to personal net zero takes 3-5 years of gradual changes. **Start today!**`,
    followUps: ['How do I start my net zero journey?', 'What are the best carbon offsets?', 'Calculate my footprint'],
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    response: `Hello! 🌿 I'm your **EcoTrack AI Sustainability Assistant**. I'm here to help you understand and reduce your environmental impact.

I can help with:
🌍 **Carbon footprint** questions and explanations
💡 **Personalized tips** to reduce your emissions
🚗 **Transportation** advice (EVs, cycling, public transit)
🥦 **Sustainable food** choices and diet tips
⚡ **Green energy** options for your home
♻️ **Waste reduction** and recycling guidance
🌳 **Offsetting** and reforestation info

What would you like to explore today?`,
    followUps: ['What is a carbon footprint?', 'How can I reduce my emissions?', 'Tell me about sustainable living'],
  },
  {
    keywords: ['thank', 'thanks', 'awesome', 'great', 'helpful'],
    response: `You're welcome! 🌿 Every question you ask and every small step you take matters. Remember:

💚 **Progress, not perfection** — small consistent changes add up
📊 **Track your journey** — use our Dashboard to see your improvements
🏆 **Try challenges** — check out the Eco Challenges for fun daily actions
🤝 **Share knowledge** — inspire friends and family to join you

Keep making a difference — the planet thanks you! 🌍✨

Anything else I can help with?`,
    followUps: ['Show me eco challenges', 'What should I focus on first?', 'Tell me something interesting about sustainability'],
  },
];

// Default response for unrecognized queries
const DEFAULT_RESPONSE = {
  response: `That's an interesting question! While I may not have a specific answer for that, I can help with many sustainability topics:

🌍 **Carbon footprint** — understanding and reducing your emissions
🚗 **Green transportation** — EVs, cycling, public transit
🥦 **Sustainable food** — diet choices, food waste, local eating
⚡ **Clean energy** — solar, wind, energy efficiency
♻️ **Waste reduction** — recycling, composting, zero waste
🌳 **Nature & offsets** — reforestation, carbon offsets
👗 **Sustainable fashion** — ethical clothing choices

Try asking me about any of these topics!`,
  followUps: ['How can I reduce my carbon footprint?', 'What has the biggest environmental impact?', 'Tell me about renewable energy'],
};

/**
 * Find the best matching response for a user query
 */
export function getResponse(query) {
  const normalizedQuery = query.toLowerCase().trim();

  // Score each knowledge entry
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalizedQuery.includes(keyword)) {
        // Longer keyword matches are worth more
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  // Return best match or default
  if (bestMatch && bestScore > 0) {
    return {
      text: bestMatch.response,
      followUps: bestMatch.followUps || [],
    };
  }

  return {
    text: DEFAULT_RESPONSE.response,
    followUps: DEFAULT_RESPONSE.followUps,
  };
}

/**
 * Get a greeting message
 */
export function getGreeting() {
  const hour = new Date().getHours();
  let timeGreeting;
  if (hour < 12) timeGreeting = 'Good morning';
  else if (hour < 18) timeGreeting = 'Good afternoon';
  else timeGreeting = 'Good evening';

  return {
    text: `${timeGreeting}! 🌿 I'm your **EcoTrack AI Sustainability Assistant**. I can help you understand your environmental impact and find practical ways to live more sustainably.

Ask me anything about:
🌍 Carbon footprint & climate change
🚗 Green transportation
🥦 Sustainable food choices
⚡ Renewable energy
♻️ Waste reduction
🌳 Reforestation & offsets

What's on your mind today?`,
    followUps: ['What is a carbon footprint?', 'How can I reduce my emissions?', 'Tell me about renewable energy'],
  };
}
