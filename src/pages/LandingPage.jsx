import { Link } from 'react-router-dom';
import MiniSimulator from '../components/MiniSimulator';

const FEATURES = [
  { icon: '📊', title: 'Carbon Analytics', desc: 'Detailed, audit-ready calculations tracking your transportation, home energy, water consumption, and goods spending.' },
  { icon: '🤖', title: 'AI Sustainability Coach', desc: 'Interact with a conversational agent to analyze your lifestyle habits and generate weekly, low-effort carbon mitigation tasks.' },
  { icon: '🔮', title: 'Lifestyle Simulator', desc: 'Model potential shifts—like installing solar, EV commutes, or dietary changes—to immediately preview budget savings and CO₂ reductions.' },
  { icon: '🏆', title: 'Gamified Missions', desc: 'Unlock XP points, complete daily eco-challenges, track active habits, and earn collectible achievement badges.' },
  { icon: '🌐', title: 'Global Network', desc: 'Connect with a community of thousands, contribute to collective milestones, and climb the local leaderboard.' },
  { icon: '📄', title: 'PDF Export Diagnostics', desc: 'Compile your calculations, target goals, and active recommendations into clean, downloadable PDF diagnostics reports.' },
];

const TESTIMONIALS = [
  { quote: "EcoTrack AI turned complex carbon math into small, clear habits. In three months, I saved $80/month and reduced my footprint by 25%.", user: "Sarah Jenkins", role: "Software Engineer" },
  { quote: "The AI Coach weekly action plans are incredibly practical. It suggests simple checklist items that fit naturally into my routine.", user: "David Chen", role: "Product Designer" },
  { quote: "The simulator is eye-opening. Seeing my gas savings and tree offset equivalent immediately updated helped me commit to getting an EV.", user: "Elena Rostova", role: "Sustainability Officer" },
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
              🚀 Product Launch // Platform Live
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1 }}>
              Measure, Model, and Mitigate Your Carbon Footprint
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
              A premium personal carbon intelligence platform. Sync your lifestyle metrics, simulate habits savings, and coordinate green adjustments with a conversational AI coach.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <Link to="/coach" className="saas-btn saas-btn--primary">
                Get Started Free
              </Link>
              <Link to="/dashboard" className="saas-btn">
                Open Console
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
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>CO₂ Reduced</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--color-primary)' }}>142k+</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trees Planted</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>28,475</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Members</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>87</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Regions Connected</div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Engineered for Active Impact</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: 'var(--text-secondary)' }}>
            We've stripped away the noise to build a highly optimized diagnostic dashboard that turns carbon metrics into clear daily actions.
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

      {/* Testimonials */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Approved by Climate Leaders</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
        }}>
          {TESTIMONIALS.map((test, idx) => (
            <div key={idx} className="saas-card" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', minHeight: '180px' }}>
              <p style={{ fontSize: '14px', fontStyle: 'italic', color: 'var(--text-primary)', marginBottom: '24px' }}>
                "{test.quote}"
              </p>
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>{test.user}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{test.role}</div>
              </div>
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
          <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Calibrate Your Biosphere Path Today</h2>
          <p style={{ maxWidth: '500px', margin: '0 auto 28px auto', fontSize: '16px', color: 'var(--text-secondary)' }}>
            Join over 28,000 members tracking their footprints, finishing challenges, and scaling green actions.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/coach" className="saas-btn saas-btn--primary">
              Initialize AI Coach
            </Link>
            <Link to="/dashboard" className="saas-btn">
              View Your Console
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
