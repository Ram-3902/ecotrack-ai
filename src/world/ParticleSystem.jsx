import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * GPU particle system for emissions (smoke) and regeneration (bioluminescent)
 * Particle count and type dynamically scales with Earth health
 */
export default function ParticleSystem({ health = 60, count = 600 }) {
  const emissionRef = useRef();
  const regenRef = useRef();

  // Emission particles (smoke - more at low health)
  const emissionData = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const opacities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute in a shell around Earth
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.3 + Math.random() * 1.5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      velocities[i * 3] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 1] = Math.random() * 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;

      sizes[i] = Math.random() * 0.08 + 0.02;
      opacities[i] = Math.random();
    }

    return { positions, velocities, sizes, opacities };
  }, [count]);

  // Regeneration particles (green fireflies - more at high health)
  const regenData = useMemo(() => {
    const regenCount = Math.floor(count * 0.6);
    const positions = new Float32Array(regenCount * 3);
    const speeds = new Float32Array(regenCount);
    const offsets = new Float32Array(regenCount);

    for (let i = 0; i < regenCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.2 + Math.random() * 0.5;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      speeds[i] = 0.5 + Math.random() * 2;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, speeds, offsets, count: regenCount };
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Update emission particles
    if (emissionRef.current) {
      const pos = emissionRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        // Orbit and drift upward
        const x = pos.array[i * 3];
        const y = pos.array[i * 3 + 1];
        const z = pos.array[i * 3 + 2];

        const angle = Math.atan2(z, x) + 0.002;
        const dist = Math.sqrt(x * x + z * z);

        pos.array[i * 3] = dist * Math.cos(angle) + emissionData.velocities[i * 3];
        pos.array[i * 3 + 1] = y + emissionData.velocities[i * 3 + 1];
        pos.array[i * 3 + 2] = dist * Math.sin(angle) + emissionData.velocities[i * 3 + 2];

        // Reset if too far
        const totalDist = Math.sqrt(pos.array[i * 3] ** 2 + pos.array[i * 3 + 1] ** 2 + pos.array[i * 3 + 2] ** 2);
        if (totalDist > 5 || pos.array[i * 3 + 1] > 4) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 2.3 + Math.random() * 0.3;
          pos.array[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          pos.array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          pos.array[i * 3 + 2] = r * Math.cos(phi);
        }
      }
      pos.needsUpdate = true;

      // Fade emissions with health
      emissionRef.current.material.opacity = Math.max(0.02, (1 - health / 100) * 0.35);
    }

    // Update regen particles
    if (regenRef.current) {
      const pos = regenRef.current.geometry.attributes.position;
      for (let i = 0; i < regenData.count; i++) {
        const base = regenData.positions;
        const speed = regenData.speeds[i];
        const offset = regenData.offsets[i];

        // Gentle float and pulse
        pos.array[i * 3] = base[i * 3] + Math.sin(t * speed + offset) * 0.1;
        pos.array[i * 3 + 1] = base[i * 3 + 1] + Math.cos(t * speed * 0.7 + offset) * 0.15;
        pos.array[i * 3 + 2] = base[i * 3 + 2] + Math.sin(t * speed * 0.5 + offset + 1) * 0.1;
      }
      pos.needsUpdate = true;

      // Fade regen with health (more visible at high health)
      regenRef.current.material.opacity = (health / 100) * 0.5;
    }
  });

  return (
    <group>
      {/* Emission particles (smoke) */}
      <points ref={emissionRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={emissionData.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ff6b35"
          size={0.06}
          transparent
          opacity={0.2}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Regeneration particles (bioluminescent) */}
      <points ref={regenRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={regenData.count}
            array={new Float32Array(regenData.positions)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#00ff88"
          size={0.04}
          transparent
          opacity={0.3}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
