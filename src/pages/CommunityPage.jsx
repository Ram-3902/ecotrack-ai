import { generateCommunityData } from '../utils/sampleData';

export default function CommunityPage() {
  const data = generateCommunityData();

  return (
    <div className="container" style={{ padding: '40px 0 60px 0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Global Community Sync</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Real-time metrics from the global EcoTrack AI network.
        </p>
      </div>

      {/* Grid: Global Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
      }}>
        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CO₂ Mitigated</div>
          <div style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0', color: 'var(--color-primary)' }}>
            {(data.totalCO2Reduced / 1000).toFixed(0)}k kg
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Collective savings</div>
        </div>

        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Forest equivalent</div>
          <div style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0', color: 'var(--color-primary)' }}>
            {data.totalTrees} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>trees</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Reforested absorption</div>
        </div>

        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Guardians</div>
          <div style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0', color: 'var(--text-primary)' }}>
            {data.totalUsers}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Synced devices</div>
        </div>

        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Global Regions</div>
          <div style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0', color: 'var(--text-primary)' }}>
            {data.totalCountries}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Operational coordinates</div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '32px',
        alignItems: 'start',
      }}>
        {/* Left Column: Leaderboard Table */}
        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, padding: '0 24px' }}>Global Leaderboard</h3>
          
          <table className="saas-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Rank</th>
                <th>User</th>
                <th>Mitigation</th>
                <th style={{ textAlign: 'right' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {data.leaderboard.map(u => {
                const isUser = u.name === 'You';
                return (
                  <tr key={u.rank} style={{ background: isUser ? 'rgba(16,185,129,0.04)' : 'transparent' }}>
                    <td style={{ fontWeight: 700, color: isUser ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                      #{u.rank}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>{u.avatar}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '13px', color: isUser ? 'var(--color-primary)' : 'var(--text-primary)' }}>{u.name}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{u.badges} badges</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-primary)' }}>-{u.reduction}% CO₂</div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {u.score} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Column: Timeline Milestones */}
        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Planetary Milestones</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.milestones.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: m.achieved ? 'rgba(16, 185, 129, 0.03)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${m.achieved ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-border)'}`,
                  opacity: m.achieved ? 1 : 0.6,
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: m.achieved ? 'var(--color-primary)' : '#1f2937',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                }}>
                  {m.achieved ? '✓' : '○'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{m.label}</div>
                  {m.achieved && (
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Cleared on: {m.date}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
