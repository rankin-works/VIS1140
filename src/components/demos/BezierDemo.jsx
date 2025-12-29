import { useState, useEffect, useRef, useCallback } from 'react';
import { colors } from '../../styles/theme';

export default function BezierDemo() {
  const [t, setT] = useState(0.5);
  const [animating, setAnimating] = useState(false);
  const animRef = useRef(null);
  const svgRef = useRef(null);

  // Each anchor point has: position (x, y), handleIn (relative), handleOut (relative)
  const [anchors, setAnchors] = useState([
    { x: 40, y: 140, handleIn: { x: 0, y: 0 }, handleOut: { x: 40, y: -60 } },
    { x: 150, y: 50, handleIn: { x: -40, y: 0 }, handleOut: { x: 40, y: 0 } },
    { x: 260, y: 140, handleIn: { x: -40, y: -60 }, handleOut: { x: 0, y: 0 } }
  ]);
  const [dragging, setDragging] = useState(null); // { type: 'anchor'|'handleIn'|'handleOut', index: number }
  const [selectedAnchor, setSelectedAnchor] = useState(null);
  const [hovering, setHovering] = useState(false);
  const justDragged = useRef(false);
  const lastTap = useRef({ time: 0, index: null });

  // Convert screen coordinates to SVG coordinates
  const getSvgPoint = useCallback((e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = ((clientX - rect.left) / rect.width) * 300;
    const y = ((clientY - rect.top) / rect.height) * 180;

    return {
      x: Math.max(5, Math.min(295, x)),
      y: Math.max(5, Math.min(175, y))
    };
  }, []);

  // Cubic Bezier calculation between two anchors
  const cubicBezier = useCallback((p0, c0, c1, p1, t) => {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;
    return {
      x: mt3 * p0.x + 3 * mt2 * t * c0.x + 3 * mt * t2 * c1.x + t3 * p1.x,
      y: mt3 * p0.y + 3 * mt2 * t * c0.y + 3 * mt * t2 * c1.y + t3 * p1.y
    };
  }, []);

  // Get absolute handle positions
  const getHandlePos = useCallback((anchor, handleType) => {
    const handle = handleType === 'in' ? anchor.handleIn : anchor.handleOut;
    return { x: anchor.x + handle.x, y: anchor.y + handle.y };
  }, []);

  // Get point on the full path at parameter t (0-1)
  const getPointOnPath = useCallback((t) => {
    if (anchors.length < 2) return anchors[0] || { x: 150, y: 90 };

    const numSegments = anchors.length - 1;
    const segmentT = t * numSegments;
    const segmentIndex = Math.min(Math.floor(segmentT), numSegments - 1);
    const localT = segmentT - segmentIndex;

    const a0 = anchors[segmentIndex];
    const a1 = anchors[segmentIndex + 1];

    // Control points for this segment
    const p0 = { x: a0.x, y: a0.y };
    const c0 = getHandlePos(a0, 'out');
    const c1 = getHandlePos(a1, 'in');
    const p1 = { x: a1.x, y: a1.y };

    return cubicBezier(p0, c0, c1, p1, localT);
  }, [anchors, cubicBezier, getHandlePos]);

  const currentPoint = getPointOnPath(t);

  // Generate SVG path
  const generatePath = useCallback(() => {
    if (anchors.length < 2) return '';

    let path = `M ${anchors[0].x} ${anchors[0].y}`;

    for (let i = 0; i < anchors.length - 1; i++) {
      const a0 = anchors[i];
      const a1 = anchors[i + 1];
      const c0 = getHandlePos(a0, 'out');
      const c1 = getHandlePos(a1, 'in');
      path += ` C ${c0.x} ${c0.y}, ${c1.x} ${c1.y}, ${a1.x} ${a1.y}`;
    }

    return path;
  }, [anchors, getHandlePos]);

  // Handle drag start
  const handleDragStart = useCallback((type, index) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging({ type, index });
    setSelectedAnchor(index);
    justDragged.current = true;
  }, []);

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!dragging) return;
    const pos = getSvgPoint(e);
    const { type, index } = dragging;

    setAnchors(prev => prev.map((anchor, i) => {
      if (i !== index) return anchor;

      if (type === 'anchor') {
        // Move anchor and keep handles relative
        const dx = pos.x - anchor.x;
        const dy = pos.y - anchor.y;
        return { ...anchor, x: pos.x, y: pos.y };
      } else if (type === 'handleIn') {
        // Move handle, mirror the other handle for smooth curve
        const newHandleIn = { x: pos.x - anchor.x, y: pos.y - anchor.y };
        const newHandleOut = { x: -newHandleIn.x, y: -newHandleIn.y };
        return { ...anchor, handleIn: newHandleIn, handleOut: newHandleOut };
      } else if (type === 'handleOut') {
        const newHandleOut = { x: pos.x - anchor.x, y: pos.y - anchor.y };
        const newHandleIn = { x: -newHandleOut.x, y: -newHandleOut.y };
        return { ...anchor, handleIn: newHandleIn, handleOut: newHandleOut };
      }
      return anchor;
    }));
  }, [dragging, getSvgPoint]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDragging(null);
    // Reset justDragged after a short delay to allow click event to process first
    setTimeout(() => {
      justDragged.current = false;
    }, 50);
  }, []);

  // Add a new anchor point
  const addAnchor = useCallback((e) => {
    // Don't add if clicking on existing points or just finished dragging
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'circle' || tag === 'rect') return;
    if (justDragged.current) {
      justDragged.current = false;
      return;
    }

    const newPos = getSvgPoint(e);

    // Find best position to insert
    let insertIndex = anchors.length;
    let minDist = Infinity;

    for (let i = 0; i < anchors.length - 1; i++) {
      const a0 = anchors[i];
      const a1 = anchors[i + 1];
      const midX = (a0.x + a1.x) / 2;
      const midY = (a0.y + a1.y) / 2;
      const dist = Math.sqrt(Math.pow(newPos.x - midX, 2) + Math.pow(newPos.y - midY, 2));

      if (dist < minDist) {
        minDist = dist;
        insertIndex = i + 1;
      }
    }

    // Calculate handles based on neighboring points
    const prevAnchor = anchors[insertIndex - 1];
    const nextAnchor = anchors[insertIndex] || anchors[insertIndex - 1];

    const handleLength = 30;
    const dx = nextAnchor.x - prevAnchor.x;
    const dy = nextAnchor.y - prevAnchor.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = (dx / len) * handleLength;
    const ny = (dy / len) * handleLength;

    const newAnchor = {
      x: newPos.x,
      y: newPos.y,
      handleIn: { x: -nx, y: -ny },
      handleOut: { x: nx, y: ny }
    };

    setAnchors(prev => [
      ...prev.slice(0, insertIndex),
      newAnchor,
      ...prev.slice(insertIndex)
    ]);
    setSelectedAnchor(insertIndex);
  }, [anchors, getSvgPoint]);

  // Delete an anchor
  const deleteAnchor = useCallback((index) => {
    if (anchors.length <= 2) return;
    setAnchors(prev => prev.filter((_, i) => i !== index));
    setSelectedAnchor(null);
  }, [anchors.length]);

  // Reset handles on double-click/double-tap
  const resetHandles = useCallback((index) => {
    setAnchors(prev => prev.map((anchor, i) => {
      if (i !== index) return anchor;

      const prevAnchor = prev[i - 1];
      const nextAnchor = prev[i + 1];
      const handleLength = 30;

      let dx = 0, dy = 0;

      if (prevAnchor && nextAnchor) {
        // Middle point: direction based on neighbors
        dx = nextAnchor.x - prevAnchor.x;
        dy = nextAnchor.y - prevAnchor.y;
      } else if (nextAnchor) {
        // First point
        dx = nextAnchor.x - anchor.x;
        dy = nextAnchor.y - anchor.y;
      } else if (prevAnchor) {
        // Last point
        dx = anchor.x - prevAnchor.x;
        dy = anchor.y - prevAnchor.y;
      }

      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = (dx / len) * handleLength;
      const ny = (dy / len) * handleLength;

      return {
        ...anchor,
        handleIn: { x: -nx, y: -ny },
        handleOut: { x: nx, y: ny }
      };
    }));
  }, []);

  // Handle double-tap on mobile
  const handleDoubleTap = useCallback((index) => {
    const now = Date.now();
    if (lastTap.current.index === index && now - lastTap.current.time < 300) {
      // Double tap detected
      resetHandles(index);
      lastTap.current = { time: 0, index: null };
      return true;
    }
    lastTap.current = { time: now, index };
    return false;
  }, [resetHandles]);

  // Global drag listeners
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

  // Animation loop
  useEffect(() => {
    if (animating) {
      let start = null;
      const duration = 1500 + (anchors.length * 500);
      const anim = (ts) => {
        if (!start) start = ts;
        setT(((ts - start) / duration) % 1);
        animRef.current = requestAnimationFrame(anim);
      };
      animRef.current = requestAnimationFrame(anim);
    }
    return () => animRef.current && cancelAnimationFrame(animRef.current);
  }, [animating, anchors.length]);

  // Reset to default
  const resetAnchors = () => {
    setAnchors([
      { x: 40, y: 140, handleIn: { x: 0, y: 0 }, handleOut: { x: 40, y: -60 } },
      { x: 150, y: 50, handleIn: { x: -40, y: 0 }, handleOut: { x: 40, y: 0 } },
      { x: 260, y: 140, handleIn: { x: -40, y: -60 }, handleOut: { x: 0, y: 0 } }
    ]);
    setSelectedAnchor(null);
  };

  const showHandles = hovering || dragging !== null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: 700
    }}>
      {/* Instructions */}
      <div style={{
        fontSize: 'clamp(11px, 2vw, 13px)',
        color: colors.textSecondary,
        marginBottom: 12,
        textAlign: 'center'
      }}>
        <span style={{ color: colors.success }}>Click to add anchor points</span>
        {' | '}
        <span style={{ color: colors.accentOrange }}>Drag anchors to move</span>
        {' | '}
        <span style={{ color: colors.accentBlue }}>Drag handles to curve</span>
      </div>

      {/* SVG Canvas */}
      <div style={{
        background: colors.cardBackground,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <svg
          ref={svgRef}
          viewBox="0 0 300 180"
          style={{ width: '100%', maxWidth: 600, touchAction: 'none', cursor: 'crosshair' }}
          onClick={addAnchor}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onTouchStart={() => setHovering(true)}
        >
          {/* Handle lines and circles */}
          {anchors.map((anchor, i) => {
            const handleIn = getHandlePos(anchor, 'in');
            const handleOut = getHandlePos(anchor, 'out');
            const isFirst = i === 0;
            const isLast = i === anchors.length - 1;
            const isSelected = selectedAnchor === i;

            return (
              <g key={`handles-${i}`} style={{ opacity: showHandles ? 1 : 0, transition: 'opacity 0.2s' }}>
                {/* Handle lines */}
                {!isFirst && (
                  <line
                    x1={anchor.x}
                    y1={anchor.y}
                    x2={handleIn.x}
                    y2={handleIn.y}
                    stroke={colors.accentBlue}
                    strokeWidth="1"
                    opacity="0.6"
                  />
                )}
                {!isLast && (
                  <line
                    x1={anchor.x}
                    y1={anchor.y}
                    x2={handleOut.x}
                    y2={handleOut.y}
                    stroke={colors.accentBlue}
                    strokeWidth="1"
                    opacity="0.6"
                  />
                )}

                {/* Handle circles */}
                {!isFirst && (
                  <circle
                    cx={handleIn.x}
                    cy={handleIn.y}
                    r="5"
                    fill={colors.accentBlue}
                    style={{ cursor: 'grab' }}
                    onMouseDown={handleDragStart('handleIn', i)}
                    onTouchStart={handleDragStart('handleIn', i)}
                  />
                )}
                {!isLast && (
                  <circle
                    cx={handleOut.x}
                    cy={handleOut.y}
                    r="5"
                    fill={colors.accentBlue}
                    style={{ cursor: 'grab' }}
                    onMouseDown={handleDragStart('handleOut', i)}
                    onTouchStart={handleDragStart('handleOut', i)}
                  />
                )}
              </g>
            );
          })}

          {/* The bezier curve */}
          <path
            d={generatePath()}
            fill="none"
            stroke={colors.accentOrange}
            strokeWidth="2.5"
          />

          {/* Animated point on curve */}
          <circle cx={currentPoint.x} cy={currentPoint.y} r="6" fill="#fff" />

          {/* Anchor points */}
          {anchors.map((anchor, i) => {
            const isFirst = i === 0;
            const isLast = i === anchors.length - 1;
            const anchorColor = isFirst ? colors.accentOrange : isLast ? colors.accentPink : colors.success;

            return (
              <g key={`anchor-${i}`} style={{ opacity: showHandles ? 1 : 0, transition: 'opacity 0.2s' }}>
                {/* Selection ring */}
                {selectedAnchor === i && (
                  <circle
                    cx={anchor.x}
                    cy={anchor.y}
                    r="12"
                    fill="none"
                    stroke={anchorColor}
                    strokeWidth="2"
                    strokeDasharray="3"
                    opacity="0.6"
                  />
                )}
                {/* Anchor point (square for accuracy to Illustrator) */}
                <rect
                  x={anchor.x - 5}
                  y={anchor.y - 5}
                  width="10"
                  height="10"
                  fill="transparent"
                  stroke={anchorColor}
                  strokeWidth="2"
                  style={{ cursor: 'grab' }}
                  onMouseDown={handleDragStart('anchor', i)}
                  onTouchStart={(e) => {
                    if (!handleDoubleTap(i)) {
                      handleDragStart('anchor', i)(e);
                    }
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    resetHandles(i);
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Formula */}
      <div style={{
        background: colors.cardBackground,
        padding: '12px 20px',
        borderRadius: 12,
        marginBottom: 12,
        border: '1px solid rgba(255,154,0,0.3)',
        textAlign: 'center',
        width: '100%',
        maxWidth: 600
      }}>
        <div style={{ fontSize: 'clamp(11px, 2vw, 13px)', color: colors.textSecondary, marginBottom: 6 }}>
          Cubic Bézier Curve (used in Adobe Illustrator)
        </div>
        <code style={{
          color: colors.accentOrange,
          fontFamily: 'monospace',
          fontSize: 'clamp(10px, 2vw, 14px)',
          display: 'block'
        }}>
          B(t) = (1-t)³P₀ + 3(1-t)²tC₀ + 3(1-t)t²C₁ + t³P₁
        </code>
        <div style={{
          fontSize: 'clamp(10px, 1.8vw, 12px)',
          color: colors.textSecondary,
          marginTop: 8,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          flexWrap: 'wrap'
        }}>
          <span><span style={{ color: colors.accentOrange }}>■</span> P₀, P₁ = Anchor points</span>
          <span><span style={{ color: colors.accentBlue }}>●</span> C₀, C₁ = Control handles</span>
        </div>
      </div>

      {/* Info */}
      <div style={{
        background: colors.cardBackground,
        padding: '10px 20px',
        borderRadius: 12,
        marginBottom: 12,
        textAlign: 'center',
        width: '100%',
        maxWidth: 500
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
          fontSize: 'clamp(11px, 2.2vw, 13px)'
        }}>
          <span style={{ color: colors.textSecondary }}>
            Anchors: <span style={{ color: colors.accentOrange, fontWeight: 600 }}>{anchors.length}</span>
          </span>
          <span style={{ color: colors.textSecondary }}>
            t = <span style={{ color: '#fff', fontFamily: 'monospace' }}>{t.toFixed(2)}</span>
            {' → '}
            <span style={{ color: '#fff', fontFamily: 'monospace' }}>
              ({currentPoint.x.toFixed(0)}, {currentPoint.y.toFixed(0)})
            </span>
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        flexWrap: 'wrap'
      }}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={t}
          onChange={(e) => setT(parseFloat(e.target.value))}
          disabled={animating}
          style={{ width: 'min(140px, 28vw)', height: 8, accentColor: colors.accentOrange, cursor: 'pointer' }}
        />
        <button
          onClick={() => setAnimating(!animating)}
          style={{
            padding: '8px 14px',
            background: animating ? colors.accentPink : 'linear-gradient(135deg, #FF9A00, #FF3366)',
            border: 'none',
            borderRadius: 20,
            color: '#fff',
            fontWeight: 600,
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          {animating ? 'Stop' : 'Animate'}
        </button>
        {selectedAnchor !== null && anchors.length > 2 && (
          <button
            onClick={() => deleteAnchor(selectedAnchor)}
            style={{
              padding: '8px 14px',
              background: '#ff6b6b',
              border: 'none',
              borderRadius: 20,
              color: '#fff',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        )}
        <button
          onClick={resetAnchors}
          style={{
            padding: '8px 14px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 20,
            color: '#fff',
            fontWeight: 600,
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
