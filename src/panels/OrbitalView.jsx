import HolographicPanel from '../ui/HolographicPanel';

export default function OrbitalView({ visible, carbonData, challengeProgress, onNavigate }) {
  const score = carbonData?.score || 60;
  const yearlyTons = carbonData?.yearlyTons || 3.6;
  const points = challengeProgress?.totalPoints || 0;
  const streak = challengeProgress?.currentStreak || 0;

  // Describe environmental state based on carbon score
  const getEnvironmentalState = (s) => {
    if (s >= 80) return { status: 'OPTIMAL REGISTRATION', desc: 'The biosphere is thriving. Bioluminescent pathways are fully active. Keep up the green habits!', color: 'var(--color-green)' };
    if (s >= 60) return { status: 'MODERATE IMPACT', desc: 'Carbon emissions are stable but ambient atmospheric warming persists. Minor carbon hotspots active.', color: 'var(--color-cyan)' };
    if (s >= 40) return { status: 'ELEVATED EMISSIONS', desc: 'Methane and CO₂ haze accumulating. Star system visibility reduced. Action recommended.', color: '#fbbf24' };
    return { status: 'CRITICAL DISRUPTIONS', desc: 'Severe carbon smoke detected orbiting the poles. Ecological systems showing heat stress. Immediate intervention required!', color: 'var(--color-orange)' };
  };

  const env = getEnvironmentalState(score);

  return (
    <HolographicPanel position={[-2.4, 0.4, 0]} size="md" visible={visible}>
      <div>
        <div className="holo-label">Orbital System Online // Year 2045</div>
        <h2 className="holo-title">Guardian Headquarters</h2>
        <p className="holo-subtitle">
          Welcome back, Guardian. You are plugged into the planetary command network. Check your eco diagnostics below.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="holo-card" style={{ cursor: 'default' }}>
            <div className="holo-label">Biosphere Health</div>
            <div className="holo-value" style={{ color: env.color }}>{score}%</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Global Rating Score</div>
          </div>

          <div className="holo-card" style={{ cursor: 'default' }}>
            <div className="holo-label">Carbon Output</div>
            <div className="holo-value holo-value--orange">{yearlyTons}t</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>CO₂ / Year</div>
          </div>

          <div className="holo-card" style={{ cursor: 'default' }}>
            <div className="holo-label">Missions Score</div>
            <div className="holo-value holo-value--green">{points}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Econ Credits Earned</div>
          </div>

          <div className="holo-card" style={{ cursor: 'default' }}>
            <div className="holo-label">Daily Streak</div>
            <div className="holo-value" style={{ color: 'var(--color-purple)' }}>{streak}🔥</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Days Active</div>
          </div>
        </div>

        <div className="holo-card" style={{ marginBottom: '24px', cursor: 'default', borderColor: env.color + '44' }}>
          <div className="holo-label" style={{ color: env.color }}>Ecosystem Status: {env.status}</div>
          <p style={{ fontSize: '12px', lineHeight: '1.5', color: 'rgba(224, 240, 255, 0.8)' }}>
            {env.desc}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="holo-btn holo-btn--primary" onClick={() => onNavigate('scanner')}>
            📡 Recalibrate Scanner
          </button>
          <button className="holo-btn" onClick={() => onNavigate('guide')}>
            🤖 AI Sustain Coach
          </button>
        </div>
      </div>
    </HolographicPanel>
  );
}
