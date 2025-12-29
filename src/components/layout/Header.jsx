import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors, gradients } from '../../styles/theme';

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/presentations', label: 'Presentations' },
    { path: '/projects', label: 'Projects' },
    { path: '/resources', label: 'Resources' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            fontWeight: 700,
            background: gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            VIS1140.rankin.works
          </h1>
        </Link>

        <div className="nav-links">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
