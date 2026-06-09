import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeSampleData, generateSampleCarbonData } from './utils/sampleData';
import { getCarbonData, saveCarbonData, getChallengeProgress, saveChallengeProgress } from './utils/dataStore';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CoachPage from './pages/CoachPage';
import SimulatorPage from './pages/SimulatorPage';
import ChallengesPage from './pages/ChallengesPage';
import CommunityPage from './pages/CommunityPage';

// Initialize sample data on first launch
initializeSampleData();

/**
 * Root application component.
 * Manages global carbon data and challenge progress state,
 * synchronizing with the localStorage persistence layer.
 * All routes are wrapped in an ErrorBoundary for crash resilience.
 *
 * @returns {JSX.Element} The rendered application.
 */
export default function App() {
  const [carbonData, setCarbonData] = useState(() => getCarbonData() || generateSampleCarbonData());
  const [challengeProgress, setChallengeProgress] = useState(() => getChallengeProgress());


  /**
   * Updates carbon data in both React state and persistent storage.
   * @param {Object} newData - The new carbon data snapshot.
   */
  const handleUpdateCarbonData = (newData) => {
    setCarbonData(newData);
    saveCarbonData(newData);
  };

  /**
   * Updates challenge progress in both React state and persistent storage.
   * @param {Object} newProgress - The updated challenge progress.
   */
  const handleUpdateChallenges = (newProgress) => {
    setChallengeProgress(newProgress);
    saveChallengeProgress(newProgress);
  };

  return (
    <BrowserRouter>
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Area — wrapped in ErrorBoundary for crash resilience */}
      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={<DashboardPage carbonData={carbonData} />}
            />
            <Route
              path="/coach"
              element={
                <CoachPage
                  carbonData={carbonData}
                  onUpdateCarbonData={handleUpdateCarbonData}
                />
              }
            />
            <Route
              path="/simulator"
              element={<SimulatorPage carbonData={carbonData} />}
            />
            <Route
              path="/challenges"
              element={
                <ChallengesPage
                  challengeProgress={challengeProgress}
                  onUpdateChallenges={handleUpdateChallenges}
                />
              }
            />
            <Route path="/community" element={<CommunityPage />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
  );
}
