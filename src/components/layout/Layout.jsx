import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { colors } from '../../styles/theme';

export default function Layout() {
  return (
    <div style={{
      minHeight: '100vh',
      background: colors.background,
      color: colors.textPrimary,
      fontFamily: "'Space Grotesk', system-ui, sans-serif"
    }}>
      {/* Animated background glow effects */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div
          className="glow-orb-1"
          style={{
            position: 'absolute',
            width: 1400,
            height: 1400,
            borderRadius: '50%',
            background: '#00bcd4',
            filter: 'blur(300px)',
            opacity: 0.3,
            top: '-20%',
            right: '-15%'
          }}
        />
        <div
          className="glow-orb-2"
          style={{
            position: 'absolute',
            width: 1200,
            height: 1200,
            borderRadius: '50%',
            background: '#0a4f6e',
            filter: 'blur(240px)',
            opacity: 0.35,
            bottom: '-25%',
            left: '-10%'
          }}
        />
        <div
          className="glow-orb-3"
          style={{
            position: 'absolute',
            width: 1000,
            height: 1000,
            borderRadius: '50%',
            background: '#1e88e5',
            filter: 'blur(240px)',
            opacity: 0.25,
            bottom: '-15%',
            right: '-10%'
          }}
        />
      </div>

      <Header />

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}
