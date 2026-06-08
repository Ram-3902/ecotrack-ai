import { useState, useRef, useEffect } from 'react';
import { getResponse, getGreeting } from '../utils/chatEngine';
import { calculateTotal, calculateCarbonScore } from '../utils/carbonEngine';
import { getTopInsights } from '../utils/insightsEngine';

export default function CoachPage({ carbonData, onUpdateCarbonData }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Coach interview wizard state
  const [isCoaching, setIsCoaching] = useState(false);
  const [coachStep, setCoachStep] = useState(0); // 0: inactive, 1: transport, 2: food, 3: energy, 4: shopping, 5: results
  const [coachAnswers, setCoachAnswers] = useState({
    transportation: { carType: 'gasoline', carKmPerWeek: 80, busKmPerWeek: 20, trainKmPerWeek: 10, flightsPerYear: 2 },
    energy: { electricityKwhPerMonth: 350, renewablePercent: 15, heatingType: 'electric' },
    food: { dietType: 'mixed', foodWastePercent: 15 },
    shopping: { clothingItemsPerMonth: 2, electronicsSmallPerYear: 3, monthlySpending: 200 },
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
    }, 800);
  };

  // --- Guided Diagnostics Handlers ---
  const startCoachAssessment = () => {
    setIsCoaching(true);
    setCoachStep(1);
  };

  const handleCoachValueChange = (category, field, value) => {
    setCoachAnswers(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const completeCoachAssessment = () => {
    setCoachStep(5);
    setIsTyping(true);

    setTimeout(() => {
      const calculated = calculateTotal({
        ...coachAnswers,
        water: { showerMinutesPerDay: 8, litersPerDay: 100 } // fallback baseline
      });

      const score = calculateCarbonScore(calculated.monthlyTotal);

      // Find highest emission category
      const sorted = Object.entries(calculated.breakdown).sort((a, b) => b[1] - a[1]);
      const biggestSourceKey = sorted[0][0];

      const labels = {
        transportation: 'Transportation (commuting & flights)',
        energy: 'Home Electricity & Heating',
        food: 'Food dietary choices & kitchen food waste',
        shopping: 'Apparel purchase rates & general consumer spending',
      };

      const recs = getTopInsights(calculated.breakdown, 3);

      const actionPlans = {
        transportation: [
          { day: 'Mon', title: 'Work from Home', task: 'Skip commuting entirely today.' },
          { day: 'Tue', title: 'Share a Ride', task: 'Carpool with a co-worker or neighbor.' },
          { day: 'Wed', title: 'Pedal Power', task: 'Bike or walk for any trips under 3 km.' },
          { day: 'Thu', title: 'Metro Transit', task: 'Ride local bus or subway commuter lines.' },
          { day: 'Fri', title: 'Tire Pressure Sync', task: 'Ensure tires are fully inflated to save fuel.' },
          { day: 'Sat', title: 'Fly Less Audit', task: 'Swap a regional flight with train transit.' },
          { day: 'Sun', title: 'Local Staycation', task: 'Spend your day in local walking tracks.' }
        ],
        energy: [
          { day: 'Mon', title: 'Standby Off', task: 'Unplug devices on standby to prevent phantom draw.' },
          { day: 'Tue', title: 'Eco Laundry', task: 'Wash all clothes on a cold-water cycle.' },
          { day: 'Wed', title: 'Bulb Transition', task: 'Replace one standard bulb with an LED.' },
          { day: 'Thu', title: 'Thermostat Nudge', task: 'Offset heat down by 2°C for 24 hours.' },
          { day: 'Fri', title: 'Rack Drying', task: 'Dry laundry on a rack instead of the machine.' },
          { day: 'Sat', title: 'Green Tariff Audit', task: 'Search for green power choices from your provider.' },
          { day: 'Sun', title: 'Screens Off', task: 'Disconnect screens 2 hours before sleep.' }
        ],
        food: [
          { day: 'Mon', title: 'Meatless Monday', task: 'Eat plant-based proteins (beans, lentils).' },
          { day: 'Tue', title: 'Leftovers First', task: 'Plan a meal solely using food items in fridge.' },
          { day: 'Wed', title: 'Plant Milk Swap', task: 'Substitute cow milk with oat or soy milk.' },
          { day: 'Thu', title: 'Veggies Prep', task: 'Cook a 100% plant-forward lunch.' },
          { day: 'Fri', title: 'Regional Produce', task: 'Buy veggies from a local farmer\'s market.' },
          { day: 'Sat', title: 'Composting Start', task: 'Establish a compost bin for veggie peels.' },
          { day: 'Sun', title: 'Grocery Planner', task: 'Plan exactly what to buy to prevent food waste.' }
        ],
        shopping: [
          { day: 'Mon', title: 'No-Buy Day', task: 'Avoid purchasing non-essential goods.' },
          { day: 'Tue', title: 'Unsubscribe Sweep', task: 'Unsubscribe from fashion promotion mailing lists.' },
          { day: 'Wed', title: 'Thrift Catalog', task: 'Look up second-hand clothing apps.' },
          { day: 'Thu', title: 'Mending Repair', task: 'Fix a broken item instead of replacing it.' },
          { day: 'Fri', title: 'Reusable Carry', task: 'Pack a reusable bag and bottle into your backpack.' },
          { day: 'Sat', title: 'Closet Swap', task: 'Audit clothes items and donate what you don\'t wear.' },
          { day: 'Sun', title: '48-Hour Waiting', task: 'Put shopping list items on hold for 2 days.' }
        ],
      };

      const plan = actionPlans[biggestSourceKey] || actionPlans.energy;

      setCoachResults({
        score,
        breakdown: calculated.breakdown,
        total: calculated.monthlyTotal,
        yearlyTons: calculated.yearlyTons,
        biggestSource: labels[biggestSourceKey] || biggestSourceKey,
        recommendations: recs,
        weeklyPlan: plan,
        formData: coachAnswers
      });
      setIsTyping(false);
    }, 1200);
  };

  const applyCoachCalibration = () => {
    if (!coachResults) return;
    onUpdateCarbonData({
      breakdown: coachResults.breakdown,
      monthlyTotal: coachResults.total,
      yearlyTotal: coachResults.total * 12,
      yearlyTons: coachResults.yearlyTons,
      score: coachResults.score,
      formData: coachResults.formData,
    });

    setIsCoaching(false);
    setCoachStep(0);
    setCoachResults(null);

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'ai',
      text: `🔬 **Footprint assessment completed successfully!**

Your carbon score of **${coachResults.score}/100** has been synced. The dashboard graphs and simulator settings have updated matching your assessment data.`
    }]);
  };

  return (
    <div className="container" style={{ padding: '40px 0 60px 0', minHeight: '600px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '24px',
        height: '620px',
      }}>
        {/* Left Sidebar */}
        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
          <button className="saas-btn saas-btn--primary" style={{ width: '100%' }} onClick={() => {
            setIsCoaching(false);
            setCoachStep(0);
            setCoachResults(null);
            setMessages([{ id: Date.now().toString(), role: 'ai', text: getGreeting().text, followUps: getGreeting().followUps }]);
          }}>
            💬 New Conversation
          </button>

          <button className="saas-btn saas-btn--secondary" style={{ width: '100%' }} onClick={startCoachAssessment}>
            🌿 Start Assessment
          </button>

          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggested Topics</div>
            {['Solar power cost', 'Going vegetarian', 'EV vs Gas cars', 'Phasing out flights'].map((topic, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(topic)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '6px 0',
                  transition: 'color 0.2s',
                }}
                onMouseOver={(e) => e.target.style.color = 'var(--color-primary)'}
                onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                · {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Right Chat Pane */}
        <div className="saas-chat-container">
          
          {/* Header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.01)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🤖</span>
              <span style={{ fontWeight: 600, fontSize: '15px' }}>{isCoaching ? 'AI Sustainability Assessment' : 'AI Guide'}</span>
            </div>
            {isCoaching && (
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                PHASE {coachStep} / 4
              </span>
            )}
          </div>

          {/* Messages or Coach Flow Content */}
          <div className="saas-chat-messages">
            
            {isCoaching ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                
                {coachStep === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
                    <h3>🚗 Transportation Profile</h3>
                    <p>Enter your commute habits below to let the Coach compute your transit emissions.</p>
                    
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Vehicle Class</label>
                      <select
                        className="saas-select"
                        value={coachAnswers.transportation.carType}
                        onChange={(e) => handleCoachValueChange('transportation', 'carType', e.target.value)}
                      >
                        <option value="none">No Car (Active Transit / Walks)</option>
                        <option value="gasoline">Gasoline Combustion Vehicle</option>
                        <option value="diesel">Diesel Commuter</option>
                        <option value="hybrid">Standard Hybrid</option>
                        <option value="electric">Electric Vehicle (EV)</option>
                      </select>
                    </div>

                    {coachAnswers.transportation.carType !== 'none' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                          <span>Car Commutes (km/week):</span>
                          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{coachAnswers.transportation.carKmPerWeek} km</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="500"
                          className="saas-slider"
                          value={coachAnswers.transportation.carKmPerWeek}
                          onChange={(e) => handleCoachValueChange('transportation', 'carKmPerWeek', parseInt(e.target.value))}
                        />
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                          <span>Transit (km/wk):</span>
                          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{coachAnswers.transportation.busKmPerWeek} km</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="200"
                          className="saas-slider"
                          value={coachAnswers.transportation.busKmPerWeek}
                          onChange={(e) => handleCoachValueChange('transportation', 'busKmPerWeek', parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                          <span>Flights (/yr):</span>
                          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{coachAnswers.transportation.flightsPerYear}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          className="saas-slider"
                          value={coachAnswers.transportation.flightsPerYear}
                          onChange={(e) => handleCoachValueChange('transportation', 'flightsPerYear', parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <button className="saas-btn saas-btn--primary" style={{ alignSelf: 'flex-end', marginTop: '12px' }} onClick={() => setCoachStep(2)}>
                      Next: Food Profile →
                    </button>
                  </div>
                )}

                {coachStep === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
                    <h3>🥦 Food & Waste Assessment</h3>
                    <p>Select your diet type and specify the average grocery discard rate.</p>

                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Primary Diet</label>
                      <select
                        className="saas-select"
                        value={coachAnswers.food.dietType}
                        onChange={(e) => handleCoachValueChange('food', 'dietType', e.target.value)}
                      >
                        <option value="heavy_meat">🥩 Heavy Meat Eater (Beef/Pork daily)</option>
                        <option value="mixed">🥗 Mixed Balanced Diet</option>
                        <option value="pescatarian">🐟 Pescatarian</option>
                        <option value="vegetarian">🥦 Vegetarian</option>
                        <option value="vegan">🌱 Vegan / 100% Plant-Based</option>
                      </select>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span>Wasted Grocery Portions:</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{coachAnswers.food.foodWastePercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        className="saas-slider"
                        value={coachAnswers.food.foodWastePercent}
                        onChange={(e) => handleCoachValueChange('food', 'foodWastePercent', parseInt(e.target.value))}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                      <button className="saas-btn" onClick={() => setCoachStep(1)}>← Back</button>
                      <button className="saas-btn saas-btn--primary" onClick={() => setCoachStep(3)}>Next: Energy Profile →</button>
                    </div>
                  </div>
                )}

                {coachStep === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
                    <h3>⚡ Household Energy Profile</h3>
                    <p>Enter your electricity consumption metrics.</p>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span>Monthly Electricity:</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{coachAnswers.energy.electricityKwhPerMonth} kWh</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="1200"
                        step="50"
                        className="saas-slider"
                        value={coachAnswers.energy.electricityKwhPerMonth}
                        onChange={(e) => handleCoachValueChange('energy', 'electricityKwhPerMonth', parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span>Renewable Electricity Share:</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{coachAnswers.energy.renewablePercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        className="saas-slider"
                        value={coachAnswers.energy.renewablePercent}
                        onChange={(e) => handleCoachValueChange('energy', 'renewablePercent', parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Heating Fuel</label>
                      <select
                        className="saas-select"
                        value={coachAnswers.energy.heatingType}
                        onChange={(e) => handleCoachValueChange('energy', 'heatingType', e.target.value)}
                      >
                        <option value="electric">Electric (Heat Pump / Baseboard)</option>
                        <option value="natural_gas">Natural Gas Furnace</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                      <button className="saas-btn" onClick={() => setCoachStep(2)}>← Back</button>
                      <button className="saas-btn saas-btn--primary" onClick={() => setCoachStep(4)}>Next: Shopping Profile →</button>
                    </div>
                  </div>
                )}

                {coachStep === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '520px', margin: '0 auto', width: '100%' }}>
                    <h3>🛍️ Consumer Shopping Profile</h3>
                    <p>Enter your clothes shopping rates and goods spending.</p>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span>New Apparel Bought (items/month):</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{coachAnswers.shopping.clothingItemsPerMonth} items</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="12"
                        className="saas-slider"
                        value={coachAnswers.shopping.clothingItemsPerMonth}
                        onChange={(e) => handleCoachValueChange('shopping', 'clothingItemsPerMonth', parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span>Monthly Goods Spending ($):</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>${coachAnswers.shopping.monthlySpending}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1200"
                        step="50"
                        className="saas-slider"
                        value={coachAnswers.shopping.monthlySpending}
                        onChange={(e) => handleCoachValueChange('shopping', 'monthlySpending', parseInt(e.target.value))}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                      <button className="saas-btn" onClick={() => setCoachStep(3)}>← Back</button>
                      <button className="saas-btn saas-btn--primary" onClick={completeCoachAssessment}>Complete Analysis ✨</button>
                    </div>
                  </div>
                )}

                {coachStep === 5 && !coachResults && (
                  <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <div className="pulse" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>Analyzing footprint data...</div>
                  </div>
                )}

                {coachStep === 5 && coachResults && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: '490px', paddingRight: '4px', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                      <div>
                        <h3>Assessment Complete</h3>
                        <p style={{ fontSize: '12px' }}>Calculated carbon rating: <strong>{coachResults.yearlyTons} tons</strong> CO₂/yr</p>
                      </div>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(16,185,129,0.1)',
                        border: '2px solid var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: 800,
                        color: 'var(--color-primary)'
                      }}>{coachResults.score}</div>
                    </div>

                    <div className="saas-card" style={{ padding: '12px', borderLeft: '4px solid var(--color-secondary)', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary Driver</div>
                      <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>{coachResults.biggestSource}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>Recommended Mitigations</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {coachResults.recommendations.map(r => (
                          <div key={r.id} style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                            <span style={{ fontSize: '18px' }}>{r.icon}</span>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 600 }}>{r.title}</div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                Reduces ~{r.impactKg} kg/yr · Saves ${r.costSavings}/yr
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '8px' }}>7-Day Action Calendar</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                        {coachResults.weeklyPlan.map(day => (
                          <div key={day.day} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '8px 2px', textAlign: 'center' }} title={`${day.title}: ${day.task}`}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary)' }}>{day.day}</div>
                            <div style={{ fontSize: '11px', marginTop: '2px' }}>🌱</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(16,185,129,0.05)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.15)', marginTop: '12px' }}>
                        <strong>Today's Prescribed Habit:</strong> {coachResults.weeklyPlan[0].title} — {coachResults.weeklyPlan[0].task}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                      <button className="saas-btn" onClick={() => setCoachStep(1)}>Retake Assessment</button>
                      <button className="saas-btn saas-btn--primary" style={{ marginLeft: 'auto' }} onClick={applyCoachCalibration}>Generate My Action Plan</button>
                    </div>

                  </div>
                )}

              </div>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} className={`saas-chat-bubble saas-chat-bubble--${msg.role}`}>
                    <span style={{ fontSize: '20px' }}>{msg.role === 'ai' ? '🤖' : '👤'}</span>
                    <div style={{ flex: 1 }}>
                      {msg.text.split('\n\n').map((para, pIdx) => (
                        <p key={pIdx} style={{ marginBottom: '8px', fontSize: '13px' }}>
                          {para.split('\n').map((line, lIdx) => (
                            <span key={lIdx} style={{ display: 'block' }}>{line}</span>
                          ))}
                        </p>
                      ))}

                      {msg.role === 'ai' && msg.followUps && msg.followUps.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                          {msg.followUps.map((chip, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(chip)}
                              className="saas-btn saas-btn--sm"
                              style={{ border: '1px solid var(--color-primary)', background: 'rgba(16,185,129,0.03)', color: 'var(--color-primary)', borderRadius: '100px' }}
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {isTyping && (
              <div className="saas-chat-bubble saas-chat-bubble--ai">
                <span>🤖</span>
                <div className="pulse" style={{ fontSize: '13px' }}>Coach is responding...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Standard Input Form */}
          {!isCoaching && (
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: '12px',
              background: 'rgba(255,255,255,0.01)',
            }}>
              <input
                type="text"
                className="saas-input"
                placeholder="Ask about electricity tariffs, diets, flight offsets..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="saas-btn saas-btn--primary" onClick={() => handleSendMessage()}>
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
