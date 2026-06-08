import { useState } from 'react';

export default function MiniSimulator() {
  const [kmDriven, setKmDriven] = useState(120);
  const [diet, setDiet] = useState('mixed');

  // Fast estimates based on carbonEngine.js constants
  // car gasoline = 0.21 kg / km
  // mixed diet = 4.5 kg / day, vegan = 1.5 kg / day
  const calculateEstimate = () => {
    const carEmissions = kmDriven * 4.33 * 0.21 * 12; // kg/year
    const dietFactors = { heavy_meat: 7.2, mixed: 4.5, vegetarian: 2.5, vegan: 1.5 };
    const dietFactor = dietFactors[diet] || 4.5;
    const dietEmissions = dietFactor * 365; // kg/year
    
    // total baseline water + electricity average ~1800 kg/year
    const totalCO2 = carEmissions + dietEmissions + 1800;
    const trees = Math.round(totalCO2 / 22);

    return {
      co2Tons: (totalCO2 / 1000).toFixed(1),
      trees,
    };
  };

  const { co2Tons, trees } = calculateEstimate();

  return (
    <div className="saas-card" style={{
      width: '100%',
      maxWidth: '420px',
      margin: '0 auto',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      background: 'rgba(17, 24, 39, 0.8)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '18px' }}>⚡</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interactive Preview</span>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Estimate Your Footprint</h3>

      {/* Slider */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Weekly driving distance:</span>
          <span style={{ fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>{kmDriven} km</span>
        </div>
        <input
          type="range"
          min="0"
          max="400"
          step="10"
          className="saas-slider"
          value={kmDriven}
          onChange={(e) => setKmDriven(parseInt(e.target.value))}
        />
      </div>

      {/* Select */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Primary Diet Type:</label>
        <select
          className="saas-select"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
        >
          <option value="heavy_meat">🥩 Heavy Meat Eater</option>
          <option value="mixed">🥗 Mixed Diet</option>
          <option value="vegetarian">🥦 Vegetarian</option>
          <option value="vegan">🌱 Vegan / Plant-Based</option>
        </select>
      </div>

      {/* Result metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        paddingTop: '16px',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Annual Footprint</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{co2Tons} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>t CO₂</span></div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Offset Requirement</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary)' }}>{trees} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>trees</span></div>
        </div>
      </div>
    </div>
  );
}
