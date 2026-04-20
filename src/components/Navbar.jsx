import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Upload, Users } from 'lucide-react';
import allvi_logo from "../assets/allvi_logo.png";

// --- CLEAN STYLES (Moved outside the component) ---
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 60px',
    backgroundColor: 'var(--ivory)',
    borderBottom: '1px solid rgba(15, 76, 92, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    gap: '12px',
  },
  logoTextGroup: {
    display: 'flex',
    alignItems: 'baseline',
  },
  logoCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid var(--teal)',
    boxShadow: '0 2px 8px rgba(0, 128, 128, 0.15)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  navGroup: {
    display: 'flex',
    gap: '40px',
    alignItems: 'center',
  }
};

const Navbar = () => {
  // Logic for dynamic styles remains inside
  const navLinkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: isActive ? 'var(--teal)' : 'var(--charcoal)',
    opacity: isActive ? 1 : 0.7,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: '0.2s',
  });

  return (
    <nav style={styles.nav}>
      {/* LOGO SECTION */}
      <Link to="/" style={styles.logoLink}>
        <div style={styles.logoCircle}>
          <img src={allvi_logo} alt="Allvi Logo" style={styles.logoImg} />
        </div>
        <div style={styles.logoTextGroup}>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: '500', color: 'var(--teal)' }}>
            All
          </span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: '300', fontStyle: 'italic', color: 'var(--teal)', opacity: 0.55 }}>
            vi
          </span>
        </div>
      </Link>

      {/* NAVIGATION LINKS */}
      <div style={styles.navGroup}>
        <NavLink to="/phase1upload" style={navLinkStyle}>
          <Upload size={18} /> Upload
        </NavLink>
        <NavLink to="/admin" style={navLinkStyle}>
          <Users size={18} /> AdminPortal
        </NavLink>
        <NavLink to="/portal" style={navLinkStyle}>
           <Users size={18} /> UserPortal
        </NavLink>
      </div>
      
    </nav>
  );
};

export default Navbar;