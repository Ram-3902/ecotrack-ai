import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';

/**
 * Floating holographic navigation orbs orbiting the Earth
 */
const NAV_ITEMS = [
  { id: 'orbital', label: 'OVERVIEW', icon: '🌍', angle: 0 },
  { id: 'scanner', label: 'SCANNER', icon: '📡', angle: Math.PI / 3 },
  { id: 'command', label: 'COMMAND', icon: '🔮', angle: (2 * Math.PI) / 3 },
  { id: 'missions', label: 'MISSIONS', icon: '⚔️', angle: Math.PI },
  { id: 'guide', label: 'AI GUIDE', icon: '🤖', angle: (4 * Math.PI) / 3 },
  { id: 'network', label: 'NETWORK', icon: '🌐', angle: (5 * Math.PI) / 3 },
];

function NavOrb({ item, isActive, onClick }) {
  const groupRef = useRef();

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.3} floatingRange={[-0.05, 0.05]}>
      <group
        ref={groupRef}
        position={[
          Math.cos(item.angle) * 3.8,
          Math.sin(item.angle * 0.5) * 0.3,
          Math.sin(item.angle) * 3.8,
        ]}
      >
        {/* Orb glow */}
        <mesh onClick={(e) => { e.stopPropagation(); onClick(item.id); }}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial
            color={isActive ? '#00ff88' : '#00f0ff'}
            transparent
            opacity={isActive ? 0.9 : 0.5}
          />
        </mesh>

        {/* Outer ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.21, 32]} />
          <meshBasicMaterial
            color={isActive ? '#00ff88' : '#00f0ff'}
            transparent
            opacity={isActive ? 0.6 : 0.2}
            side={2}
          />
        </mesh>

        {/* Label */}
        <Html
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'auto',
            userSelect: 'none',
            cursor: 'pointer',
          }}
          onClick={() => onClick(item.id)}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              transform: 'translateY(-36px)',
              whiteSpace: 'nowrap',
            }}
            onClick={() => onClick(item.id)}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: '8px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: isActive ? '#00ff88' : '#00f0ff',
              opacity: isActive ? 1 : 0.6,
              textShadow: isActive
                ? '0 0 10px rgba(0, 255, 136, 0.5)'
                : '0 0 10px rgba(0, 240, 255, 0.3)',
            }}>
              {item.label}
            </span>
          </div>
        </Html>
      </group>
    </Float>
  );
}

export default function HolographicNav({ activePanel, onNavigate }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      {NAV_ITEMS.map(item => (
        <NavOrb
          key={item.id}
          item={item}
          isActive={activePanel === item.id}
          onClick={onNavigate}
        />
      ))}
    </group>
  );
}
