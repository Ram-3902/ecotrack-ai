import { useState, useRef, useEffect } from 'react';
import HolographicPanel from '../ui/HolographicPanel';
import { getResponse, getGreeting } from '../utils/chatEngine';
import { calculateTotal, calculateCarbonScore } from '../utils/carbonEngine';
import { getTopInsights } from '../utils/insightsEngine';

export default function AIGuide({ visible, carbonData, onUpdateCarbonData }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Coach Assessment Flow State
  const [isCoaching, setIsCoaching] = useState(false);
  const [coachStep, setCoachStep] = useState(0); // 0: intro, 1: transport, 2: food, 3: electricity, 4: shopping, 5: results
  const [coachAnswers, setCoachAnswers] = useState({
    transportation: {
      carType: 'gasoline',
      carKmPerWeek: 80,
      busKmPerWeek: 20,
      trainKmPerWeek: 10,
      flightsPerYear: 2,
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
      monthlySpending: 200,
    },
  });

  const [coachResults, setCoachResults] = useState(null);

  useEffect(() => {
    const greeting = getGreeting();
    setMessages([{ id: 'g1', role: 'ai', text: greeting.text, followUps: greeting.followUps }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { id: Date.now().toString(), role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(query);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: response.text,
        followUps: response.followUps
      }]);
    }, 1000);
  };

  // --- Coach Assessment Handlers ---
  const startCoachAssessment = () => {
    setIsCoaching(true);
    setCoachStep(1); // Go straight to transport habit check
  };

  const handleCoachValueChange = (category, field, value) => {
    setCoachAnswers(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const completeCoachAssessment = () => {
    setCoachStep(5); // Show results processing
    setIsTyping(true);

    setTimeout(() => {
      // Calculate
      const calculated = calculateTotal({
        transportation: coachAnswers.transportation,
        energy: coachAnswers.energy,
        food: coachAnswers.food,
        shopping: coachAnswers.shopping,
        water: { showerMinutesPerDay: 8, litersPerDay: 100 } // Default baseline
      });

      const score = calculateCarbonScore(calculated.monthlyTotal);

      // Biggest source
      const breakdown = calculated.breakdown;
      const sortedBreakdown = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
      const biggestSourceKey = sortedBreakdown[0][0];
      const biggestSourceVal = sortedBreakdown[0][1];

      const biggestSourceLabels = {
        transportation: 'Transportation (commuting & flying)',
        energy: 'Home Electricity & Space Heating',
        food: 'Diet choices & household food waste',
        shopping: 'Consumer spending & material purchases',
        water: 'Water supply & hot water heating',
      };

      // Top recommendations
      const recs = getTopInsights(breakdown, 3);

      // Generate a Weekly Action Plan based on their biggest source
      const actionPlans = {
        transportation: [
          { day: 'Mon', title: 'Virtual Transit', task: 'Work from home or join meetings online to bypass commuting.' },
          { day: 'Tue', title: 'Carpool Synergy', task: 'Share your trip with a colleague or friend to cut fuel burn.' },
          { day: 'Wed', title: 'Active Commute', task: 'Bike or walk for any travel distance under 3 kilometers.' },
          { day: 'Thu', title: 'Public Transit Day', task: 'Utilize the city subway, light rail, or bus system.' },
          { day: 'Fri', title: 'Car Efficiency Check', task: 'Remove heavy cargo from trunk and ensure tires are inflated.' },
          { day: 'Sat', title: 'Zero Flight Planning', task: 'Review future travel plans; substitute short flights with rail.' },
          { day: 'Sun', title: 'Ecosystem Reset', task: 'Stay local today. Walk around your local park or area.' }
        ],
        energy: [
          { day: 'Mon', title: 'Phantom Sweep', task: 'Unplug chargers and electronics on standby to stop phantom draw.' },
          { day: 'Tue', title: 'Cold-Wash Cycle', task: 'Do your laundry strictly on a cold-water cycle to save heating.' },
          { day: 'Wed', title: 'LED Transition', task: 'Swap out two standard light bulbs for energy-efficient LEDs.' },
          { day: 'Thu', title: 'Thermostat Offset', task: 'Nudge heating down 2°C or cooling up 2°C for 24 hours.' },
          { day: 'Fri', title: 'Natural Drying', task: 'Hang your laundry on a rack to air-dry instead of running the dryer.' },
          { day: 'Sat', title: 'Solar Tariff Check', task: 'Search for green electricity options with your utility provider.' },
          { day: 'Sun', title: 'Smart Shutoff', task: 'Turn off all screens and main power strips 2 hours before bed.' }
        ],
        food: [
          { day: 'Mon', title: 'Meatless Monday', task: 'Eat fully vegetarian meals today (beans, lentils, vegetables).' },
          { day: 'Tue', title: 'Zero Fridge Waste', task: 'Cook a meal using only existing leftovers from your fridge.' },
          { day: 'Wed', title: 'Dairy-Free Dairy', task: 'Switch from cow milk to oat, almond, or soy milk in coffee.' },
          { day: 'Thu', title: 'Plant-Based Burger', task: 'Try a plant-based meat alternative for lunch or dinner.' },
          { day: 'Fri', title: 'Local Crop Sourcing', task: 'Locate a local farmer\'s market and buy regional vegetables.' },
          { day: 'Sat', title: 'Composting Setup', task: 'Start separating vegetable scraps and coffee grounds for compost.' },
          { day: 'Sun', title: 'Meal Prep Audit', task: 'Plan your weekly meals ahead to prevent over-buying at the market.' }
        ],
        shopping: [
          { day: 'Mon', title: 'No-Buy Challenge', task: 'Avoid purchasing any non-essential material items today.' },
          { day: 'Tue', title: 'Digital Cleanse', task: 'Unsubscribe from three fast-fashion promotional email lists.' },
          { day: 'Wed', title: 'Thrift Exploration', task: 'Look up second-hand stores or thrift apps for clothing needs.' },
          { day: 'Thu', title: 'Repair Café', task: 'Fix a loose button, mend a seam, or clean a device instead of replacing.' },
          { day: 'Fri', title: 'Bag/Bottle Audit', task: 'Pack reusable bags and water bottles into your vehicle/backpack.' },
          { day: 'Sat', title: 'Minimalist Purge', task: 'Sort 5 items of clothing to donate or swap rather than discarding.' },
          { day: 'Sun', title: 'Needs vs. Wants', task: 'Write down purchases you want; wait 48 hours before ordering.' }
        ],
      };

      const plan = actionPlans[biggestSourceKey] || actionPlans.energy;

      setCoachResults({
        score,
        breakdown,
        total: calculated.monthlyTotal,
        yearlyTotal: calculated.yearlyTotal,
        yearlyTons: calculated.yearlyTons,
        biggestSource: biggestSourceLabels[biggestSourceKey] || biggestSourceKey,
        recommendations: recs,
        weeklyPlan: plan,
        formData: coachAnswers
      });
      setIsTyping(false);
    }, 1500);
  };

  const applyCoachCalibration = () => {
    if (!coachResults) return;
    
    // Save to global context
    onUpdateCarbonData({
      breakdown: coachResults.breakdown,
      monthlyTotal: coachResults.total,
      yearlyTotal: coachResults.yearlyTotal,
      yearlyTons: coachResults.yearlyTons,
      score: coachResults.score,
      formData: coachResults.formData,
    });

    // Exit coaching mode
    setIsCoaching(false);
    setCoachStep(0);
    setCoachResults(null);

    // Add a success message in chat
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'ai',
      text: `🔬 **Planetary telemetry calibrated successfully!**\n\nYour carbon score of **${coachResults.score}/100** has been loaded into the central dashboard. The Earth simulation model is now updating with your custom emissions data.`
    }]);
  };

  return (
    <HolographicPanel position={[2.5, -0.4, 0]} size="lg" visible={visible}>
      <div style={{ minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div className="holo-label">AI Coach Module // Sync Enabled</div>
        <h2 className="holo-title">AI Sustainability Coach</h2>

        {/* Coach Assessment Mode */}
        {isCoaching ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Step Indicators */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-cyan)', fontFamily: "'Orbitron', monospace", borderBottom: '1px solid rgba(0, 240, 255, 0.15)', paddingBottom: '6px' }}>
              <span>COACH INTERVIEW</span>
              <span>PHASE {coachStep} of 4</span>
            </div>

            {/* Coach Step: Transport */}
            {coachStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'rgba(255,255,255,0.85)' }}>
                  🤖 "Let's diagnose your **transportation habits**. How do you commute, and how often do you travel by car, transit, and air?"
                </p>

                <div>
                  <label className="holo-label">Commute Car Type</label>
                  <select
                    className="holo-select"
                    value={coachAnswers.transportation.carType}
                    onChange={(e) => handleCoachValueChange('transportation', 'carType', e.target.value)}
                  >
                    <option value="none">No Car (Transit / Active commute)</option>
                    <option value="gasoline">Standard Gasoline Vehicle</option>
                    <option value="diesel">Diesel Commuter</option>
                    <option value="hybrid">Hybrid Engine</option>
                    <option value="electric">Electric Vehicle (EV)</option>
                  </select>
                </div>

                {coachAnswers.transportation.carType !== 'none' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label className="holo-label">Weekly Car Distance</label>
                      <span className="holo-slider-val">{coachAnswers.transportation.carKmPerWeek} km</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      className="holo-slider"
                      value={coachAnswers.transportation.carKmPerWeek}
                      onChange={(e) => handleCoachValueChange('transportation', 'carKmPerWeek', parseInt(e.target.value))}
                    />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label className="holo-label">Transit (km/wk)</label>
                      <span className="holo-slider-val">{coachAnswers.transportation.busKmPerWeek} km</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="10"
                      className="holo-slider"
                      value={coachAnswers.transportation.busKmPerWeek}
                      onChange={(e) => handleCoachValueChange('transportation', 'busKmPerWeek', parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <label className="holo-label">Flights (flights/yr)</label>
                      <span className="holo-slider-val">{coachAnswers.transportation.flightsPerYear}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      className="holo-slider"
                      value={coachAnswers.transportation.flightsPerYear}
                      onChange={(e) => handleCoachValueChange('transportation', 'flightsPerYear', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button className="holo-btn holo-btn--danger" onClick={() => setIsCoaching(false)}>Cancel</button>
                  <button className="holo-btn holo-btn--primary" style={{ marginLeft: 'auto' }} onClick={() => setCoachStep(2)}>Next: Food Habits →</button>
                </div>
              </div>
            )}

            {/* Coach Step: Food */}
            {coachStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'rgba(255,255,255,0.85)' }}>
                  🤖 "Perfect. Next, let's examine your **dietary profile**. What describes your general food consumption and waste?"
                </p>

                <div>
                  <label className="holo-label">Primary Dietary Profile</label>
                  <select
                    className="holo-select"
                    value={coachAnswers.food.dietType}
                    onChange={(e) => handleCoachValueChange('food', 'dietType', e.target.value)}
                  >
                    <option value="heavy_meat">Heavy Meat Consumer (Beef/Pork daily)</option>
                    <option value="mixed">Balanced Mixed Diet (Average meat/veg)</option>
                    <option value="pescatarian">Pescatarian (Fish & veggies only)</option>
                    <option value="vegetarian">Vegetarian (No meat, dairy/eggs allowed)</option>
                    <option value="vegan">Vegan (100% Plant-Based diet)</option>
                  </select>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="holo-label">Household Food Waste</label>
                    <span className="holo-slider-val">{coachAnswers.food.foodWastePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    className="holo-slider"
                    value={coachAnswers.food.foodWastePercent}
                    onChange={(e) => handleCoachValueChange('food', 'foodWastePercent', parseInt(e.target.value))}
                  />
                  <div style={{ fontSize: '10px', color: 'var(--color-muted)', marginTop: '4px' }}>How much of the groceries you buy end up expired or discarded?</div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button className="holo-btn" onClick={() => setCoachStep(1)}>← Back</button>
                  <button className="holo-btn holo-btn--primary" style={{ marginLeft: 'auto' }} onClick={() => setCoachStep(3)}>Next: Energy Usage →</button>
                </div>
              </div>
            )}

            {/* Coach Step: Energy */}
            {coachStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'rgba(255,255,255,0.85)' }}>
                  🤖 "Excellent. Now, how about the **electricity and heating** inside your home?"
                </p>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="holo-label">Monthly Electricity Usage</label>
                    <span className="holo-slider-val">{coachAnswers.energy.electricityKwhPerMonth} kWh</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1200"
                    step="50"
                    className="holo-slider"
                    value={coachAnswers.energy.electricityKwhPerMonth}
                    onChange={(e) => handleCoachValueChange('energy', 'electricityKwhPerMonth', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="holo-label">Renewable Share (%)</label>
                    <span className="holo-slider-val">{coachAnswers.energy.renewablePercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="10"
                    className="holo-slider"
                    value={coachAnswers.energy.renewablePercent}
                    onChange={(e) => handleCoachValueChange('energy', 'renewablePercent', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <label className="holo-label">Space Heating Type</label>
                  <select
                    className="holo-select"
                    value={coachAnswers.energy.heatingType}
                    onChange={(e) => handleCoachValueChange('energy', 'heatingType', e.target.value)}
                  >
                    <option value="electric">Electric (Heat Pump/Electric base)</option>
                    <option value="natural_gas">Natural Gas Furnace</option>
                  </select>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button className="holo-btn" onClick={() => setCoachStep(2)}>← Back</button>
                  <button className="holo-btn holo-btn--primary" style={{ marginLeft: 'auto' }} onClick={() => setCoachStep(4)}>Next: Shopping habits →</button>
                </div>
              </div>
            )}

            {/* Coach Step: Shopping */}
            {coachStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'rgba(255,255,255,0.85)' }}>
                  🤖 "Last step. Let's look at your consumer **shopping habits**. How many clothes do you buy, and what is your general spending?"
                </p>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="holo-label">New Clothing items / month</label>
                    <span className="holo-slider-val">{coachAnswers.shopping.clothingItemsPerMonth} items</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="1"
                    className="holo-slider"
                    value={coachAnswers.shopping.clothingItemsPerMonth}
                    onChange={(e) => handleCoachValueChange('shopping', 'clothingItemsPerMonth', parseInt(e.target.value))}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label className="holo-label">General spending (Goods / month)</label>
                    <span className="holo-slider-val">${coachAnswers.shopping.monthlySpending}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1500"
                    step="50"
                    className="holo-slider"
                    value={coachAnswers.shopping.monthlySpending}
                    onChange={(e) => handleCoachValueChange('shopping', 'monthlySpending', parseInt(e.target.value))}
                  />
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <button className="holo-btn" onClick={() => setCoachStep(3)}>← Back</button>
                  <button className="holo-btn holo-btn--primary" style={{ marginLeft: 'auto' }} onClick={completeCoachAssessment}>Complete Assessment ✨</button>
                </div>
              </div>
            )}

            {/* Processing State */}
            {coachStep === 5 && !coachResults && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <div className="holo-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '12px', color: 'var(--color-cyan)', letterSpacing: '0.15em' }}>
                  COMPUTING CARBON DIAGNOSTICS...
                </div>
              </div>
            )}

            {/* Results Display */}
            {coachStep === 5 && coachResults && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '420px', paddingRight: '4px' }}>
                <div className="holo-badge holo-badge--green" style={{ alignSelf: 'flex-start' }}>Assessment Complete</div>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    border: '3px solid var(--color-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Orbitron', monospace",
                    fontWeight: 800,
                    fontSize: '18px',
                    color: 'var(--color-green)',
                    boxShadow: 'var(--glow-green)'
                  }}>
                    {coachResults.score}
                  </div>
                  <div>
                    <div className="holo-label">Dynamic Carbon Score</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                      Estimated emissions: <strong>{coachResults.yearlyTons} tons</strong> CO₂/year
                    </div>
                  </div>
                </div>

                <div className="holo-card" style={{ padding: '10px 14px', cursor: 'default', borderLeft: '3px solid var(--color-orange)' }}>
                  <div className="holo-label" style={{ color: 'var(--color-orange)', fontSize: '8px' }}>Primary Emission Driver</div>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{coachResults.biggestSource}</div>
                </div>

                <div>
                  <div className="holo-label" style={{ marginBottom: '6px' }}>Personalized Insights</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {coachResults.recommendations.map(rec => (
                      <div key={rec.id} style={{ display: 'flex', gap: '8px', fontSize: '12px', background: 'rgba(0,240,255,0.02)', padding: '8px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <span style={{ fontSize: '16px' }}>{rec.icon}</span>
                        <div>
                          <strong>{rec.title}</strong>
                          <div style={{ color: 'var(--color-muted)', fontSize: '11px', marginTop: '2px' }}>
                            Reduces ~{rec.impactKg}kg CO₂/yr · Saves ${rec.costSavings}/yr
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="holo-label" style={{ marginBottom: '6px' }}>Weekly Action Plan</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                    {coachResults.weeklyPlan.map(day => (
                      <div
                        key={day.day}
                        style={{
                          background: 'rgba(0, 240, 255, 0.04)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '4px',
                          padding: '6px 2px',
                          textAlign: 'center',
                          cursor: 'pointer'
                        }}
                        title={`${day.title}: ${day.task}`}
                      >
                        <div style={{ fontSize: '9px', fontWeight: 700, fontFamily: "'Orbitron', monospace", color: 'var(--color-cyan)' }}>{day.day}</div>
                        <div style={{ fontSize: '10px', marginTop: '2px' }}>🌱</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', background: 'rgba(0, 255, 136, 0.05)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0, 255, 136, 0.15)' }}>
                    <strong>Today's Focus:</strong> {coachResults.weeklyPlan[0].title} — {coachResults.weeklyPlan[0].task}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button className="holo-btn" onClick={() => setCoachStep(1)}>Retake</button>
                  <button className="holo-btn holo-btn--primary" style={{ marginLeft: 'auto' }} onClick={applyCoachCalibration}>Calibrate Biosphere 🌍</button>
                </div>

              </div>
            )}
          </div>
        ) : (
          /* Standard Conversation UI */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* Top banner to trigger Coach */}
            <div
              className="holo-card"
              onClick={startCoachAssessment}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                background: 'linear-gradient(90deg, rgba(0,255,136,0.1), rgba(0,240,255,0.05))',
                marginBottom: '16px',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🌿</span>
                <div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', fontWeight: 700, color: 'var(--color-green)' }}>AI COACH DIAGNOSTIC</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>Conduct a guided habit review & unlock custom weekly actions.</div>
                </div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-green)', fontWeight: 700 }}>START →</span>
            </div>

            {/* Chat Messages */}
            <div className="holo-chat-messages" style={{ flex: 1 }}>
              {messages.map(msg => (
                <div key={msg.id} className={`holo-msg holo-msg--${msg.role}`}>
                  {msg.text.split('\n\n').map((para, pIdx) => {
                    // Check if it is a list or normal paragraph
                    return (
                      <p key={pIdx} style={{ marginBottom: '8px' }}>
                        {para.split('\n').map((line, lIdx) => {
                          return (
                            <span key={lIdx} style={{ display: 'block' }}>
                              {line.startsWith('1. ') || line.startsWith('- ') || line.startsWith('* ') ? (
                                <span style={{ paddingLeft: '8px' }}>{line}</span>
                              ) : (
                                line
                              )}
                            </span>
                          );
                        })}
                      </p>
                    );
                  })}
                  
                  {msg.role === 'ai' && msg.followUps && msg.followUps.length > 0 && (
                    <div className="holo-followups">
                      {msg.followUps.map((chip, idx) => (
                        <div key={idx} className="holo-followup" onClick={() => handleSendMessage(chip)}>
                          {chip}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="holo-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="holo-chat-input">
              <input
                type="text"
                placeholder="Ask about solar panels, EV savings, diet, offsetting..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="holo-btn holo-btn--sm" onClick={() => handleSendMessage()}>
                SEND
              </button>
            </div>
          </div>
        )}
      </div>
    </HolographicPanel>
  );
}
