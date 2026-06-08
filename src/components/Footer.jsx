import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: '#030712',
      padding: '48px 0 32px 0',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr repeat(4, 1fr)',
          gap: '32px',
          marginBottom: '40px',
        }}>
          {/* Logo & Slogan */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🌿</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>EcoTrack AI</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '240px' }}>
              Empowering global citizens to measure, model, and mitigate their environmental footprint.
            </p>
          </div>

          {/* Column 1: Product */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</span>
            <Link to="/dashboard" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/coach" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>AI Coach</Link>
            <Link to="/simulator" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Simulator</Link>
          </div>

          {/* Column 2: Resources */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</span>
            <a href="#" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Climate Science</a>
            <a href="#" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Emission Factors</a>
            <a href="#" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>API Access</a>
          </div>

          {/* Column 3: Company */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</span>
            <a href="#" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>About Us</a>
            <a href="#" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Carbon Projects</a>
            <a href="#" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Careers</a>
          </div>

          {/* Column 4: Legal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</span>
            <a href="#" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none' }}>Security</a>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          <span>&copy; {new Date().getFullYear()} EcoTrack AI Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Twitter</a>
            <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
