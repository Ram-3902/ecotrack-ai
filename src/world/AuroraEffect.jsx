import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Animated aurora borealis ribbons at the poles
 * Intensity scales with Earth health
 */
export default function AuroraEffect({ health = 60 }) {
  const groupRef = useRef();

  const ribbons = useMemo(() => {
    const items = [];
    const ribbonCount = 5;

    for (let r = 0; r < ribbonCount; r++) {
      const points = [];
      const segments = 40;
      const baseAngle = (r / ribbonCount) * Math.PI * 2;
      const radius = 2.2 + r * 0.08;
      const height = 2.0 + r * 0.1;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = baseAngle + t * Math.PI * 0.8;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const y = height + Math.sin(t * Math.PI) * 0.4;
        points.push(new THREE.Vector3(x, y, z));
      }

      items.push({
        curve: new THREE.CatmullRomCurve3(points),
        offset: r * 0.5,
        hue: 0.45 + r * 0.05, // green → cyan range
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.02;
      // Animate visibility
      groupRef.current.children.forEach((child, i) => {
        if (child.material) {
          const wave = Math.sin(t * 0.8 + i * 0.5) * 0.5 + 0.5;
          child.material.opacity = (health / 100) * 0.25 * wave;
        }
      });
    }
  });

  const healthNorm = health / 100;

  return (
    <group ref={groupRef}>
      {ribbons.map((ribbon, i) => (
        <mesh key={i}>
          <tubeGeometry args={[ribbon.curve, 40, 0.03, 6, false]} />
          <meshBasicMaterial
            color={new THREE.Color().setHSL(ribbon.hue, 1, 0.6)}
            transparent
            opacity={healthNorm * 0.2}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* South pole aurora (mirror) */}
      <group rotation={[Math.PI, 0, 0]}>
        {ribbons.slice(0, 3).map((ribbon, i) => (
          <mesh key={`s${i}`}>
            <tubeGeometry args={[ribbon.curve, 40, 0.025, 6, false]} />
            <meshBasicMaterial
              color={new THREE.Color().setHSL(0.55 + i * 0.03, 1, 0.5)}
              transparent
              opacity={healthNorm * 0.15}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
