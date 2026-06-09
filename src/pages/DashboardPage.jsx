import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { jsPDF } from 'jspdf';
import { getGoals, saveGoal, updateGoal } from '../utils/dataStore';
import { getTopInsights } from '../utils/insightsEngine';
import { generateSampleHistory } from '../utils/sampleData';
import { sanitizeTextInput, validateNumericInput, validateSelectInput } from '../utils/inputSecurity';
import ScoreGauge from '../components/ScoreGauge';
import { CarbonDataShape } from '../utils/propTypes';

/** @type {string[]} Allowed goal categories for whitelist validation. */
const ALLOWED_GOAL_CATEGORIES = ['transportation', 'energy', 'food', 'shopping'];

export default function DashboardPage({ carbonData }) {
  const [goals, setGoals] = useState(() => getGoals());
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('transportation');
  const [newGoalTarget, setNewGoalTarget] = useState(20);
  const [showAddGoal, setShowAddGoal] = useState(false);

  /**
   * Handles new goal form submission with input validation and sanitization.
   * @param {Event} e - Form submit event.
   */
  const handleAddGoal = (e) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeTextInput(newGoalTitle, 100);
    if (!sanitizedTitle) return;

    const newGoal = {
      title: sanitizedTitle,
      category: validateSelectInput(newGoalCategory, ALLOWED_GOAL_CATEGORIES, 'transportation'),
      targetReduction: validateNumericInput(newGoalTarget, 1, 100, 20),
      currentProgress: 0,
      unit: '%',
      deadline: new Date(Date.now() + 60 * 86400000).toISOString(),
    };

    const updated = saveGoal(newGoal);
    setGoals(updated);
    setNewGoalTitle('');
    setShowAddGoal(false);
  };

  const handleToggleGoal = (id, currentStatus) => {
    const updated = updateGoal(id, { completed: !currentStatus });
    setGoals(updated);
  };


  // Generate PDF report
  const downloadPDFReport = () => {
    const doc = new jsPDF();
    const score = carbonData?.score || 60;
    const monthlyTotal = carbonData?.monthlyTotal || 0;
    const yearlyTotal = carbonData?.yearlyTotal || 0;
    const yearlyTons = carbonData?.yearlyTons || 0;

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // emerald
    doc.text('EcoTrack AI — Footprint Assessment', 20, 24);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Compiled on: ${new Date().toLocaleDateString()} · Year 2045 Assessment Core`, 20, 32);

    doc.setDrawColor(229, 231, 235);
    doc.line(20, 36, 190, 36);

    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Carbon Footprint Summary', 20, 48);

    doc.setFontSize(11);
    doc.text(` Planetary Health Score: ${score}/100`, 24, 58);
    doc.text(` Monthly Footprint Output: ${monthlyTotal} kg CO₂`, 24, 66);
    doc.text(` Projected Annual Output: ${yearlyTotal} kg CO₂ (${yearlyTons} tons)`, 24, 74);

    doc.setFontSize(14);
    doc.text('Sector Emission Breakdowns', 20, 92);

    let yOffset = 102;
    if (carbonData?.breakdown) {
      Object.entries(carbonData.breakdown).forEach(([cat, val]) => {
        doc.setFontSize(11);
        doc.text(` · ${cat.toUpperCase()}: ${val} kg CO₂ / month`, 24, yOffset);
        yOffset += 8;
      });
    }

    doc.line(20, yOffset + 4, 190, yOffset + 4);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Thank you for logging your carbon data. Implement recommendations to heal our biosphere.', 20, yOffset + 16);

    doc.save('ecotrack_assessment.pdf');
  };

  const score = carbonData?.score || 60;
  const breakdown = carbonData?.breakdown || { transportation: 0, energy: 0, food: 0, shopping: 0, water: 0 };
  const total = carbonData?.monthlyTotal || 0;
  const yearlyTons = carbonData?.yearlyTons || 0;

  // Recommendations
  const recommendations = getTopInsights(breakdown, 3);

  // Recharts formatted breakdown
  const barChartData = Object.entries(breakdown).map(([name, value]) => ({
    name: name === 'energy' ? 'Energy' : name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const chartColors = {
    Transportation: 'var(--color-secondary)',
    Energy: 'var(--color-primary)',
    Food: '#fbbf24',
    Shopping: '#a855f7',
    Water: '#ff00aa'
  };

  // Recharts mock history
  const historyData = generateSampleHistory();

  return (
    <div className="container" style={{ padding: '40px 0 60px 0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Top Banner Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Carbon Footprint Console</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>Real-time telemetry and resource usage breakdown.</p>
        </div>
        <button className="saas-btn saas-btn--primary saas-btn--sm" onClick={downloadPDFReport}>
          📥 Export Assessment PDF
        </button>
      </div>

      {/* Grid: Score gauge and numeric cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr repeat(3, 1fr)',
        gap: '24px',
      }}>
        {/* Score gauge card */}
        <div className="saas-card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <ScoreGauge score={score} size={110} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Planetary Health Score</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '6px 0' }}>
              {score >= 80 ? 'Excellent Rating' : score >= 60 ? 'Optimal Rating' : score >= 40 ? 'Moderate Haze' : 'Critical Stress'}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Your actions place you {score >= 60 ? 'above' : 'below'} the global sustainability average.
            </p>
          </div>
        </div>

        {/* Card: Monthly Output */}
        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monthly Footprint</div>
          <div style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0', color: 'var(--text-primary)' }}>{total} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>kg CO₂</span></div>
          <div style={{ fontSize: '11px', color: 'var(--color-primary)' }}>▼ 3.4% vs last month</div>
        </div>

        {/* Card: Annual Projection */}
        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Annualized Projection</div>
          <div style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0', color: 'var(--text-primary)' }}>{yearlyTons} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>tons</span></div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Equivalent to {Math.round(total * 12 / 22)} trees</div>
        </div>

        {/* Card: Commits / Goals */}
        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Goals</div>
          <div style={{ fontSize: '28px', fontWeight: 800, margin: '8px 0', color: 'var(--text-primary)' }}>
            {goals.filter(g => g.completed).length} <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>/ {goals.length} cleared</span>
          </div>
          <div className="saas-progress" style={{ height: '4px' }}>
            <div className="saas-progress-fill" style={{ width: `${goals.length > 0 ? (goals.filter(g => g.completed).length / goals.length) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Grid: Charts Block */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '24px',
      }}>
        {/* Trend Area Chart */}
        <div role="region" aria-label="Historical Carbon Footprint Trend Chart" className="saas-card" style={{ display: 'flex', flexDirection: 'column', height: '320px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Historical Footprint Trend</div>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#111827', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-md)' }} />
                <Area type="monotone" dataKey="monthlyTotal" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorCo2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div role="region" aria-label="Emissions Category Breakdown Chart" className="saas-card" style={{ display: 'flex', flexDirection: 'column', height: '320px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Emissions by Category</div>
          <div style={{ flex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#111827', borderColor: 'var(--color-border)', borderRadius: 'var(--radius-md)' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[entry.name] || 'var(--color-primary)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Goals checklist and insights list */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '24px',
      }}>
        {/* Goals System */}
        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Commitment Targets</h3>
            <button className="saas-btn saas-btn--sm" onClick={() => setShowAddGoal(!showAddGoal)}>
              {showAddGoal ? 'Cancel' : '+ Add Target'}
            </button>
          </div>

          {showAddGoal && (
            <form onSubmit={handleAddGoal} className="saas-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.02)' }}>
              <div>
                <label htmlFor="dashboard-goal-title" style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', cursor: 'pointer' }}>Target Title</label>
                <input
                  id="dashboard-goal-title"
                  type="text"
                  placeholder="e.g. Turn off standby power"
                  className="saas-input"
                  maxLength={100}
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label htmlFor="dashboard-goal-category" style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', cursor: 'pointer' }}>Category</label>
                  <select
                    id="dashboard-goal-category"
                    className="saas-select"
                    value={newGoalCategory}
                    onChange={(e) => setNewGoalCategory(e.target.value)}
                  >
                    <option value="transportation">🚗 Commutes</option>
                    <option value="energy">⚡ Home Energy</option>
                    <option value="food">🥦 Diet & Waste</option>
                    <option value="shopping">🛍️ Shopping</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dashboard-goal-target" style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', cursor: 'pointer' }}>Reduction Target (%)</label>
                  <input
                    id="dashboard-goal-target"
                    type="number"
                    min="1"
                    max="100"
                    className="saas-input"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(validateNumericInput(e.target.value, 1, 100, 20))}
                  />
                </div>
              </div>
              <button type="submit" className="saas-btn saas-btn--primary saas-btn--sm" style={{ alignSelf: 'flex-end' }}>
                Save Target
              </button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '250px' }}>
            {goals.map(g => (
              <div
                key={g.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: g.completed ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${g.completed ? 'transparent' : 'var(--color-border)'}`,
                  opacity: g.completed ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                <input
                  type="checkbox"
                  aria-label={`Mark target "${g.title}" as ${g.completed ? 'uncompleted' : 'completed'}`}
                  checked={g.completed || false}
                  onChange={() => handleToggleGoal(g.id, g.completed)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: 'var(--color-primary)',
                    cursor: 'pointer',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ textDecoration: g.completed ? 'line-through' : 'none', fontSize: '13px', fontWeight: 500 }}>
                    {g.title}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'capitalize' }}>
                    {g.category} · Target: -{g.targetReduction}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Recommendations */}
        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Priority Carbon Recommendations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendations.map(rec => (
              <div
                key={rec.id}
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: '24px' }} aria-hidden="true">{rec.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{rec.title}</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                    {rec.description}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '11px', color: 'var(--color-primary)', fontWeight: 500 }}>
                    <span>▼ {rec.impactKg} kg CO₂/yr</span>
                    <span style={{ color: 'var(--text-secondary)' }}>Saves ${rec.costSavings}/yr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

DashboardPage.propTypes = {
  carbonData: CarbonDataShape,
};

