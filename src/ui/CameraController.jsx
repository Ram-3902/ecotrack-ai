import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';

/**
 * Camera positions for each experience mode
 */
const CAMERA_POSITIONS = {
  intro: { pos: [0, 0, 20], target: [0, 0, 0] },
  orbital: { pos: [0, 1, 6.5], target: [0, 0, 0] },
  scanner: { pos: [3.5, 0.5, 4], target: [0, 0, 0] },
  command: { pos: [-1, 2, 5.5], target: [0, 0, 0] },
  missions: { pos: [-3.5, 0.5, 4], target: [0, 0, 0] },
  guide: { pos: [2, -0.5, 5], target: [0, 0, 0] },
  network: { pos: [0, 3, 5], target: [0, 0, 0] },
};

/**
 * GSAP-powered camera controller with cinematic transitions
 */
export default function CameraController({ activePanel = 'orbital', introComplete = true }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const idleAngle = useRef(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    const preset = CAMERA_POSITIONS[activePanel] || CAMERA_POSITIONS.orbital;
    isAnimating.current = true;

    const currentPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const targetPos = { x: preset.pos[0], y: preset.pos[1], z: preset.pos[2] };

    gsap.to(currentPos, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: activePanel === 'intro' ? 0 : 1.8,
      ease: 'power3.inOut',
      onUpdate: () => {
        camera.position.set(currentPos.x, currentPos.y, currentPos.z);
      },
      onComplete: () => {
        isAnimating.current = false;
        idleAngle.current = Math.atan2(camera.position.x, camera.position.z);
      },
    });

    const currentTarget = { x: targetRef.current.x, y: targetRef.current.y, z: targetRef.current.z };
    gsap.to(currentTarget, {
      x: preset.target[0],
      y: preset.target[1],
      z: preset.target[2],
      duration: activePanel === 'intro' ? 0 : 1.8,
      ease: 'power3.inOut',
      onUpdate: () => {
        targetRef.current.set(currentTarget.x, currentTarget.y, currentTarget.z);
      },
    });
  }, [activePanel, camera]);

  useFrame(() => {
    camera.lookAt(targetRef.current);

    // Subtle idle orbit when not animating and on orbital view
    if (!isAnimating.current && activePanel === 'orbital') {
      idleAngle.current += 0.0005;
      const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
      camera.position.x = radius * Math.sin(idleAngle.current);
      camera.position.z = radius * Math.cos(idleAngle.current);
    }
  });

  return null;
}

export { CAMERA_POSITIONS };
