import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeSampleData, generateSampleCarbonData } from './utils/sampleData';
import { getCarbonData, saveCarbonData, getChallengeProgress, saveChallengeProgress } from './utils/dataStore';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CoachPage from './pages/CoachPage';
import SimulatorPage from './pages/SimulatorPage';
import ChallengesPage from './pages/ChallengesPage';
import CommunityPage from './pages/CommunityPage';

// Initialize sample data on first launch
initializeSampleData();

export default function App() {
  const [carbonData, setCarbonData] = useState(null);
  const [challengeProgress, setChallengeProgress] = useState(null);

  useEffect(() => {
    // Load initial states from localStorage
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

  return (
    <BrowserRouter>
      {/* Top Navigation */}
      <Navbar />

      {/* Main Page Area */}
      <main style={{ flex: 1 }}>
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
      </main>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
  );
}
