import { useRef } from 'react';
import StarField from './world/StarField';
import Earth from './world/Earth';
import Atmosphere from './world/Atmosphere';
import ParticleSystem from './world/ParticleSystem';
import AuroraEffect from './world/AuroraEffect';
import HolographicNav from './ui/HolographicNav';
import CameraController from './ui/CameraController';

// Panels
import OrbitalView from './panels/OrbitalView';
import CarbonScanner from './panels/CarbonScanner';
import CommandCenter from './panels/CommandCenter';
import GuardianMissions from './panels/GuardianMissions';
import AIGuide from './panels/AIGuide';
import GlobalNetwork from './panels/GlobalNetwork';

export default function Experience({
  activePanel,
  onNavigate,
  earthHealth,
  introComplete,
  carbonData,
  onUpdateCarbonData,
  challengeProgress,
  onUpdateChallenges
}) {
  const earthGroupRef = useRef();

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={2.5}
        color="#e0f0ff"
      />
      <pointLight
        position={[-4, -2, -4]}
        intensity={1.0}
        color="#00f0ff"
      />

      {/* Camera Coordinator */}
      <CameraController activePanel={activePanel} introComplete={introComplete} />

      {/* Deep Space */}
      <StarField />

      {/* Interactive Planet Cluster */}
      <group ref={earthGroupRef} position={[0, 0, 0]}>
        <Earth health={earthHealth} />
        <Atmosphere health={earthHealth} />
        <ParticleSystem health={earthHealth} count={400} />
        <AuroraEffect health={earthHealth} />
      </group>

      {/* Floating Holographic Nav Orbs */}
      {introComplete && (
        <HolographicNav activePanel={activePanel} onNavigate={onNavigate} />
      )}

      {/* Floating Panels Overlay inside Canvas */}
      {introComplete && (
        <>
          <OrbitalView
            visible={activePanel === 'orbital'}
            carbonData={carbonData}
            challengeProgress={challengeProgress}
            onNavigate={onNavigate}
          />

          <CarbonScanner
            visible={activePanel === 'scanner'}
            carbonData={carbonData}
            onUpdateCarbonData={onUpdateCarbonData}
          />

          <CommandCenter
            visible={activePanel === 'command'}
            carbonData={carbonData}
          />

          <GuardianMissions
            visible={activePanel === 'missions'}
            challengeProgress={challengeProgress}
            onUpdateChallenges={onUpdateChallenges}
          />

          <AIGuide
            visible={activePanel === 'guide'}
            carbonData={carbonData}
            onUpdateCarbonData={onUpdateCarbonData}
          />

          <GlobalNetwork
            visible={activePanel === 'network'}
          />
        </>
      )}
    </>
  );
}
