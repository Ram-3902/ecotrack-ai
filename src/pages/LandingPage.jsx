import { Link } from 'react-router-dom';
import MiniSimulator from '../components/MiniSimulator';

const FEATURES = [
  { icon: '📊', title: 'Emissions Analysis', desc: 'Robust calculations tracking greenhouse gas output from transportation, home energy, food preferences, and material purchases.' },
  { icon: '🤖', title: 'AI Sustainability Coach', desc: 'Interact with an intelligent assistant to walk through your daily habits and establish a tailored Weekly Action Plan.' },
  { icon: '🔮', title: 'Impact Simulator', desc: 'Model potential shifts—like installing solar, EV commutes, or dietary changes—to immediately preview CO₂ reductions and cost savings.' },
  { icon: '🏆', title: 'Eco Challenges', desc: 'Take part in structured daily, weekly, and monthly challenges to build carbon-conscious lifestyle habits.' },
  { icon: '🌐', title: 'Community Insights', desc: 'Review global mitigation statistics, participate in community milestones, and inspect community action rankings.' },
  { icon: '📄', title: 'Diagnostics Report', desc: 'Compile your calculations, target goals, and active recommendations into clean, downloadable PDF report files.' },
];

const INSIGHTS = [
  { title: "⚡ Grid Electrification", text: "Transitioning standard home electricity to green tariff options or residential solar is the single most effective way to eliminate home emissions." },
  { title: "🥦 Plant-Forward Diets", text: "Beef and dairy production contribute to over 14% of global greenhouse gases. Switching even a few meals to plant-based choices offers significant carbon relief." },
  { title: "🚴 Active Transportation", text: "A single passenger vehicle emits roughly 4.6 metric tons of CO₂ per year. Transitioning short commutes to rail, bus, or cycling cuts this output to zero." },
];

export default function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '80px', padding: '60px 0 80px 0' }}>
      
      {/* Hero Section */}
      <section className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '48px',
          alignItems: 'center',
         }}>
          {/* Hero Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="saas-badge saas-badge--green" style={{ alignSelf: 'flex-start' }}>
              🌱 Research & Educational Initiative
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1 }}>
              Measure, Model, and Mitigate Your Carbon Footprint
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
              An open-source diagnostic platform assisting citizens in calculating their emissions, simulating lifestyle changes, and participating in sustainability challenges.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <Link to="/coach" className="saas-btn saas-btn--primary">
                Start Assessment
              </Link>
              <Link to="/dashboard" className="saas-btn">
                View My Impact
              </Link>
            </div>
          </div>

          {/* Interactive Preview Widget */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MiniSimulator />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: 'rgba(255,255,255,0.01)', padding: '48px 0' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          textAlign: 'center',
        }}>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-primary)' }}>2.8M kg</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CO₂ Mitigated</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-primary)' }}>142k+</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trees Planted Equivalent</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>28,475</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Synced Citizens</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>87</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Regions Engaged</div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Educational & Analytical Tools</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: 'var(--text-secondary)' }}>
            EcoTrack AI provides robust data models and guided steps to translate daily routines into actionable, low-carbon decisions.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}>
          {FEATURES.map((feat, idx) => (
            <div key={idx} className="saas-card">
              <span style={{ fontSize: '28px', display: 'block', marginBottom: '16px' }}>{feat.icon}</span>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>{feat.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainability Insights (Replaces Testimonials) */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Carbon Awareness & Science</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}>
          {INSIGHTS.map((info, idx) => (
            <div key={idx} className="saas-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-primary)' }}>{info.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                {info.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <div className="saas-card" style={{
          textAlign: 'center',
          padding: '60px 40px',
          background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.1), transparent)',
          borderColor: 'rgba(16, 185, 129, 0.2)',
        }}>
          <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Initiate Your Carbon Diagnostic</h2>
          <p style={{ maxWidth: '500px', margin: '0 auto 28px auto', fontSize: '16px', color: 'var(--text-secondary)' }}>
            Calculate your baseline carbon score, simulate habit modifications, and unlock a tailored weekly action plan.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/coach" className="saas-btn saas-btn--primary">
              Calculate My Footprint
            </Link>
            <Link to="/dashboard" className="saas-btn">
              View My Impact
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
