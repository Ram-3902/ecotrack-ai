import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkStyle = ({ isActive }) => ({
    fontSize: '14px',
    fontWeight: 500,
    color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  });

  return (
    <header style={{
      borderBottom: '1px solid var(--color-border)',
      background: 'rgba(3, 7, 18, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div className="container" style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <NavLink to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
        }}>
          <span style={{ fontSize: '20px' }}>🌿</span>
          <span style={{
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
          }}>
            EcoTrack AI
          </span>
        </NavLink>

        {/* Navigation Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <NavLink to="/dashboard" style={linkStyle} className="nav-item">Dashboard</NavLink>
          <NavLink to="/coach" style={linkStyle} className="nav-item">AI Coach</NavLink>
          <NavLink to="/simulator" style={linkStyle} className="nav-item">Simulator</NavLink>
          <NavLink to="/challenges" style={linkStyle} className="nav-item">Challenges</NavLink>
          <NavLink to="/community" style={linkStyle} className="nav-item">Community</NavLink>
        </nav>

        {/* CTA Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NavLink to="/coach" className="saas-btn saas-btn--primary saas-btn--sm">
            Start Assessment
          </NavLink>
        </div>
      </div>
    </header>
  );
}
