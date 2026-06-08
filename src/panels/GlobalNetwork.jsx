import HolographicPanel from '../ui/HolographicPanel';
import { generateCommunityData } from '../utils/sampleData';

export default function GlobalNetwork({ visible }) {
  const data = generateCommunityData();

  return (
    <HolographicPanel position={[2.5, 0.4, 0]} size="lg" visible={visible}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', minHeight: '480px' }}>
        {/* Left column: Community Stats & Milestones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="holo-label">Global Comm Net // Telemetry Node</div>
          <h2 className="holo-title">Global Network</h2>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="holo-card" style={{ padding: '10px', cursor: 'default' }}>
              <div className="holo-label" style={{ fontSize: '8px' }}>Global CO₂ Saved</div>
              <div className="holo-value holo-value--sm holo-value--green" style={{ fontSize: '15px' }}>
                {(data.totalCO2Reduced / 1000).toFixed(0)}k kg
              </div>
            </div>

            <div className="holo-card" style={{ padding: '10px', cursor: 'default' }}>
              <div className="holo-label" style={{ fontSize: '8px' }}>Regen Trees Planted</div>
              <div className="holo-value holo-value--sm holo-value--green" style={{ fontSize: '15px' }}>
                {data.totalTrees} 🌳
              </div>
            </div>

            <div className="holo-card" style={{ padding: '10px', cursor: 'default' }}>
              <div className="holo-label" style={{ fontSize: '8px' }}>Active Guardians</div>
              <div className="holo-value holo-value--sm" style={{ fontSize: '15px' }}>
                {data.totalUsers}
              </div>
            </div>

            <div className="holo-card" style={{ padding: '10px', cursor: 'default' }}>
              <div className="holo-label" style={{ fontSize: '8px' }}>Systems Linked</div>
              <div className="holo-value holo-value--sm" style={{ fontSize: '15px' }}>
                {data.totalCountries} regions
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <div className="holo-label" style={{ marginBottom: '8px' }}>Planetary Milestones</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '180px', paddingRight: '4px' }}>
              {data.milestones.map((m, idx) => (
                <div key={idx} style={{ fontSize: '11px', background: 'rgba(0, 240, 255, 0.02)', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: m.achieved ? 'var(--color-green)' : 'var(--color-muted)' }}>
                    <span>{m.label}</span>
                    <span>{m.achieved ? 'ACHIEVED' : 'IN PROGRESS'}</span>
                  </div>
                  {m.achieved && (
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                      Unlocked on: {m.date}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Leaderboard */}
        <div style={{ borderLeft: '1px solid rgba(0, 240, 255, 0.15)', paddingLeft: '24px', display: 'flex', flexDirection: 'column' }}>
          <div className="holo-label">Rankings // Global Standings</div>
          <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '14px', color: 'var(--color-cyan)', marginBottom: '16px', textTransform: 'uppercase', textShadow: 'var(--glow-cyan)' }}>
            Guardian Leaderboard
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto', maxHeight: '380px', paddingRight: '4px' }}>
            {data.leaderboard.map(u => {
              const isUser = u.name === 'You';
              return (
                <div
                  key={u.rank}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isUser ? 'linear-gradient(90deg, rgba(0,255,136,0.1), transparent)' : 'rgba(0, 240, 255, 0.02)',
                    border: `1px solid ${isUser ? 'var(--color-green)' : 'var(--color-border)'}`,
                  }}
                >
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '10px', fontWeight: 700, width: '16px', color: isUser ? 'var(--color-green)' : 'var(--color-muted)' }}>
                    #{u.rank}
                  </span>
                  <span style={{ fontSize: '16px' }}>{u.avatar}</span>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-muted)' }}>{u.badges} badges · -{u.reduction}% CO₂</div>
                  </div>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontSize: '11px', fontWeight: 700, color: 'var(--color-cyan)' }}>
                    {u.score} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </HolographicPanel>
  );
}
