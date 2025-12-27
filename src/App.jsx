import React, { useState, useEffect, useCallback } from 'react';
import { slides } from './data/slides';
import { renderSlide } from './components/slides';
import { colors, gradients } from './styles/theme';

export default function App() {
  const [current, setCurrent] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, slides.length - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev]);

  // Show controls when mouse is near bottom of screen
  useEffect(() => {
    const handleMouseMove = (e) => {
      const threshold = window.innerHeight - 100;
      setShowControls(e.clientY > threshold);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: colors.background,
      color: colors.textPrimary,
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 4,
        background: gradients.progress,
        width: `${((current + 1) / slides.length) * 100}%`,
        transition: 'width 0.3s ease',
        zIndex: 100
      }} />

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

      {/* Slide content */}
      <div className="slide-container">
        <div key={current} className="slide-animate" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {renderSlide(slides[current].type)}
        </div>
      </div>

      {/* Navigation */}
      <div className="nav-controls" style={{ opacity: showControls ? 1 : 0, transition: 'opacity 0.3s' }}>
        <button
          onClick={prev}
          disabled={current === 0}
          className="nav-btn"
          style={{
            background: current === 0 ? 'transparent' : 'rgba(255,154,0,0.1)',
            color: current === 0 ? '#444' : '#fff',
            cursor: current === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          ←
        </button>
        <span className="nav-counter" style={{ color: colors.textSecondary }}>
          {current + 1} / {slides.length}
        </span>
        <button
          onClick={next}
          disabled={current === slides.length - 1}
          className="nav-btn"
          style={{
            background: current === slides.length - 1 ? 'transparent' : 'rgba(255,154,0,0.1)',
            color: current === slides.length - 1 ? '#444' : '#fff',
            cursor: current === slides.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          →
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="keyboard-hints" style={{ color: '#555', opacity: showControls ? 1 : 0, transition: 'opacity 0.3s' }}>
        <span style={{ background: colors.cardBackground, padding: '5px 10px', borderRadius: 6 }}>←</span>
        <span style={{ background: colors.cardBackground, padding: '5px 10px', borderRadius: 6 }}>→</span>
        <span>to navigate</span>
      </div>
    </div>
  );
}
