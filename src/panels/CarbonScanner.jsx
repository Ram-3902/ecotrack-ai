import { useState, useEffect } from 'react';
import HolographicPanel from '../ui/HolographicPanel';
import { calculateTotal } from '../utils/carbonEngine';

const STEPS = [
  { id: 'transportation', label: 'Transportation', icon: '🚗' },
  { id: 'energy', label: 'Home Energy', icon: '⚡' },
  { id: 'food', label: 'Diet & Waste', icon: '🥦' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'water', label: 'Water Usage', icon: '💧' },
];

export default function CarbonScanner({ visible, carbonData, onUpdateCarbonData }) {
  const [activeStep, setActiveStep] = useState('transportation');
  const [formData, setFormData] = useState({
    transportation: {
      carType: 'gasoline',
      carKmPerWeek: 80,
      busKmPerWeek: 20,
      trainKmPerWeek: 10,
      flightsPerYear: 2,
      avgFlightDistanceKm: 1500,
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
      electronicsLargePerYear: 1,
      monthlySpending: 200,
    },
    water: {
      showerMinutesPerDay: 8,
      litersPerDay: 120,
    },
  });

  // Load existing data if available
  useEffect(() => {
    if (carbonData?.formData) {
      // Deep merge with default
      setFormData(prev => ({
        transportation: { ...prev.transportation, ...carbonData.formData.transportation },
        energy: { ...prev.energy, ...carbonData.formData.energy },
        food: { ...prev.food, ...carbonData.formData.food },
        shopping: { ...prev.shopping, ...carbonData.formData.shopping },
        water: { ...prev.water, ...carbonData.formData.water },
      }));
    }
  }, [carbonData]);

  const handleInputChange = (category, field, value) => {
    const updatedCategory = { ...formData[category], [field]: value };
    const updatedFormData = { ...formData, [category]: updatedCategory };
    setFormData(updatedFormData);

    // Live recalculation
    const results = calculateTotal(updatedFormData);
    onUpdateCarbonData({
      ...results,
      formData: updatedFormData,
    });
  };

  const currentStepData = STEPS.find(s => s.id === activeStep);

  return (
    <HolographicPanel position={[2.4, 0.2, 0]} size="lg" visible={visible}>
      <div style={{ minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
        <div className="holo-label">Scanner Module // Real-time Feed</div>
        <h2 className="holo-title">Biometric Footprint Scanner</h2>
        
        {/* Step Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
          paddingBottom: '8px',
          marginBottom: '20px',
          gap: '8px',
          overflowX: 'auto'
        }}>
          {STEPS.map(step => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeStep === step.id ? 'var(--color-cyan)' : 'var(--color-muted)',
                fontFamily: "'Orbitron', monospace",
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 10px',
                borderBottom: activeStep === step.id ? '2px solid var(--color-cyan)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <span>{step.icon}</span>
              <span>{step.label}</span>
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeStep === 'transportation' && (
            <>
              <div>
                <label className="holo-label">Primary Vehicle Type</label>
                <select
                  className="holo-select"
                  value={formData.transportation.carType}
                  onChange={(e) => handleInputChange('transportation', 'carType', e.target.value)}
                >
                  <option value="none">No Car (Walk/Bike/Transit)</option>
                  <option value="gasoline">Gasoline Car (Standard)</option>
                  <option value="diesel">Diesel Car (Efficient)</option>
                  <option value="hybrid">Hybrid Vehicle</option>
                  <option value="electric">Electric Vehicle (EV)</option>
                </select>
              </div>

              {formData.transportation.carType !== 'none' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label className="holo-label">Car Driving (km/week)</label>
                    <span className="holo-slider-val">{formData.transportation.carKmPerWeek} km</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="600"
                    step="10"
                    className="holo-slider"
                    value={formData.transportation.carKmPerWeek}
                    onChange={(e) => handleInputChange('transportation', 'carKmPerWeek', parseInt(e.target.value))}
                  />
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="holo-label">Public Bus Travel (km/week)</label>
                  <span className="holo-slider-val">{formData.transportation.busKmPerWeek} km</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="5"
                  className="holo-slider"
                  value={formData.transportation.busKmPerWeek}
                  onChange={(e) => handleInputChange('transportation', 'busKmPerWeek', parseInt(e.target.value))}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="holo-label">Train & Subway Travel (km/week)</label>
                  <span className="holo-slider-val">{formData.transportation.trainKmPerWeek} km</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  className="holo-slider"
                  value={formData.transportation.trainKmPerWeek}
                  onChange={(e) => handleInputChange('transportation', 'trainKmPerWeek', parseInt(e.target.value))}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="holo-label">Flights Taken Per Year</label>
                  <span className="holo-slider-val">{formData.transportation.flightsPerYear} flights</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  className="holo-slider"
                  value={formData.transportation.flightsPerYear}
                  onChange={(e) => handleInputChange('transportation', 'flightsPerYear', parseInt(e.target.value))}
                />
              </div>
            </>
          )}

          {activeStep === 'energy' && (
            <>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="holo-label">Electricity Consumption (kWh/month)</label>
                  <span className="holo-slider-val">{formData.energy.electricityKwhPerMonth} kWh</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1500"
                  step="25"
                  className="holo-slider"
                  value={formData.energy.electricityKwhPerMonth}
                  onChange={(e) => handleInputChange('energy', 'electricityKwhPerMonth', parseInt(e.target.value))}
                />
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Average US household uses ~900 kWh/month.</div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="holo-label">Renewable Energy Portion (%)</label>
                  <span className="holo-slider-val">{formData.energy.renewablePercent} %</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="holo-slider"
                  value={formData.energy.renewablePercent}
                  onChange={(e) => handleInputChange('energy', 'renewablePercent', parseInt(e.target.value))}
                />
              </div>

              <div>
                <label className="holo-label">Space Heating Energy Source</label>
                <select
                  className="holo-select"
                  value={formData.energy.heatingType}
                  onChange={(e) => handleInputChange('energy', 'heatingType', e.target.value)}
                >
                  <option value="electric">Electric (Heat Pump / Baseboard)</option>
                  <option value="natural_gas">Natural Gas Burner</option>
                  <option value="none">No active heating (Warm climate)</option>
                </select>
              </div>
            </>
          )}

          {activeStep === 'food' && (
            <>
              <div>
                <label className="holo-label">Primary Dietary Profile</label>
                <select
                  className="holo-select"
                  value={formData.food.dietType}
                  onChange={(e) => handleInputChange('food', 'dietType', e.target.value)}
                >
                  <option value="heavy_meat">Heavy Meat Eater (Frequent beef/pork)</option>
                  <option value="mixed">Mixed Diet (Balanced meat, dairy, vegetables)</option>
                  <option value="pescatarian">Pescatarian (Fish, dairy, veg - no meat)</option>
                  <option value="vegetarian">Vegetarian (Dairy, eggs, veg - no meat/fish)</option>
                  <option value="vegan">Vegan (100% plant-based diet)</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="holo-label">Estimated Food Waste (%)</label>
                  <span className="holo-slider-val">{formData.food.foodWastePercent} %</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="2"
                  className="holo-slider"
                  value={formData.food.foodWastePercent}
                  onChange={(e) => handleInputChange('food', 'foodWastePercent', parseInt(e.target.value))}
                />
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Average household discards ~15-20% of food purchased.</div>
              </div>
            </>
          )}

          {activeStep === 'shopping' && (
            <>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="holo-label">New Clothing Purchases (items/month)</label>
                  <span className="holo-slider-val">{formData.shopping.clothingItemsPerMonth} items</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  className="holo-slider"
                  value={formData.shopping.clothingItemsPerMonth}
                  onChange={(e) => handleInputChange('shopping', 'clothingItemsPerMonth', parseInt(e.target.value))}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="holo-label">General Spending (Goods/Services $/month)</label>
                  <span className="holo-slider-val">${formData.shopping.monthlySpending}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  className="holo-slider"
                  value={formData.shopping.monthlySpending}
                  onChange={(e) => handleInputChange('shopping', 'monthlySpending', parseInt(e.target.value))}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="holo-label">Small Electronics Bought (devices/year)</label>
                  <span className="holo-slider-val">{formData.shopping.electronicsSmallPerYear} units</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  className="holo-slider"
                  value={formData.shopping.electronicsSmallPerYear}
                  onChange={(e) => handleInputChange('shopping', 'electronicsSmallPerYear', parseInt(e.target.value))}
                />
              </div>
            </>
          )}

          {activeStep === 'water' && (
            <>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="holo-label">Average Daily Shower Duration</label>
                  <span className="holo-slider-val">{formData.water.showerMinutesPerDay} mins</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  className="holo-slider"
                  value={formData.water.showerMinutesPerDay}
                  onChange={(e) => handleInputChange('water', 'showerMinutesPerDay', parseInt(e.target.value))}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label className="holo-label">Direct Water Use (washing/drinking Liters/day)</label>
                  <span className="holo-slider-val">{formData.water.litersPerDay} L</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="400"
                  step="10"
                  className="holo-slider"
                  value={formData.water.litersPerDay}
                  onChange={(e) => handleInputChange('water', 'litersPerDay', parseInt(e.target.value))}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Metrics */}
        <div style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(0, 240, 255, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div className="holo-label">Live Calculation</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span className="holo-value holo-value--sm">{carbonData?.monthlyTotal || 0}</span>
              <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>kg CO₂ / month</span>
            </div>
          </div>
          <div>
            <div className="holo-label">Ecosystem Health</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="holo-value holo-value--sm" style={{ color: 'var(--color-green)' }}>{carbonData?.score || 100}%</span>
            </div>
          </div>
        </div>
      </div>
    </HolographicPanel>
  );
}
