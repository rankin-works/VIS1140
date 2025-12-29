import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPresentation } from '../data/presentations';
import { renderSlide } from './slides';
import ParticleNetwork from './ParticleNetwork';
import { colors, gradients } from '../styles/theme';

export default function PresentationViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const presentation = getPresentation(id);

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState('next'); // 'next' or 'prev'
  const [showControls, setShowControls] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const touchStartX = useRef(null);
  const lastSwipeTime = useRef(0);

  // Handle invalid presentation ID
  useEffect(() => {
    if (!presentation) {
      navigate('/presentations', { replace: true });
    }
  }, [presentation, navigate]);

  const slides = presentation?.slides || [];

  const next = useCallback(() => {
    setDirection('next');
    setCurrent(c => Math.min(c + 1, slides.length - 1));
  }, [slides.length]);

  const prev = useCallback(() => {
    setDirection('prev');
    setCurrent(c => Math.max(c - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Escape') {
        navigate('/presentations');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev, navigate]);

  // Touch/swipe navigation (mobile)
  useEffect(() => {
    // Check if touch started on an interactive element (demos, inputs, etc.)
    const isInteractiveElement = (el) => {
      while (el) {
        // Check for elements that should block swipe navigation
        if (el.tagName === 'SVG' || el.tagName === 'svg' ||
            el.tagName === 'INPUT' || el.tagName === 'BUTTON' ||
            el.tagName === 'CANVAS' ||
            el.dataset?.interactive === 'true' ||
            (el.style && el.style.touchAction === 'none') ||
            (window.getComputedStyle && window.getComputedStyle(el).touchAction === 'none')) {
          return true;
        }
        el = el.parentElement;
      }
      return false;
    };

    const handleTouchStart = (e) => {
      // Don't capture swipes on interactive elements
      if (isInteractiveElement(e.target)) {
        touchStartX.current = null;
        return;
      }
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (touchStartX.current === null) return;

      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;
      const threshold = 50; // minimum swipe distance

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          next(); // Swipe left = next slide
        } else {
          prev(); // Swipe right = previous slide
        }
      }
      touchStartX.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [next, prev]);

  // Trackpad horizontal scroll navigation
  useEffect(() => {
    const handleWheel = (e) => {
      // Only respond to horizontal scrolling (trackpad gesture)
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 30) {
        const now = Date.now();
        // Debounce to prevent multiple triggers
        if (now - lastSwipeTime.current < 300) return;
        lastSwipeTime.current = now;

        if (e.deltaX > 0) {
          next(); // Scroll right = next slide
        } else {
          prev(); // Scroll left = previous slide
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
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

  if (!presentation) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: colors.background,
      color: colors.textPrimary,
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      overflow: 'hidden',
      zIndex: 2000
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

        {/* Particle network with connecting lines */}
        <ParticleNetwork particleCount={25} lineDistance={150} />
      </div>

      {/* Slide content */}
      <div className="slide-container">
        <div
          key={current}
          className={`slide-animate ${direction === 'next' ? 'slide-from-right' : 'slide-from-left'}`}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          {renderSlide(slides[current].type)}
        </div>
      </div>

      {/* Back button - bottom left */}
      <Link
        to="/presentations"
        className="back-btn"
        style={{
          opacity: showControls ? 1 : 0
        }}
      >
        ← Back
      </Link>

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

      {/* Keyboard hints (desktop) */}
      <div className="keyboard-hints" style={{ color: '#fff', opacity: showControls ? 1 : 0, transition: 'opacity 0.3s' }}>
        <span style={{ background: colors.cardBackground, padding: '5px 10px', borderRadius: 6 }}>←</span>
        <span style={{ background: colors.cardBackground, padding: '5px 10px', borderRadius: 6 }}>→</span>
        <span>to navigate</span>
        <span style={{ marginLeft: 12, background: colors.cardBackground, padding: '5px 10px', borderRadius: 6 }}>ESC</span>
        <span>to exit</span>
      </div>

      {/* Mobile swipe hint */}
      {showSwipeHint && (
        <div
          className="swipe-hint"
          onClick={() => setShowSwipeHint(false)}
        >
          <span>← Swipe to navigate →</span>
          <span className="swipe-hint-dismiss">Tap to dismiss</span>
        </div>
      )}
    </div>
  );
}
