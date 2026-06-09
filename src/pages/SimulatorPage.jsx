import { useState, useEffect } from 'react';

export default function SimulatorPage({ carbonData }) {
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

  useEffect(() => {
    if (!carbonData) return;

    const currentForm = carbonData.formData || {};
    const transport = currentForm.transportation || {};
    const energy = currentForm.energy || {};
    const food = currentForm.food || {};
    const shopping = currentForm.shopping || {};
    const water = currentForm.water || {};

    let co2Reduction = 0; // kg/yr
    let moneySavings = 0;  // $/yr

    // 1. Solar
    if (simChoices.solar) {
      const electricityMonthly = energy.electricityKwhPerMonth || 350;
      const currentRenewable = energy.renewablePercent || 15;
      const nonRenewableKwh = electricityMonthly * ((100 - currentRenewable) / 100);
      const savingsPerMonth = nonRenewableKwh * (0.42 - 0.05);
      co2Reduction += savingsPerMonth * 12;
      moneySavings += 80;
    }

    // 2. Vegan
    if (simChoices.vegan) {
      const currentDietType = food.dietType || 'mixed';
      const dietFactors = { heavy_meat: 7.2, mixed: 4.5, pescatarian: 3.0, vegetarian: 2.5, vegan: 1.5 };
      const currentFactor = dietFactors[currentDietType] || 4.5;
      const diffDaily = Math.max(0, currentFactor - 1.5);
      co2Reduction += diffDaily * 365;
      moneySavings += 650;
    }

    // 3. EV / Transit
    if (simChoices.ev) {
      const carType = transport.carType || 'gasoline';
      const carKm = transport.carKmPerWeek || 80;
      const carFactors = { gasoline: 0.21, diesel: 0.17, hybrid: 0.11, electric: 0.05, none: 0 };
      const currentFactor = carFactors[carType] || 0.21;
      const diffPerKm = Math.max(0, currentFactor - 0.05);
      co2Reduction += diffPerKm * carKm * 52;
      moneySavings += carKm * 52 * 0.15; // fuel
    }

    // 4. Zero waste
    if (simChoices.zeroWaste) {
      const dietType = food.dietType || 'mixed';
      const dietFactors = { heavy_meat: 7.2, mixed: 4.5, pescatarian: 3.0, vegetarian: 2.5, vegan: 1.5 };
      const baseDaily = dietFactors[dietType] || 4.5;
      const currentWaste = food.foodWastePercent || 15;
      const wasteMonthly = baseDaily * 30 * (currentWaste / 100);
      co2Reduction += wasteMonthly * 12;
      moneySavings += 240;
    }

    // 5. Thrifting
    if (simChoices.thrift) {
      const clothingItems = shopping.clothingItemsPerMonth || 2;
      co2Reduction += clothingItems * 15 * 0.5 * 12;
      moneySavings += clothingItems * 40 * 0.5 * 12;
    }

    // 6. Shorter showers
    if (simChoices.shortShowers) {
      const currentShowerMins = water.showerMinutesPerDay || 8;
      const reductionMins = Math.max(0, currentShowerMins - 5);
      co2Reduction += reductionMins * 365 * 0.042;
      moneySavings += reductionMins * 365 * 0.05;
    }

    setSimResults({
      co2: Math.round(co2Reduction),
      money: Math.round(moneySavings),
      trees: Math.round(co2Reduction / 22),
    });
  }, [simChoices, carbonData]);

  const handleToggle = (key) => {
    setSimChoices(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="container" style={{ padding: '40px 0 60px 0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Carbon Impact Simulator</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Simulate lifestyle adjustments and review carbon reductions and financial savings instantly.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '32px',
        alignItems: 'start',
      }}>
        {/* Left Column: Toggle Switches */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Lifestyle Adjustments</h3>

          {[
            { key: 'solar', emoji: '☀️', label: 'Transition to Green Energy / Solar', desc: 'Offsets 80-100% of grid electricity emissions by utilizing solar panels or a renewable provider tariff.' },
            { key: 'vegan', emoji: '🌱', label: 'Switch to Plant-Based Diet', desc: 'Cutting out meat and dairy reduces food production emissions by up to 60-70%.' },
            { key: 'ev', emoji: '⚡', label: 'Commute with Electric Vehicle / Transit', desc: 'Replaces standard internal combustion driving with EV charging or public rail/bus commutes.' },
            { key: 'zeroWaste', emoji: '🗑️', label: 'Eliminate Food Waste', desc: 'Avoids throwing out expired groceries, stopping methane release in landfills.' },
            { key: 'thrift', emoji: '👗', label: 'Buy Second-Hand Clothes', desc: 'Reduces clothing item purchases by 50% through thrifting and clothes exchanges.' },
            { key: 'shortShowers', emoji: '🚿', label: 'Limit Showers to 5 Minutes', desc: 'Saves water volume and minimizes natural gas/electric water heating energy.' },
          ].map(opt => (
            <div
              key={opt.key}
              role="checkbox"
              aria-checked={simChoices[opt.key]}
              tabIndex={0}
              onClick={() => handleToggle(opt.key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToggle(opt.key);
                }
              }}
              className="saas-card"
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                borderColor: simChoices[opt.key] ? 'var(--color-primary)' : 'var(--color-border)',
                background: simChoices[opt.key] ? 'rgba(16, 185, 129, 0.04)' : 'rgba(17, 24, 39, 0.7)',
                transition: 'all 0.25s',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span aria-hidden="true">{opt.emoji}</span>
                  <span>{opt.label}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>{opt.desc}</div>
              </div>
              <div style={{
                width: '42px',
                height: '24px',
                borderRadius: '100px',
                background: simChoices[opt.key] ? 'var(--color-primary)' : '#1f2937',
                position: 'relative',
                transition: 'background 0.2s',
              }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  position: 'absolute',
                  top: '3px',
                  left: simChoices[opt.key] ? '21px' : '3px',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Savings Readout Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Projected Annualized Savings</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Metric: CO2 */}
            <div className="saas-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '36px' }}>🌍</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CO₂ Emission Reductions</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>
                  {simResults.co2} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>kg / year</span>
                </div>
              </div>
            </div>

            {/* Metric: Money */}
            <div className="saas-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '36px' }}>💰</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Financial Savings</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary)', marginTop: '4px' }}>
                  ${simResults.money} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>/ year</span>
                </div>
              </div>
            </div>

            {/* Metric: Trees */}
            <div className="saas-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '36px' }}>🌳</div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ecosystem Equivalents</div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                  Matches the annual carbon absorption of <strong>{simResults.trees}</strong> mature forest trees!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
