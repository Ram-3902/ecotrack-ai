import { useState } from 'react';
import { CHALLENGES, getEarnedBadges } from '../utils/challengeData';

export default function ChallengesPage({ challengeProgress, onUpdateChallenges }) {
  const [activeTab, setActiveTab] = useState('daily');

  const handleComplete = (id, points) => {
    if (challengeProgress.completed.includes(id)) return;

    const newCompleted = [...challengeProgress.completed, id];
    const newPoints = challengeProgress.totalPoints + points;

    // Simple streak logic
    let newStreak = challengeProgress.currentStreak;
    const today = new Date().toDateString();
    if (challengeProgress.lastCompletedDate !== today) {
      newStreak += 1;
    }

    onUpdateChallenges({
      ...challengeProgress,
      completed: newCompleted,
      totalPoints: newPoints,
      currentStreak: newStreak,
      lastCompletedDate: today,
    });
  };

  const activeChallenges = CHALLENGES[activeTab] || [];
  
  const badges = getEarnedBadges({
    completedCount: challengeProgress?.completed?.length || 0,
    currentStreak: challengeProgress?.currentStreak || 0,
    totalPoints: challengeProgress?.totalPoints || 0,
    reductionPercent: 12,
    categoriesCompleted: ['food', 'water', 'energy']
  });

  return (
    <div className="container" style={{ padding: '40px 0 60px 0', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 800 }}>Guardian Missions Board</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Complete daily and weekly actions to earn XP points and unlock achievement badges.
          </p>
        </div>
        
        {/* Streak and points readout */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="saas-card" style={{ padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Credits Earned</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary)' }}>{challengeProgress?.totalPoints || 0} XP</div>
          </div>
          <div className="saas-card" style={{ padding: '10px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Streak</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-secondary)' }}>{challengeProgress?.currentStreak || 0} 🔥</div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '32px',
        alignItems: 'start',
      }}>
        {/* Left Column: Challenges List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            {['daily', 'weekly', 'monthly'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === tab ? 'var(--color-primary)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '8px 16px',
                  borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : 'none',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '420px', paddingRight: '4px' }}>
            {activeChallenges.map(c => {
              const isCompleted = challengeProgress?.completed?.includes(c.id);
              return (
                <div
                  key={c.id}
                  className="saas-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderColor: isCompleted ? 'rgba(16,185,129,0.2)' : 'var(--color-border)',
                    opacity: isCompleted ? 0.6 : 1,
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{c.description}</div>
                  </div>
                  <button
                    onClick={() => handleComplete(c.id, c.points)}
                    disabled={isCompleted}
                    className={`saas-btn saas-btn--sm ${isCompleted ? '' : 'saas-btn--primary'}`}
                  >
                    {isCompleted ? '✓ Completed' : `+${c.points} XP`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Badges Deck */}
        <div className="saas-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Unlocked Achievements</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            maxHeight: '430px',
            overflowY: 'auto',
            paddingRight: '4px',
          }}>
            {badges.map(b => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 8px',
                  borderRadius: 'var(--radius-md)',
                  background: b.earned ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255,255,255,0.01)',
                  border: `1px solid ${b.earned ? b.tierColor : 'var(--color-border)'}`,
                  opacity: b.earned ? 1 : 0.3,
                  textAlign: 'center',
                }}
                title={`${b.name}: ${b.description}`}
              >
                <span style={{ fontSize: '28px' }}>{b.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, marginTop: '8px', color: 'var(--text-primary)', display: 'block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {b.name}
                </span>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: b.tierColor, fontWeight: 700, marginTop: '2px' }}>
                  {b.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
