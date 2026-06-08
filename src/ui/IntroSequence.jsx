import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

/**
 * 5-second cinematic intro sequence
 * Camera rushes through space toward Earth, title materializes
 */
export default function IntroSequence({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const containerRef = useRef();

  useEffect(() => {
    // Check if already seen
    const seen = localStorage.getItem('ecotrack_intro_seen');
    if (seen) {
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        localStorage.setItem('ecotrack_intro_seen', 'true');
        // Fade out
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: onComplete,
        });
      },
    });

    // Phase 1: Stars fade in
    tl.to({}, { duration: 0.5, onStart: () => setPhase(1) });
    // Phase 2: Title appears
    tl.to({}, { duration: 0.5, onStart: () => setPhase(2) });
    // Phase 3: Subtitle
    tl.to({}, { duration: 0.5, onStart: () => setPhase(3) });
    // Phase 4: Hold
    tl.to({}, { duration: 2.0 });
    // Phase 5: Fade out
    tl.to({}, { duration: 0.3, onStart: () => setPhase(5) });

    return () => tl.kill();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#050a0f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        cursor: 'pointer',
      }}
      onClick={() => {
        localStorage.setItem('ecotrack_intro_seen', 'true');
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: onComplete,
        });
      }}
    >
      {/* Star particles */}
      {phase >= 1 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          animation: 'fadeIn 1s ease-out',
        }}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                background: '#00f0ff',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.1,
                animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Title */}
      {phase >= 2 && (
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 'clamp(28px, 5vw, 56px)',
          fontWeight: 900,
          color: '#00f0ff',
          letterSpacing: '0.2em',
          textShadow: '0 0 40px rgba(0, 240, 255, 0.4), 0 0 80px rgba(0, 240, 255, 0.2)',
          animation: 'introFadeIn 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          ECOTRACK AI
        </div>
      )}

      {/* Subtitle */}
      {phase >= 3 && (
        <div style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 'clamp(10px, 1.5vw, 14px)',
          fontWeight: 500,
          color: '#00ff88',
          letterSpacing: '0.4em',
          textShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
          animation: 'introFadeIn 1s cubic-bezier(0.22, 1, 0.36, 1)',
          position: 'relative',
          zIndex: 1,
        }}>
          WELCOME, GUARDIAN
        </div>
      )}

      {/* Scan line */}
      {phase >= 2 && (
        <div style={{
          position: 'absolute',
          left: '30%',
          right: '30%',
          top: '52%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #00f0ff, transparent)',
          opacity: 0.4,
          animation: 'introFadeIn 1.5s ease-out',
          zIndex: 1,
        }} />
      )}

      {/* Skip hint */}
      {phase >= 3 && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '12px',
          color: 'rgba(0, 240, 255, 0.3)',
          letterSpacing: '0.1em',
          animation: 'introFadeIn 1s ease-out',
          zIndex: 1,
        }}>
          CLICK TO ENTER
        </div>
      )}

      <style>{`
        @keyframes introFadeIn {
          from { opacity: 0; transform: translateY(15px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
