import { useState, useEffect } from 'react';
import HolographicPanel from '../ui/HolographicPanel';

export default function CommandCenter({ visible, carbonData }) {
  const [simChoices, setSimChoices] = useState({
    solar: false,
    vegan: false,
    ev: false,
    zeroWaste: false,
    thrift: false,
    shortShowers: false,
  });

  const [simResults, setSimResults] = useState({
    co2: 0,
    money: 0,
    trees: 0,
  });

  // Calculate live simulation results based on current user inputs
  useEffect(() => {
    if (!carbonData) return;

    const currentForm = carbonData.formData || {};
    const transport = currentForm.transportation || {};
    const energy = currentForm.energy || {};
    const food = currentForm.food || {};
    const shopping = currentForm.shopping || {};
    const water = currentForm.water || {};

    let co2Reduction = 0; // kg per year
    let moneySavings = 0;  // $ per year

    // 1. Solar/Green power choice
    if (simChoices.solar) {
      // Calculate potential savings: transition remaining grid electricity to renewable
      const electricityMonthly = energy.electricityKwhPerMonth || 350;
      const currentRenewable = energy.renewablePercent || 15;
      const nonRenewableKwh = electricityMonthly * ((100 - currentRenewable) / 100);
      
      // grid factor: 0.42 kg/kWh, renewable factor: 0.05 kg/kWh
      const savingsPerMonth = nonRenewableKwh * (0.42 - 0.05);
      co2Reduction += savingsPerMonth * 12;
      moneySavings += 80; // Estimated green tariff incentive or efficiency savings
    }

    // 2. Vegan diet choice
    if (simChoices.vegan) {
      // Vegan diet is 1.5 kg CO2/day vs current diet
      const currentDietType = food.dietType || 'mixed';
      const dietFactors = { heavy_meat: 7.2, mixed: 4.5, pescatarian: 3.0, vegetarian: 2.5, vegan: 1.5 };
      const currentFactor = dietFactors[currentDietType] || 4.5;
      
      const diffDaily = Math.max(0, currentFactor - 1.5);
      co2Reduction += diffDaily * 365;
      moneySavings += 650; // Grocery savings
    }

    // 3. EV choice (drive electric or drive 50% less)
    if (simChoices.ev) {
      // EV generates 0.05 kg/km vs current car
      const carType = transport.carType || 'gasoline';
      const carKm = transport.carKmPerWeek || 80;
      const carFactors = { gasoline: 0.21, diesel: 0.17, hybrid: 0.11, electric: 0.05, none: 0 };
      const currentFactor = carFactors[carType] || 0.21;
      
      const diffPerKm = Math.max(0, currentFactor - 0.05);
      co2Reduction += diffPerKm * carKm * 52;
      moneySavings += carKm * 52 * 0.15; // Fuel savings (15c per km)
    }

    // 4. Zero food waste
    if (simChoices.zeroWaste) {
      // reduces current food waste to 0
      const dietType = food.dietType || 'mixed';
      const dietFactors = { heavy_meat: 7.2, mixed: 4.5, pescatarian: 3.0, vegetarian: 2.5, vegan: 1.5 };
      const baseDaily = dietFactors[dietType] || 4.5;
      const currentWaste = food.foodWastePercent || 15;
      
      // waste is a direct multiplier: baseDaily * 30 * (wastePercent/100)
      const wasteMonthly = baseDaily * 30 * (currentWaste / 100);
      co2Reduction += wasteMonthly * 12;
      moneySavings += 240; // Avoided wasted food costs
    }

    // 5. Thrifting (cut clothing shopping in half)
    if (simChoices.thrift) {
      const clothingItems = shopping.clothingItemsPerMonth || 2;
      // 15kg CO2 per item. Cut in half
      co2Reduction += clothingItems * 15 * 0.5 * 12;
      moneySavings += clothingItems * 40 * 0.5 * 12; // Average clothes items cost $40
    }

    // 6. Shorter showers
    if (simChoices.shortShowers) {
      const currentShowerMins = water.showerMinutesPerDay || 8;
      const reductionMins = Math.max(0, currentShowerMins - 5);
      // shower is 0.042 kg CO2 per min
      co2Reduction += reductionMins * 365 * 0.042;
      moneySavings += reductionMins * 365 * 0.05; // Water + energy heating costs
    }

    // Rounding
    const treesEquivalent = Math.round(co2Reduction / 22); // 1 mature tree absorbs ~22kg CO2/year

    setSimResults({
      co2: Math.round(co2Reduction),
      money: Math.round(moneySavings),
      trees: treesEquivalent,
    });
  }, [simChoices, carbonData]);

  const toggleChoice = (key) => {
    setSimChoices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const score = carbonData?.score || 60;
  const breakdown = carbonData?.breakdown || { transportation: 0, energy: 0, food: 0, shopping: 0, water: 0 };
  const total = carbonData?.monthlyTotal || 0;

  return (
    <HolographicPanel position={[-2.5, 0.2, 0]} size="lg" visible={visible}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', minHeight: '480px' }}>
        {/* Left side: Calculator results / Dashboard status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="holo-label">Command Center // Analytics Console</div>
          <h2 className="holo-title">Planetary Dashboard</h2>
          
          <div className="holo-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'default' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              border: `4px solid ${score >= 60 ? 'var(--color-green)' : 'var(--color-orange)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Orbitron', monospace",
              fontWeight: 800,
              fontSize: '18px',
              color: score >= 60 ? 'var(--color-green)' : 'var(--color-orange)',
              boxShadow: score >= 60 ? 'var(--glow-green)' : 'var(--glow-orange)'
            }}>
              {score}
            </div>
            <div>
              <div className="holo-label">Security Clearance Rating</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
                Your carbon footprint score is currently <strong>{score}/100</strong>. Aim to reach 80+ to achieve Prime Guardian status.
              </div>
            </div>
          </div>

          <div>
            <div className="holo-label" style={{ marginBottom: '8px' }}>Emissions Breakdown (kg CO₂/mo)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(breakdown).map(([key, val]) => {
                const percent = total > 0 ? Math.round((val / total) * 100) : 0;
                const colors = {
                  transportation: 'var(--color-orange)',
                  energy: 'var(--color-cyan)',
                  food: 'var(--color-green)',
                  shopping: 'var(--color-purple)',
                  water: 'var(--color-magenta)',
                };
                return (
                  <div key={key} style={{ fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.8)' }}>
                        {key === 'energy' ? 'Home Energy' : key}
                      </span>
                      <span style={{ fontFamily: "'Orbitron', monospace" }}>{val} kg ({percent}%)</span>
                    </div>
                    <div className="holo-progress">
                      <div
                        className="holo-progress-fill"
                        style={{
                          width: `${percent}%`,
                          background: colors[key] || 'var(--color-cyan)',
                          boxShadow: `0 0 6px ${colors[key]}aa`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side: Carbon Impact Simulator */}
        <div style={{ borderLeft: '1px solid rgba(0, 240, 255, 0.15)', paddingLeft: '24px', display: 'flex', flexDirection: 'column' }}>
          <div className="holo-label">Simulation Module // Sandbox Mode</div>
          <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '14px', color: 'var(--color-cyan)', marginBottom: '16px', textTransform: 'uppercase', textShadow: 'var(--glow-cyan)' }}>
            Carbon Impact Simulator
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '14px', lineHeight: '1.5' }}>
            Simulate the environmental and monetary impact of adjusting your lifestyle habits. Check modifications to preview instant benefits.
          </p>

          {/* Simulator Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto', maxHeight: '210px', paddingRight: '4px' }}>
            <div
              className={`holo-card ${simChoices.solar ? 'holo-card--active' : ''}`}
              onClick={() => toggleChoice('solar')}
              style={{
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: simChoices.solar ? 'var(--color-green)' : 'var(--color-border)',
                background: simChoices.solar ? 'rgba(0, 255, 136, 0.04)' : 'rgba(0, 240, 255, 0.02)'
              }}
            >
              <span style={{ fontSize: '12px' }}>☀️ Install Residential Solar / Green Energy</span>
              <span style={{ color: simChoices.solar ? 'var(--color-green)' : 'rgba(255,255,255,0.2)' }}>{simChoices.solar ? '▲ ACTIVE' : '○ OFF'}</span>
            </div>

            <div
              className={`holo-card ${simChoices.vegan ? 'holo-card--active' : ''}`}
              onClick={() => toggleChoice('vegan')}
              style={{
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: simChoices.vegan ? 'var(--color-green)' : 'var(--color-border)',
                background: simChoices.vegan ? 'rgba(0, 255, 136, 0.04)' : 'rgba(0, 240, 255, 0.02)'
              }}
            >
              <span style={{ fontSize: '12px' }}>🥑 Adopt Fully Plant-Based Diet</span>
              <span style={{ color: simChoices.vegan ? 'var(--color-green)' : 'rgba(255,255,255,0.2)' }}>{simChoices.vegan ? '▲ ACTIVE' : '○ OFF'}</span>
            </div>

            <div
              className={`holo-card ${simChoices.ev ? 'holo-card--active' : ''}`}
              onClick={() => toggleChoice('ev')}
              style={{
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: simChoices.ev ? 'var(--color-green)' : 'var(--color-border)',
                background: simChoices.ev ? 'rgba(0, 255, 136, 0.04)' : 'rgba(0, 240, 255, 0.02)'
              }}
            >
              <span style={{ fontSize: '12px' }}>⚡ Commute via Electric Vehicle / Transit</span>
              <span style={{ color: simChoices.ev ? 'var(--color-green)' : 'rgba(255,255,255,0.2)' }}>{simChoices.ev ? '▲ ACTIVE' : '○ OFF'}</span>
            </div>

            <div
              className={`holo-card ${simChoices.zeroWaste ? 'holo-card--active' : ''}`}
              onClick={() => toggleChoice('zeroWaste')}
              style={{
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: simChoices.zeroWaste ? 'var(--color-green)' : 'var(--color-border)',
                background: simChoices.zeroWaste ? 'rgba(0, 255, 136, 0.04)' : 'rgba(0, 240, 255, 0.02)'
              }}
            >
              <span style={{ fontSize: '12px' }}>🗑️ Eliminate Household Food Waste</span>
              <span style={{ color: simChoices.zeroWaste ? 'var(--color-green)' : 'rgba(255,255,255,0.2)' }}>{simChoices.zeroWaste ? '▲ ACTIVE' : '○ OFF'}</span>
            </div>

            <div
              className={`holo-card ${simChoices.thrift ? 'holo-card--active' : ''}`}
              onClick={() => toggleChoice('thrift')}
              style={{
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: simChoices.thrift ? 'var(--color-green)' : 'var(--color-border)',
                background: simChoices.thrift ? 'rgba(0, 255, 136, 0.04)' : 'rgba(0, 240, 255, 0.02)'
              }}
            >
              <span style={{ fontSize: '12px' }}>👗 Buy Second-Hand Clothes (50% Thrift)</span>
              <span style={{ color: simChoices.thrift ? 'var(--color-green)' : 'rgba(255,255,255,0.2)' }}>{simChoices.thrift ? '▲ ACTIVE' : '○ OFF'}</span>
            </div>

            <div
              className={`holo-card ${simChoices.shortShowers ? 'holo-card--active' : ''}`}
              onClick={() => toggleChoice('shortShowers')}
              style={{
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderColor: simChoices.shortShowers ? 'var(--color-green)' : 'var(--color-border)',
                background: simChoices.shortShowers ? 'rgba(0, 255, 136, 0.04)' : 'rgba(0, 240, 255, 0.02)'
              }}
            >
              <span style={{ fontSize: '12px' }}>🚿 Limit Daily Shower time to 5 mins</span>
              <span style={{ color: simChoices.shortShowers ? 'var(--color-green)' : 'rgba(255,255,255,0.2)' }}>{simChoices.shortShowers ? '▲ ACTIVE' : '○ OFF'}</span>
            </div>
          </div>

          {/* Simulator Readout */}
          <div style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(0, 240, 255, 0.15)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px'
          }}>
            <div className="holo-card" style={{ padding: '8px 12px', cursor: 'default' }}>
              <div className="holo-label" style={{ fontSize: '8px' }}>Annual CO₂ Saved</div>
              <div className="holo-value holo-value--sm holo-value--green">{simResults.co2} kg</div>
            </div>

            <div className="holo-card" style={{ padding: '8px 12px', cursor: 'default' }}>
              <div className="holo-label" style={{ fontSize: '8px' }}>Annual Cash Savings</div>
              <div className="holo-value holo-value--sm holo-value--green">${simResults.money}</div>
            </div>

            <div className="holo-card" style={{ padding: '8px 12px', cursor: 'default', gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🌳</span>
              <div>
                <div className="holo-label" style={{ fontSize: '8px' }}>Environmental Equivalent</div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)' }}>
                  Same as planting <strong>{simResults.trees}</strong> mature trees per year!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HolographicPanel>
  );
}
