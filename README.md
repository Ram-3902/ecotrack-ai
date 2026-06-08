# 🌿 EcoTrack AI

**Your Personal AI Sustainability Coach**

EcoTrack AI is a premium climate-tech web application that helps individuals understand, track, and reduce their carbon footprint through personalized AI-powered insights and engaging eco challenges.

![EcoTrack AI](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-8-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🧮 Carbon Footprint Calculator
- Multi-step wizard covering 5 categories: Transportation, Energy, Food, Shopping, Water
- Real-time emission factor calculations (EPA/DEFRA sourced)
- Results with pie charts, comparison bars, and carbon score

### 📊 Sustainability Dashboard
- Carbon Score (0–100) with animated circular gauge
- Monthly emission trends (Area chart)
- Weekly progress (Bar chart)
- Future emissions prediction (Line chart)
- Goal setting & tracking system
- Downloadable PDF sustainability report

### 🤖 AI-Powered Insights Engine
- 35+ curated recommendations ranked by impact × ease × relevance
- Personalized based on your highest-emission categories
- Impact (kg CO₂/year), difficulty, and cost savings for each recommendation

### 🏆 Eco Challenges
- 24 challenges across Daily, Weekly, and Monthly tiers
- Points system (10–200 points per challenge)
- 12 achievement badges with Bronze/Silver/Gold/Platinum tiers
- Streak tracking with visual counter

### 💬 AI Sustainability Assistant
- Chat interface with rich knowledge base (15+ topics)
- Keyword-based intent matching with curated responses
- Follow-up suggestion chips for guided conversations
- Persistent chat history

### 🌍 Community Impact
- Animated stats counters (CO₂ reduced, trees equivalent, users, countries)
- Interactive leaderboard (top 10)
- Community milestone timeline with progress bars
- Earth visualization with pulsing rings

### 🎨 Premium UI/UX
- Glassmorphism design with frosted glass cards
- Dark/Light mode with smooth transitions
- Framer Motion animations throughout
- Fully responsive (mobile, tablet, desktop)
- Custom CSS design system with 50+ tokens
- Inter font from Google Fonts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ecotrack

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Architecture

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx       # Navigation with dark mode toggle
│   ├── Footer.jsx       # Premium footer
│   ├── CarbonScoreRing  # Animated SVG gauge
│   ├── AnimatedCounter  # Scroll-triggered number animation
│   ├── BadgeCard        # Achievement badge display
│   └── InsightsPanel    # AI recommendation cards
├── context/
│   └── ThemeContext.jsx  # Dark/light mode provider
├── pages/
│   ├── LandingPage      # Hero, stats, features, CTA
│   ├── CalculatorPage   # 5-step form wizard + results
│   ├── DashboardPage    # Charts, goals, insights
│   ├── ChallengesPage   # Challenges, badges, streaks
│   ├── AssistantPage    # Chat interface
│   └── CommunityPage   # Impact stats, leaderboard
├── utils/
│   ├── carbonEngine.js   # Emission calculation engine
│   ├── insightsEngine.js # AI recommendation algorithm
│   ├── chatEngine.js     # Chat knowledge base
│   ├── challengeData.js  # Challenge & badge definitions
│   ├── dataStore.js      # localStorage persistence
│   └── sampleData.js     # Demo data generator
├── App.jsx              # Root with routing
├── main.jsx             # Entry point
└── index.css            # Design system (50+ tokens)
```

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | Component framework |
| Vite 8 | Build tool & dev server |
| React Router | Client-side routing |
| Recharts | Data visualization |
| Framer Motion | Animations |
| jsPDF | PDF report generation |
| Vanilla CSS | Custom design system |

## 📱 Responsive Design

- **Mobile** (< 768px): Single column, collapsed nav, optimized charts
- **Tablet** (768–1024px): 2-column grids, side-by-side layouts
- **Desktop** (> 1024px): Full 3-column dashboard, side panels

## 🌙 Dark Mode

Toggle between light and dark themes using the moon/sun button in the navbar. Theme preference is persisted in localStorage.

## 📊 Data Persistence

All user data is stored in localStorage:
- Carbon footprint calculations
- Historical tracking data
- Challenge progress and streaks
- Chat conversation history
- Goals and preferences
- Theme selection

## 🚢 Deployment

### Vercel
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy the `dist` folder
```

### Docker
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

Built with 💚 for a greener future | **EcoTrack AI** © 2026
