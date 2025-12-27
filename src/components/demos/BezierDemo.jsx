import { useState, useEffect, useRef, useCallback } from 'react';
import { colors } from '../../styles/theme';

export default function BezierDemo() {
  const [t, setT] = useState(0.5);
  const [animating, setAnimating] = useState(false);
  const animRef = useRef(null);
  const svgRef = useRef(null);

  // Control points as state for dragging
  const [points, setPoints] = useState({
    p0: { x: 40, y: 140 },
    p1: { x: 80, y: 40 },
    p2: { x: 220, y: 40 },
    p3: { x: 260, y: 140 }
  });
  const [dragging, setDragging] = useState(null);

  const { p0, p1, p2, p3 } = points;

  // Convert screen coordinates to SVG coordinates
  const getSvgPoint = useCallback((e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Scale to SVG viewBox coordinates (0-300 x 0-180)
    const x = ((clientX - rect.left) / rect.width) * 300;
    const y = ((clientY - rect.top) / rect.height) * 180;

    // Clamp to viewBox bounds with padding
    return {
      x: Math.max(10, Math.min(290, x)),
      y: Math.max(10, Math.min(170, y))
    };
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((pointKey) => (e) => {
    e.preventDefault();
    setDragging(pointKey);
  }, []);

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!dragging) return;
    const newPos = getSvgPoint(e);
    setPoints(prev => ({
      ...prev,
      [dragging]: newPos
    }));
  }, [dragging, getSvgPoint]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDragging(null);
  }, []);

  // Add/remove global event listeners for dragging
  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [dragging, handleDragMove, handleDragEnd]);

  // Bezier curve calculation
  const bezier = useCallback((t) => ({
    x: Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x,
    y: Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y
  }), [p0, p1, p2, p3]);

  const pt = bezier(t);

  // Generate SVG path
  const path = Array.from({ length: 50 }, (_, i) => {
    const p = bezier(i / 49);
    return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
  }).join(' ');

  // Animation loop
  useEffect(() => {
    if (animating) {
      let start = null;
      const anim = (ts) => {
        if (!start) start = ts;
        setT(((ts - start) / 2000) % 1);
        animRef.current = requestAnimationFrame(anim);
      };
      animRef.current = requestAnimationFrame(anim);
    }
    return () => animRef.current && cancelAnimationFrame(animRef.current);
  }, [animating]);

  // Reset points to default
  const resetPoints = () => {
    setPoints({
      p0: { x: 40, y: 140 },
      p1: { x: 80, y: 40 },
      p2: { x: 220, y: 40 },
      p3: { x: 260, y: 140 }
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: 700
    }}>
      {/* SVG Visualization */}
      <div style={{
        background: colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <svg
          ref={svgRef}
          viewBox="0 0 300 200"
          style={{ width: '100%', maxWidth: 600, touchAction: 'none' }}
        >
          {/* Control point lines */}
          <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="rgba(255,154,0,0.4)" strokeWidth="1" strokeDasharray="6" />
          <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,154,0,0.4)" strokeWidth="1" strokeDasharray="6" />
          <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke="rgba(255,154,0,0.4)" strokeWidth="1" strokeDasharray="6" />

          {/* Bezier curve */}
          <path d={path} fill="none" stroke={colors.accentOrange} strokeWidth="2" />

          {/* Current point on curve (white circle) */}
          <circle cx={pt.x} cy={pt.y} r="6" fill="#fff" />

          {/* Draggable anchor points */}
          <circle
            cx={p0.x} cy={p0.y} r="7"
            fill={colors.accentOrange}
            style={{ cursor: 'grab' }}
            onMouseDown={handleDragStart('p0')}
            onTouchStart={handleDragStart('p0')}
          />
          <circle
            cx={p3.x} cy={p3.y} r="7"
            fill={colors.accentPink}
            style={{ cursor: 'grab' }}
            onMouseDown={handleDragStart('p3')}
            onTouchStart={handleDragStart('p3')}
          />

          {/* Draggable control handles */}
          <circle
            cx={p1.x} cy={p1.y} r="7"
            fill={colors.success}
            style={{ cursor: 'grab' }}
            onMouseDown={handleDragStart('p1')}
            onTouchStart={handleDragStart('p1')}
          />
          <circle
            cx={p2.x} cy={p2.y} r="7"
            fill={colors.success}
            style={{ cursor: 'grab' }}
            onMouseDown={handleDragStart('p2')}
            onTouchStart={handleDragStart('p2')}
          />

          {/* Labels */}
          <text x={p0.x} y={p0.y + 16} fill={colors.accentOrange} fontSize="8" textAnchor="middle" style={{ pointerEvents: 'none' }}>P0</text>
          <text x={p1.x - 6} y={p1.y - -16} fill={colors.success} fontSize="8" style={{ pointerEvents: 'none' }}>P1</text>
          <text x={p2.x - 6} y={p2.y - -16} fill={colors.success} fontSize="8" style={{ pointerEvents: 'none' }}>P2</text>
          <text x={p3.x} y={p3.y + 16} fill={colors.accentPink} fontSize="8" textAnchor="middle" style={{ pointerEvents: 'none' }}>P3</text>
        </svg>
      </div>

      {/* Formula display */}
      <div style={{
        background: colors.cardBackground,
        padding: '12px 24px',
        borderRadius: 12,
        marginBottom: 16,
        border: '1px solid rgba(255,154,0,0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Cubic Bezier Curve</div>
        <code style={{ color: colors.accentOrange, fontFamily: 'monospace', fontSize: 'clamp(12px, 2.5vw, 16px)' }}>
          B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3
        </code>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(8px, 2vw, 16px)',
          marginTop: 8,
          fontSize: 'clamp(11px, 2vw, 13px)',
          fontFamily: 'monospace',
          flexWrap: 'wrap'
        }}>
          <span style={{ color: colors.accentOrange }}>P0({p0.x.toFixed(0)},{p0.y.toFixed(0)})</span>
          <span style={{ color: colors.success }}>P1({p1.x.toFixed(0)},{p1.y.toFixed(0)})</span>
          <span style={{ color: colors.success }}>P2({p2.x.toFixed(0)},{p2.y.toFixed(0)})</span>
          <span style={{ color: colors.accentPink }}>P3({p3.x.toFixed(0)},{p3.y.toFixed(0)})</span>
        </div>
        <div style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8, fontFamily: 'monospace' }}>
          t = {t.toFixed(2)} → <span style={{ color: '#fff' }}>({pt.x.toFixed(0)}, {pt.y.toFixed(0)})</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={t}
          onChange={(e) => setT(parseFloat(e.target.value))}
          disabled={animating}
          style={{ width: 'min(240px, 50vw)', height: 8, accentColor: colors.accentOrange, cursor: 'pointer' }}
        />
        <button
          onClick={() => setAnimating(!animating)}
          style={{
            padding: '10px 20px',
            background: animating ? colors.accentPink : 'linear-gradient(135deg, #FF9A00, #FF3366)',
            border: 'none',
            borderRadius: 20,
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          {animating ? 'Stop' : 'Animate'}
        </button>
        <button
          onClick={resetPoints}
          style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 20,
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
