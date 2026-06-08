import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural Earth with holographic/Tron aesthetic
 * Health state (0-100) controls visual appearance:
 * - Low health: smoky, brown/grey, emission hotspots
 * - High health: vibrant cyan oceans, green continents, auroral glow
 */
export default function Earth({ health = 60, onClick }) {
  const meshRef = useRef();
  const glowRef = useRef();

  // Procedural continent shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHealth: { value: health / 100 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uHealth;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec2 vUv;

        // Simple noise function
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p *= 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          // Generate continental shapes
          float continent = fbm(vUv * 6.0 + vec2(1.0, 0.5));
          float landMask = smoothstep(0.45, 0.55, continent);

          // Ocean color — shifts from murky to vibrant with health
          vec3 oceanSick = vec3(0.05, 0.06, 0.08);
          vec3 oceanHealthy = vec3(0.0, 0.12, 0.18);
          vec3 ocean = mix(oceanSick, oceanHealthy, uHealth);

          // Land color — shifts from brown/dead to green/alive  
          vec3 landSick = vec3(0.12, 0.08, 0.05);
          vec3 landHealthy = vec3(0.0, 0.25, 0.12);
          vec3 land = mix(landSick, landHealthy, uHealth);

          // Emission hotspots (more visible at low health)
          float hotspot = fbm(vUv * 12.0 + uTime * 0.02);
          hotspot = smoothstep(0.6, 0.8, hotspot) * (1.0 - uHealth) * 0.5;
          vec3 hotColor = vec3(1.0, 0.3, 0.0); // orange emission

          // Bioluminescent veins (more visible at high health)
          float veins = fbm(vUv * 15.0 + uTime * 0.05);
          veins = smoothstep(0.65, 0.75, veins) * uHealth * 0.6;
          vec3 veinColor = vec3(0.0, 1.0, 0.53); // bioluminescent green

          // Grid lines (holographic feel)
          float gridX = abs(sin(vUv.x * 120.0)) ;
          float gridY = abs(sin(vUv.y * 60.0));
          float grid = smoothstep(0.97, 1.0, max(gridX, gridY)) * 0.08;
          vec3 gridColor = vec3(0.0, 0.8, 1.0);

          // Compose
          vec3 baseColor = mix(ocean, land, landMask);
          baseColor += hotColor * hotspot;
          baseColor += veinColor * veins * landMask;
          baseColor += gridColor * grid;

          // Edge glow (Fresnel-like)
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
          fresnel = pow(fresnel, 3.0);
          vec3 fresnelColor = mix(vec3(1.0, 0.3, 0.0), vec3(0.0, 0.94, 1.0), uHealth);
          baseColor += fresnelColor * fresnel * 0.4;

          gl_FragColor = vec4(baseColor, 1.0);
        }
      `,
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    material.uniforms.uTime.value = t;
    material.uniforms.uHealth.value = health / 100;

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.05;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = t * 0.05;
      const s = 1.0 + Math.sin(t * 0.5) * 0.005;
      glowRef.current.scale.setScalar(s);
    }
  });

  return (
    <group onClick={onClick}>
      {/* Main Earth */}
      <mesh ref={meshRef} material={material}>
        <sphereGeometry args={[2, 128, 128]} />
      </mesh>

      {/* Inner glow (energy core) */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.85, 32, 32]} />
        <meshBasicMaterial
          color={health > 50 ? '#00ff88' : '#ff6b35'}
          transparent
          opacity={0.06 + (health / 100) * 0.08}
        />
      </mesh>
    </group>
  );
}
