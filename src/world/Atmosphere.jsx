import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Atmospheric glow shell with Fresnel-based transparency
 * Color shifts from orange-haze (low health) to cyan-clear (high health)
 */
export default function Atmosphere({ health = 60 }) {
  const ref = useRef();

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHealth: { value: health / 100 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uHealth;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vPosition);
          float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
          fresnel = pow(fresnel, 2.5);

          // Color: orange-haze when sick, cyan-clear when healthy
          vec3 sickColor = vec3(1.0, 0.4, 0.1);
          vec3 healthyColor = vec3(0.0, 0.7, 1.0);
          vec3 color = mix(sickColor, healthyColor, uHealth);

          // Pulse
          float pulse = 0.9 + 0.1 * sin(uTime * 1.5);
          float alpha = fresnel * (0.25 + uHealth * 0.15) * pulse;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uHealth.value = health / 100;
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <mesh ref={ref} material={material}>
      <sphereGeometry args={[2.15, 64, 64]} />
    </mesh>
  );
}
