import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { initializeSampleData, generateSampleCarbonData } from './utils/sampleData';
import { getCarbonData, saveCarbonData, getChallengeProgress, saveChallengeProgress } from './utils/dataStore';
import Experience from './Experience';
import IntroSequence from './ui/IntroSequence';

// Initialize sample data on first launch
initializeSampleData();

export default function App() {
  const [activePanel, setActivePanel] = useState('orbital');
  const [introComplete, setIntroComplete] = useState(false);
  const [carbonData, setCarbonData] = useState(null);
  const [challengeProgress, setChallengeProgress] = useState(null);

  useEffect(() => {
    // Check if intro has been seen
    const seen = localStorage.getItem('ecotrack_intro_seen');
    if (seen) {
      setIntroComplete(true);
    }

    // Load initial states
    setCarbonData(getCarbonData() || generateSampleCarbonData());
    setChallengeProgress(getChallengeProgress());
  }, []);

  const handleUpdateCarbonData = (newData) => {
    setCarbonData(newData);
    saveCarbonData(newData);
  };

  const handleUpdateChallenges = (newProgress) => {
    setChallengeProgress(newProgress);
    saveChallengeProgress(newProgress);
  };

  const handleNavigate = (panelId) => {
    setActivePanel(panelId);
  };

  const earthHealth = carbonData?.score || 60;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', background: '#050a0f', overflow: 'hidden' }}>
      
      {/* Cinematic Intro Overlay */}
      {!introComplete && (
        <IntroSequence onComplete={() => setIntroComplete(true)} />
      )}

      {/* 3D Viewport Canvas */}
      <div className="canvas-wrapper">
        <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
          <Experience
            activePanel={activePanel}
            onNavigate={handleNavigate}
            earthHealth={earthHealth}
            introComplete={introComplete}
            carbonData={carbonData}
            onUpdateCarbonData={handleUpdateCarbonData}
            challengeProgress={challengeProgress}
            onUpdateChallenges={handleUpdateChallenges}
          />
        </Canvas>
      </div>

      {/* 2D Holographic HUD Overlays */}
      {introComplete && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
          
          {/* Top Title HUD */}
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '32px',
            fontFamily: "'Orbitron', monospace",
            display: 'flex',
            alignItems: 'baseline',
            gap: '12px'
          }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 900,
              letterSpacing: '0.15em',
              color: 'var(--color-cyan)',
              textShadow: 'var(--glow-cyan)'
            }}>
              ECOTRACK AI
            </h1>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-green)', letterSpacing: '0.1em' }}>
              // SECURE PLANETARY LINK
            </span>
          </div>

          {/* Top Right Control HUD */}
          <div style={{
            position: 'absolute',
            top: '24px',
            right: '32px',
            display: 'flex',
            gap: '12px',
            pointerEvents: 'auto'
          }}>
            {activePanel !== 'orbital' && (
              <button className="holo-btn holo-btn--sm" onClick={() => handleNavigate('orbital')}>
                🏠 COMMAND DECK
              </button>
            )}
            <button className="holo-btn holo-btn--sm holo-btn--danger" onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}>
              🔄 RESET TELEMETRY
            </button>
          </div>

          {/* Bottom Diagnostics Ticker */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '32px',
            right: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: "'Orbitron', monospace",
            fontSize: '9px',
            color: 'rgba(0, 240, 255, 0.4)',
            letterSpacing: '0.1em'
          }}>
            <span>SYSTEM: ONLINE // LATENCY: 14MS // SECTOR: BIOSPHERE-E9</span>
            <span>PROTECT THE EARTH. LIVE SUSTAINABLY.</span>
          </div>
        </div>
      )}
    </div>
  );
}
