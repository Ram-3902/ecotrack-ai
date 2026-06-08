import { useState } from 'react';
import HolographicPanel from '../ui/HolographicPanel';
import { CHALLENGES, getEarnedBadges } from '../utils/challengeData';

export default function GuardianMissions({ visible, challengeProgress, onUpdateChallenges }) {
  const [activeTab, setActiveTab] = useState('daily');

  const handleCompleteChallenge = (id, points) => {
    if (challengeProgress.completed.includes(id)) return;
    
    const updatedCompleted = [...challengeProgress.completed, id];
    const newPoints = challengeProgress.totalPoints + points;

    // Update streak (simulate simple daily update)
    let newStreak = challengeProgress.currentStreak;
    const lastCompleted = challengeProgress.lastCompletedDate;
    const today = new Date().toDateString();
    if (lastCompleted !== today) {
      newStreak += 1;
    }

    onUpdateChallenges({
      ...challengeProgress,
      completed: updatedCompleted,
      totalPoints: newPoints,
      currentStreak: newStreak,
      lastCompletedDate: today,
    });
  };

  const activeChallenges = CHALLENGES[activeTab] || [];
  const badges = getEarnedBadges({
    completedCount: challengeProgress.completed.length,
    currentStreak: challengeProgress.currentStreak,
    totalPoints: challengeProgress.totalPoints,
    reductionPercent: 12, // default mock reduction
    categoriesCompleted: ['food', 'water', 'energy']
  });

  return (
    <HolographicPanel position={[-2.4, -0.4, 0]} size="lg" visible={visible}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', minHeight: '480px' }}>
        {/* Left side: Missions list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="holo-label">Missions System // Operations Board</div>
          <h2 className="holo-title">Guardian Missions</h2>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(0, 240, 255, 0.15)', paddingBottom: '8px' }}>
            {['daily', 'weekly', 'monthly'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === tab ? 'var(--color-cyan)' : 'var(--color-muted)',
                  fontFamily: "'Orbitron', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderBottom: activeTab === tab ? '2px solid var(--color-cyan)' : 'none',
                  textTransform: 'uppercase'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Challenge List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto', maxHeight: '310px', paddingRight: '4px' }}>
            {activeChallenges.map(c => {
              const isCompleted = challengeProgress.completed.includes(c.id);
              return (
                <div
                  key={c.id}
                  className={`holo-card ${isCompleted ? 'holo-card--done' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderColor: isCompleted ? 'rgba(0, 255, 136, 0.2)' : 'var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>{c.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px' }}>{c.description}</div>
                  </div>
                  <button
                    className={`holo-btn holo-btn--sm ${isCompleted ? '' : 'holo-btn--primary'}`}
                    disabled={isCompleted}
                    onClick={() => handleCompleteChallenge(c.id, c.points)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {isCompleted ? '✓ DONE' : `+${c.points} XP`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right side: Achievements & Badges */}
        <div style={{ borderLeft: '1px solid rgba(0, 240, 255, 0.15)', paddingLeft: '24px', display: 'flex', flexDirection: 'column' }}>
          <div className="holo-label">Achievements // Badge telemetry</div>
          <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: '14px', color: 'var(--color-cyan)', marginBottom: '16px', textTransform: 'uppercase', textShadow: 'var(--glow-cyan)' }}>
            Unlocked Badges
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            flex: 1,
            overflowY: 'auto',
            maxHeight: '380px',
            paddingRight: '4px'
          }}>
            {badges.map(b => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px 4px',
                  borderRadius: 'var(--radius-md)',
                  background: b.earned ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${b.earned ? b.tierColor + 'aa' : 'rgba(255,255,255,0.04)'}`,
                  opacity: b.earned ? 1 : 0.25,
                  textAlign: 'center',
                  position: 'relative'
                }}
                title={`${b.name}: ${b.description} (${b.tier.toUpperCase()})`}
              >
                <span style={{ fontSize: '24px', filter: b.earned ? `drop-shadow(0 0 6px ${b.tierColor})` : 'none' }}>
                  {b.icon}
                </span>
                <span style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: '8px',
                  fontWeight: 700,
                  marginTop: '6px',
                  color: b.earned ? 'var(--color-white)' : 'var(--color-muted)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%'
                }}>
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HolographicPanel>
  );
}
