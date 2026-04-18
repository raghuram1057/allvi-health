import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Upload, Users } from 'lucide-react';

const Navbar = () => {
  const navLinkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    color: isActive ? 'var(--teal)' : 'var(--charcoal)',
    opacity: isActive ? 1 : 0.7,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: '0.2s'
  });

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      padding: '20px 60px',
      backgroundColor: 'var(--ivory)',
      borderBottom: '1px solid rgba(15, 76, 92, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* LOGO */}
      <Link to="/" style={{ display: 'flex', alignItems: 'baseline', textDecoration: 'none' }}>
         <span style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: '500', color: 'var(--teal)' }}>
          All
        </span>
        <span style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: '300', fontStyle: 'italic', color: 'var(--teal)', opacity: 0.55 }}>
          vi
        </span>
       
      </Link>

      {/* OPTIONS */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'baseline' }}>
        <NavLink to="/phase1upload" style={navLinkStyle}><Upload size={18} /> Upload</NavLink>
        <NavLink to="/admin" style={navLinkStyle}><Users size={18} /> Admin</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;