# 🌿 EcoTrack AI — Futuristic 3D Environmental Command Center

EcoTrack AI is a premium climate-tech web application set in the year 2045, designed to help individuals understand, track, and reduce their carbon footprint. By centering the user experience around an interactive, real-time 3D planetary ecosystem simulation, EcoTrack AI bridges the gap between passive carbon tracking and active sustainability action.

---

## 🌍 Chosen Vertical
*   **Vertical**: Personal Carbon Footprint Tracker & AI Sustainability Guide
*   **Theme**: Interactive 3D Environmental Command Center (Year 2045 Biosphere Management)
*   **Persona**: The AI Sustainability Coach ("Guardian Guide"), a conversational intelligence that assesses user habits, updates planetary telemetry, and prescribes targeted weekly action plans.

---

## 💡 Approach and Logic

### 1. Immersive 3D Visual Feedback Loop
Instead of traditional form checklists and static progress bars, EcoTrack AI maps carbon emissions directly onto a procedural 3D model of Earth.
*   **Biosphere Health State**: The user's carbon score (0–100) dynamically updates the shaders of the Earth. A high carbon score triggers green bioluminescent veins and clear cyan oceans. A low carbon score fades the green vegetation, darkens the oceans, and spawns volcanic-red emission hotspots.
*   **Atmospheric Particles**: GPU-instanced smoke particles (orange) orbit the planet to represent carbon accumulation, while bioluminescent regeneration fireflies (green) float near the surface during eco-actions.

### 2. Conversational AI Assessment (The Coach)
The **AI Sustainability Coach** interview is modeled as a direct habit diagnostics procedure. Rather than typing a long form, the user answers 4 guided questions regarding Transportation, Diet & Waste, Home Energy, and Shopping. The responses instantly populate the mathematical engine to:
*   Calculate the carbon footprint score.
*   Identify the highest-emission driver.
*   Prescribe 3 high-impact recommendations.
*   Establish a custom 7-day calendar (Weekly Action Plan).

### 3. Dynamic Life Sandbox (Carbon Impact Simulator)
The **Simulator** allows users to model changes to their lifestyle and instantly review the benefits.
*   It calculates custom reductions based on the user's actual baseline values (e.g. if the user drives a lot, switching to an EV shows a much higher reduction than if their baseline driving is low).
*   It provides direct translation into:
    *   **CO₂ Reduced** (kg/year).
    *   **Financial Savings** ($/year).
    *   **Environmental Equivalent** (Mature trees absorbed/year).

---

## 🛠️ How the Solution Works

### Mathematical Calculation Logic (`/src/utils/carbonEngine.js`)
Emissions are calculated per category and aggregated into monthly and yearly kg CO₂ totals:
1.  **Transportation**:
    *   *Car*: $\text{km/week} \times 4.33 \times \text{Factor}_{\text{vehicle\_type}}$
    *   *Flights*: $(\text{flights/year} \times \text{distance} \times \text{Factor}_{\text{flight}} \times 2) / 12$
2.  **Home Energy**:
    *   $\text{kWh} \times (1 - \text{Renewable \%}) \times \text{Factor}_{\text{grid\_avg}} + \text{kWh} \times \text{Renewable \%} \times \text{Factor}_{\text{renewable}}$
3.  **Dietary Choice**:
    *   $\text{Factor}_{\text{diet}} \times 30 \times (1 + \text{Waste \%})$
4.  **Shopping**:
    *   $(\text{clothing} \times 15) + (\text{small\_elec} \times 50) / 12 + (\text{spending} \times 0.5)$

### Core Interactive Modules
*   **Command Deck (Overview)**: Central node showcasing current metrics, daily streak, and planetary warning telemetry.
*   **Scanner (Direct Inputs)**: Multi-step tabbed forms that update the Earth's particle count and surface shader in real-time as sliders are dragged.
*   **Command Center (Dashboard & Simulator)**: Contains Recharts data visualizers and the interactive **Carbon Impact Simulator**. Toggling lifestyle changes updates the equivalent tree count and annual savings instantly.
*   **Missions (Challenges & Badges)**: Gamified operation board offering 24 challenges. Completing a challenge awards points and updates badge unlocks.
*   **AI Guide (Coach)**: Conversational panel hosting the **AI Sustainability Coach Assessment** and a general sustainability Q&A assistant.
*   **Global Network (Leaderboard)**: Illustrates community telemetry, global CO₂ reductions, and a ranking board.

---

## 🏗️ Architecture

```
src/
├── world/                  # 3D Earth & environment
│   ├── Earth.jsx           # Interactive planet with health state
│   ├── Atmosphere.jsx      # Fresnel glow + clouds
│   ├── ParticleSystem.jsx  # Emission/regen/ambient particles
│   ├── AuroraEffect.jsx    # Animated aurora borealis
│   └── StarField.jsx       # Deep space background
├── ui/                     # Navigation & UI chrome
│   ├── HolographicNav.jsx  # Orbital floating nav icons
│   ├── HolographicPanel.jsx # Reusable glassmorphic panel
│   ├── CameraController.jsx # GSAP camera transitions
│   └── IntroSequence.jsx   # 5-second cinematic intro
├── panels/                 # Experience modes (replace pages)
│   ├── OrbitalView.jsx     # Default: Earth + floating stats
│   ├── CarbonScanner.jsx   # Calculator with live Earth effects
│   ├── CommandCenter.jsx   # 3D dashboard with data sculptures & Carbon Simulator
│   ├── GuardianMissions.jsx # Gamified challenges & Badges
│   ├── AIGuide.jsx         # Conversational AI Sustainability Coach
│   └── GlobalNetwork.jsx   # Community connections on globe
├── utils/                  # Utility engines
│   ├── carbonEngine.js     # Carbon score & emissions math
│   ├── insightsEngine.js   # Recommendation algorithm
│   ├── chatEngine.js       # Q&A assistant knowledge base
│   ├── challengeData.js    # Streak, challenge, and badge lists
│   ├── dataStore.js        # localStorage manager
│   └── sampleData.js       # Default snapshot generator
├── Experience.jsx          # Root 3D scene orchestrator
├── App.jsx                 # Canvas + state machine
├── main.jsx                # Entry point
└── index.css               # Design system & holographic panels layout
```

---

## 🔑 Assumptions Made

*   **Tree Absorption Equivalent**: 1 mature tree absorbs approximately 22 kg of CO₂ per year (sourced from EPA averages).
*   **Grid Emission Factor**: Standard grid electricity factor of 0.42 kg CO₂/kWh (US Grid average) vs. 0.05 kg CO₂/kWh for green tariff/renewables.
*   **Diet Emissions**: Beef/Heavy Meat (7.2 kg CO₂/day) vs. Vegan/Plant-Based (1.5 kg CO₂/day).
*   **EV Financial Benefit**: Estimated average fuel/maintenance savings of $0.15 per kilometer driven.
*   **General Spending Carbon Intensity**: Sourced at 0.5 kg CO₂ per dollar spent.
