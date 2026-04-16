import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Upload, Users } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline', 
      padding: '20px 40px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      
      {/* LEFT: LOGO SECTION */}
      <Link to="/" style={{ display: 'flex', alignItems: 'baseline', textDecoration: 'none' }}>
        <span style={{ 
            fontFamily: 'var(--serif)', 
            fontSize: '28px', 
            fontWeight: '500', 
            fontStyle: 'Italic', 
            letterSpacing: '-0.02em', 
            color: "blue", 
            opacity: 0.55 
        }}>
          All
        </span>
        <span style={{ 
            fontFamily: 'var(--serif)', 
            fontSize: '28px', 
            fontWeight: '300', 
            fontStyle : "oblique",
            letterSpacing: '-0.02em', 
            color: "blue", 
            opacity: 0.55 
        }}>
          vi
        </span>
      </Link>

      {/* RIGHT: OPTIONS */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'baseline' }}>
        <NavLink 
          to="/phase1upload" 
          style={({ isActive }) => ({
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500',
            color: isActive ? 'var(--teal)' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          })}
        >
          <Upload size={18} /> Upload
        </NavLink>

        <NavLink 
          to="/admin" 
          style={({ isActive }) => ({
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '500',
            color: isActive ? 'var(--teal)' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          })}
        >
          <Users size={18} /> Admin Portal
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;