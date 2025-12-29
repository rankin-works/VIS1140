import { useState, useEffect, useRef, useCallback } from 'react';
import { colors } from '../../styles/theme';

const initialSvg = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 512 512"><path d="M501.8 261.8c0-18.2-1.6-35.6-4.7-52.4H256v99.1h137.8c-6.1 31.9-24.2 58.9-51.4 77V450h83.1c48.3-44.6 76.3-110.2 76.3-188.2" style="fill:#4285f4"/><path d="M256 512c69.1 0 127.1-22.8 169.4-61.9l-83.1-64.5c-22.8 15.4-51.9 24.7-86.3 24.7-66.6 0-123.1-44.9-143.4-105.4H27.5V371C69.6 454.5 155.9 512 256 512" style="fill:#34a853"/><path d="M112.6 304.6c-5.1-15.4-8.1-31.7-8.1-48.6s3-33.3 8.1-48.6v-66.1H27.5C10 175.7 0 214.6 0 256s10 80.3 27.5 114.7L93.8 319c0 .1 18.8-14.4 18.8-14.4" style="fill:#fbbc05"/><path d="M256 101.9c37.7 0 71.2 13 98 38.2l73.3-73.3C382.8 25.4 325.1 0 256 0 155.9 0 69.6 57.5 27.5 141.3l85.2 66.1c20.2-60.5 76.7-105.5 143.3-105.5" style="fill:#ea4335"/><path d="M0 0h512v512H0z" style="fill:none"/></svg>`;

// Syntax highlighting colors (VSCode-like dark theme)
const syntaxColors = {
  tag: '#569cd6',
  attrName: '#9cdcfe',
  attrValue: '#ce9178',
  punctuation: '#808080',
  text: '#d4d4d4'
};

// Syntax highlighter for SVG/XML
const highlightSvg = (code) => {
  const result = [];
  let i = 0;
  let key = 0;

  while (i < code.length) {
    if (code[i] === '<') {
      let j = i;
      if (code[j + 1] === '/') {
        const tagMatch = code.slice(j).match(/^<\/([a-zA-Z0-9-]+)>/);
        if (tagMatch) {
          result.push(<span key={key++} style={{ color: syntaxColors.punctuation }}>&lt;/</span>);
          result.push(<span key={key++} style={{ color: syntaxColors.tag }}>{tagMatch[1]}</span>);
          result.push(<span key={key++} style={{ color: syntaxColors.punctuation }}>&gt;</span>);
          i += tagMatch[0].length;
          continue;
        }
      }
      const openTagMatch = code.slice(j).match(/^<([a-zA-Z0-9-]+)/);
      if (openTagMatch) {
        result.push(<span key={key++} style={{ color: syntaxColors.punctuation }}>&lt;</span>);
        result.push(<span key={key++} style={{ color: syntaxColors.tag }}>{openTagMatch[1]}</span>);
        i += openTagMatch[0].length;
        while (i < code.length && code[i] !== '>' && !(code[i] === '/' && code[i + 1] === '>')) {
          if (/\s/.test(code[i])) {
            result.push(<span key={key++} style={{ color: syntaxColors.text }}>{code[i]}</span>);
            i++;
            continue;
          }
          const attrNameMatch = code.slice(i).match(/^([a-zA-Z0-9-:]+)/);
          if (attrNameMatch) {
            result.push(<span key={key++} style={{ color: syntaxColors.attrName }}>{attrNameMatch[1]}</span>);
            i += attrNameMatch[1].length;
            if (code[i] === '=') {
              result.push(<span key={key++} style={{ color: syntaxColors.punctuation }}>=</span>);
              i++;
              if (code[i] === '"' || code[i] === "'") {
                const quote = code[i];
                let valueEnd = i + 1;
                while (valueEnd < code.length && code[valueEnd] !== quote) valueEnd++;
                result.push(<span key={key++} style={{ color: syntaxColors.attrValue }}>{code.slice(i, valueEnd + 1)}</span>);
                i = valueEnd + 1;
              }
            }
            continue;
          }
          i++;
        }
        if (code[i] === '/' && code[i + 1] === '>') {
          result.push(<span key={key++} style={{ color: syntaxColors.punctuation }}>/&gt;</span>);
          i += 2;
        } else if (code[i] === '>') {
          result.push(<span key={key++} style={{ color: syntaxColors.punctuation }}>&gt;</span>);
          i++;
        }
        continue;
      }
    }
    result.push(<span key={key++} style={{ color: syntaxColors.text }}>{code[i]}</span>);
    i++;
  }
  return result;
};

// Parse SVG code to extract paths
const parseSvgPaths = (svgCode) => {
  const paths = [];
  const pathRegex = /<path\s+([^>]*)\/>/g;
  let match;
  let index = 0;

  while ((match = pathRegex.exec(svgCode)) !== null) {
    const attrs = match[1];
    const dMatch = attrs.match(/d="([^"]*)"/);
    const styleMatch = attrs.match(/style="([^"]*)"/);
    const fillMatch = styleMatch?.[1]?.match(/fill:([^;"]*)/);

    if (dMatch && fillMatch && fillMatch[1] !== 'none') {
      paths.push({
        id: index,
        d: dMatch[1],
        fill: fillMatch[1],
        transform: { x: 0, y: 0, scale: 1 }
      });
      index++;
    }
  }
  return paths;
};

// Regenerate SVG code from paths
const generateSvgCode = (paths, useStrokes = false, strokeWidth = 8) => {
  const pathStrings = paths.map(p => {
    const transform = p.transform.x !== 0 || p.transform.y !== 0 || p.transform.scale !== 1
      ? ` transform="translate(${p.transform.x}, ${p.transform.y}) scale(${p.transform.scale})"`
      : '';
    const style = useStrokes
      ? `fill:none;stroke:${p.fill};stroke-width:${strokeWidth}`
      : `fill:${p.fill}`;
    return `<path d="${p.d}" style="${style}"${transform}/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 512 512">${pathStrings}<path d="M0 0h512v512H0z" style="fill:none"/></svg>`;
};

const defaultColors = {
  blue: '#4285f4',
  green: '#34a853',
  yellow: '#fbbc05',
  red: '#ea4335'
};

// Collapsible panel component
const CollapsiblePanel = ({ title, isOpen, onToggle, children }) => (
  <div style={{ background: colors.cardBackground, borderRadius: 16, overflow: 'hidden' }}>
    <button
      onClick={onToggle}
      style={{
        width: '100%', padding: '12px 16px', background: 'transparent', border: 'none',
        borderBottom: isOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
        color: colors.textSecondary, fontSize: 12, textTransform: 'uppercase',
        letterSpacing: '0.1em', cursor: 'pointer', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}
    >
      <span>{title}</span>
      <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>▼</span>
    </button>
    <div style={{ maxHeight: isOpen ? 500 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease', padding: isOpen ? 16 : '0 16px' }}>
      {children}
    </div>
  </div>
);

export default function SVGEditorDemo() {
  const [paths, setPaths] = useState([]);
  const [svgCode, setSvgCode] = useState('');
  const [displayedCode, setDisplayedCode] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);
  const [svgColors, setSvgColors] = useState(defaultColors);
  const [selectedPath, setSelectedPath] = useState(null);
  const [boundingBox, setBoundingBox] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState(null); // 'move' or 'scale-corner'
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [useStrokes, setUseStrokes] = useState(false);
  const [strokeWidth, setStrokeWidth] = useState(8);

  const svgRef = useRef(null);
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const animationRef = useRef(null);

  // Panel states
  const [isMobile, setIsMobile] = useState(false);
  const [codeOpen, setCodeOpen] = useState(true);
  const [colorsOpen, setColorsOpen] = useState(true);
  const [transformOpen, setTransformOpen] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCodeOpen(false);
        setColorsOpen(false);
        setTransformOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Typewriter animation effect
  useEffect(() => {
    if (!isAnimating) return;

    let currentIndex = 0;
    const charsPerFrame = 3; // Characters to add per frame
    const frameDelay = 25; // Slower typing speed

    const animate = () => {
      currentIndex += charsPerFrame;
      const partialCode = initialSvg.slice(0, currentIndex);
      setDisplayedCode(partialCode);

      // Parse and update paths as code is typed
      const partialPaths = parseSvgPaths(partialCode);
      if (partialPaths.length > 0) {
        setPaths(partialPaths);
      }

      if (currentIndex < initialSvg.length) {
        animationRef.current = setTimeout(animate, frameDelay);
      } else {
        // Animation complete
        setDisplayedCode(initialSvg);
        setSvgCode(initialSvg);
        setPaths(parseSvgPaths(initialSvg));
        setIsAnimating(false);
      }
    };

    // Start animation after a brief delay
    animationRef.current = setTimeout(animate, 500);

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isAnimating]);

  // Auto-scroll code panel during animation
  useEffect(() => {
    if (isAnimating && preRef.current) {
      preRef.current.scrollTop = preRef.current.scrollHeight;
    }
  }, [displayedCode, isAnimating]);

  // Update SVG code when paths or stroke settings change (only when not animating)
  useEffect(() => {
    if (isAnimating) return;
    const newCode = generateSvgCode(paths, useStrokes, strokeWidth);
    setSvgCode(newCode);
    setDisplayedCode(newCode);
  }, [paths, useStrokes, strokeWidth, isAnimating]);

  // Calculate bounding box for selected path
  useEffect(() => {
    if (selectedPath !== null && svgRef.current) {
      const pathElements = svgRef.current.querySelectorAll('path[data-selectable="true"]');
      const pathEl = pathElements[selectedPath];
      if (pathEl) {
        const bbox = pathEl.getBBox();
        const path = paths[selectedPath];
        const scale = path.transform.scale;
        setBoundingBox({
          x: bbox.x * scale + path.transform.x,
          y: bbox.y * scale + path.transform.y,
          width: bbox.width * scale,
          height: bbox.height * scale
        });
      }
    } else {
      setBoundingBox(null);
    }
  }, [selectedPath, paths]);

  const handleSvgClick = (e) => {
    if (e.target === svgRef.current || e.target.tagName === 'svg') {
      setSelectedPath(null);
    }
  };

  const getSvgPoint = useCallback((e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    // Handle pointer, mouse, or touch events
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    // ViewBox is -256 -256 1024 1024, so we map to that coordinate space
    return {
      x: ((clientX - rect.left) / rect.width) * 1024 - 256,
      y: ((clientY - rect.top) / rect.height) * 1024 - 256
    };
  }, []);

  // Handle pointer down on path - select and start drag (works for mouse and touch)
  const handlePathPointerDown = useCallback((index, e) => {
    e.preventDefault();
    e.stopPropagation();

    // Capture pointer for reliable tracking
    e.target.setPointerCapture(e.pointerId);

    // Always select the path
    setSelectedPath(index);

    // Start drag for moving
    setIsDragging(true);
    setDragType('move');
    setDragStart(getSvgPoint(e));
  }, [getSvgPoint]);

  // Handle mousedown on scale handles
  const handleScaleStart = useCallback((type) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragType(type);
    setDragStart(getSvgPoint(e));
  }, [getSvgPoint]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging || selectedPath === null) return;
    const currentPoint = getSvgPoint(e);
    const dx = currentPoint.x - dragStart.x;
    const dy = currentPoint.y - dragStart.y;

    setPaths(prev => prev.map((p, i) => {
      if (i !== selectedPath) return p;
      if (dragType === 'move') {
        return { ...p, transform: { ...p.transform, x: p.transform.x + dx, y: p.transform.y + dy } };
      } else if (dragType?.startsWith('scale') && boundingBox) {
        const scaleFactor = 1 + (dx + dy) / 500;
        const oldScale = p.transform.scale;
        const newScale = Math.max(0.1, Math.min(3, oldScale * scaleFactor));

        // Calculate center of bounding box in original coordinates
        const centerX = boundingBox.x + boundingBox.width / 2;
        const centerY = boundingBox.y + boundingBox.height / 2;

        // Adjust translation to keep center fixed
        const scaleRatio = newScale / oldScale;
        const newX = centerX - (centerX - p.transform.x) * scaleRatio;
        const newY = centerY - (centerY - p.transform.y) * scaleRatio;

        return { ...p, transform: { x: newX, y: newY, scale: newScale } };
      }
      return p;
    }));
    setDragStart(currentPoint);
  }, [isDragging, selectedPath, dragStart, dragType, getSvgPoint, boundingBox]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragType(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      const handlePointerMoveWithPrevent = (e) => {
        e.preventDefault();
        handleDragMove(e);
      };
      window.addEventListener('pointermove', handlePointerMoveWithPrevent, { passive: false });
      window.addEventListener('pointerup', handleDragEnd);
      window.addEventListener('pointercancel', handleDragEnd);
      return () => {
        window.removeEventListener('pointermove', handlePointerMoveWithPrevent);
        window.removeEventListener('pointerup', handleDragEnd);
        window.removeEventListener('pointercancel', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const handleCodeChange = (newCode) => {
    setSvgCode(newCode);
    const newPaths = parseSvgPaths(newCode);
    if (newPaths.length > 0) {
      setPaths(newPaths);
    }
  };

  const handleColorChange = (colorKey, value) => {
    const colorMap = { blue: 0, green: 1, yellow: 2, red: 3 };
    const pathIndex = colorMap[colorKey];
    setSvgColors(prev => ({ ...prev, [colorKey]: value }));
    setPaths(prev => prev.map((p, i) => i === pathIndex ? { ...p, fill: value } : p));
  };

  const inputStyle = {
    background: '#12121a', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6, color: '#fff', padding: '8px 12px', fontSize: 14, width: 70, textAlign: 'center'
  };
  const labelStyle = { color: colors.textSecondary, fontSize: 13, marginRight: 12 };

  // Handle for bounding box corners
  const Handle = ({ position, onDrag }) => {
    const handleSize = isMobile ? 28 : 14;
    const offset = -(handleSize / 2);
    const positions = {
      'nw': { left: offset, top: offset, cursor: 'nwse-resize' },
      'ne': { right: offset, top: offset, cursor: 'nesw-resize' },
      'sw': { left: offset, bottom: offset, cursor: 'nesw-resize' },
      'se': { right: offset, bottom: offset, cursor: 'nwse-resize' }
    };
    return (
      <div
        onPointerDown={onDrag}
        style={{
          position: 'absolute', ...positions[position],
          width: handleSize, height: handleSize, background: '#fff', border: '2px solid #00bcd4',
          borderRadius: isMobile ? 6 : 2, cursor: positions[position].cursor, zIndex: 10,
          pointerEvents: 'auto', touchAction: 'none'
        }}
      />
    );
  };

  return (
    <div style={{ display: 'flex', gap: 24, width: '100%', maxWidth: 1100, flexWrap: 'wrap' }}>
      {/* SVG Preview with interactive paths */}
      <div
        style={{
          flex: isMobile ? '1 1 100%' : '1 1 300px',
          minWidth: isMobile ? 'auto' : 280,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: colors.cardBackground, borderRadius: 16,
          padding: isMobile ? 16 : 24, minHeight: isMobile ? 200 : 350,
          order: isMobile ? -1 : 0, position: 'relative',
          overflow: 'visible',
          touchAction: 'none'
        }}
      >
        <svg
          ref={svgRef}
          viewBox="-256 -256 1024 1024"
          onClick={handleSvgClick}
          style={{ width: isMobile ? '80%' : '100%', maxWidth: isMobile ? 250 : 350, cursor: 'default', overflow: 'visible' }}
        >
          {paths.map((path, i) => (
            <path
              key={i}
              d={path.d}
              fill={useStrokes ? 'transparent' : path.fill}
              stroke={useStrokes ? path.fill : (selectedPath === i ? '#00bcd4' : 'none')}
              strokeWidth={useStrokes ? strokeWidth : (selectedPath === i ? 4 : 0)}
              data-selectable="true"
              transform={`translate(${path.transform.x}, ${path.transform.y}) scale(${path.transform.scale})`}
              onPointerDown={(e) => handlePathPointerDown(i, e)}
              style={{
                cursor: 'pointer',
                touchAction: 'none',
                filter: selectedPath === i ? 'drop-shadow(0 0 8px rgba(0,188,212,0.5))' : 'none',
                ...(selectedPath === i && useStrokes ? { strokeDasharray: '12 4' } : {})
              }}
            />
          ))}
          <path d="M0 0h512v512H0z" fill="none" />

          {/* Bounding box overlay */}
          {boundingBox && selectedPath !== null && (
            <g pointerEvents="none">
              <rect
                x={boundingBox.x} y={boundingBox.y}
                width={boundingBox.width} height={boundingBox.height}
                fill="none" stroke="#00bcd4" strokeWidth="2" strokeDasharray="8 4"
                pointerEvents="none"
              />
            </g>
          )}
        </svg>

        {/* Corner handles (rendered outside SVG for better interaction) */}
        {boundingBox && selectedPath !== null && svgRef.current && (
          <div style={{
            position: 'absolute',
            left: svgRef.current.getBoundingClientRect().left - svgRef.current.parentElement.getBoundingClientRect().left + ((boundingBox.x + 256) / 1024) * svgRef.current.getBoundingClientRect().width,
            top: svgRef.current.getBoundingClientRect().top - svgRef.current.parentElement.getBoundingClientRect().top + ((boundingBox.y + 256) / 1024) * svgRef.current.getBoundingClientRect().height,
            width: (boundingBox.width / 1024) * svgRef.current.getBoundingClientRect().width,
            height: (boundingBox.height / 1024) * svgRef.current.getBoundingClientRect().height,
            pointerEvents: 'none'
          }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
              <Handle position="nw" onDrag={handleScaleStart('scale-nw')} />
              <Handle position="ne" onDrag={handleScaleStart('scale-ne')} />
              <Handle position="sw" onDrag={handleScaleStart('scale-sw')} />
              <Handle position="se" onDrag={handleScaleStart('scale-se')} />
            </div>
          </div>
        )}

        {selectedPath !== null && (
          <div style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,188,212,0.9)', padding: '4px 12px', borderRadius: 12,
            fontSize: 11, color: '#fff', whiteSpace: 'nowrap'
          }}>
            Click & drag to move • Corner handles to scale
          </div>
        )}
      </div>

      {/* Right side - Code and Controls */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CollapsiblePanel title="SVG Code" isOpen={codeOpen} onToggle={() => setCodeOpen(!codeOpen)}>
          <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: 8, overflow: 'hidden' }}>
            <pre ref={preRef} style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, margin: 0, padding: 12,
              background: '#0d0d12', fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
              fontSize: 12, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordWrap: 'break-word',
              overflow: 'auto', pointerEvents: 'none', zIndex: 1, boxSizing: 'border-box'
            }}>
              <code>{highlightSvg(displayedCode)}</code>
              {isAnimating && <span style={{ opacity: 0.7 }}>▋</span>}
            </pre>
            <textarea
              ref={textareaRef} value={svgCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              onScroll={handleScroll}
              disabled={isAnimating}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                background: 'transparent', border: 'none', borderRadius: 8,
                color: 'transparent', caretColor: '#fff',
                fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
                fontSize: 12, padding: 12, resize: 'none', lineHeight: 1.5, outline: 'none',
                whiteSpace: 'pre-wrap', wordWrap: 'break-word', overflow: 'auto',
                zIndex: isAnimating ? 0 : 2, boxSizing: 'border-box',
                opacity: isAnimating ? 0 : 1
              }}
              spellCheck={false}
            />
          </div>
        </CollapsiblePanel>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 180px' }}>
            <CollapsiblePanel title="Colors" isOpen={colorsOpen} onToggle={() => setColorsOpen(!colorsOpen)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(svgColors).map(([key, color]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input type="color" value={color} onChange={(e) => handleColorChange(key, e.target.value)}
                      style={{ width: 36, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent' }} />
                    <input type="text" value={color} onChange={(e) => handleColorChange(key, e.target.value)}
                      style={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
                        color: '#fff', padding: '8px 12px', fontSize: 14, width: 90, fontFamily: 'monospace' }} />
                  </div>
                ))}

                {/* Fill/Stroke Toggle */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12, marginTop: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ color: colors.textSecondary, fontSize: 13 }}>Stroke Mode</span>
                    <button
                      onClick={() => setUseStrokes(!useStrokes)}
                      style={{
                        padding: '6px 14px',
                        background: useStrokes ? colors.accentOrange : 'rgba(255,255,255,0.1)',
                        border: useStrokes ? 'none' : '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 16,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {useStrokes ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  {useStrokes && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: colors.textSecondary, fontSize: 13 }}>Width</span>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={strokeWidth}
                        onChange={(e) => setStrokeWidth(Number(e.target.value))}
                        style={{ flex: 1, accentColor: colors.accentOrange }}
                      />
                      <span style={{ color: '#fff', fontSize: 13, minWidth: 24 }}>{strokeWidth}</span>
                    </div>
                  )}
                </div>
              </div>
            </CollapsiblePanel>
          </div>

          <div style={{ flex: '1 1 220px' }}>
            <CollapsiblePanel title={selectedPath !== null ? `Path ${selectedPath + 1} Transform` : "Transform & Scale"} isOpen={transformOpen} onToggle={() => setTransformOpen(!transformOpen)}>
              {selectedPath !== null ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={labelStyle}>Scale</span>
                    <input type="number" step="0.1"
                      value={paths[selectedPath]?.transform.scale.toFixed(2) || 1}
                      onChange={(e) => setPaths(prev => prev.map((p, i) =>
                        i === selectedPath ? { ...p, transform: { ...p.transform, scale: Number(e.target.value) } } : p
                      ))}
                      min={0.1} max={3} style={inputStyle} />
                    <span style={{ color: colors.textSecondary, marginLeft: 4, fontSize: 13 }}>x</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <span style={labelStyle}>Position</span>
                    <input type="number"
                      value={Math.round(paths[selectedPath]?.transform.x || 0)}
                      onChange={(e) => setPaths(prev => prev.map((p, i) =>
                        i === selectedPath ? { ...p, transform: { ...p.transform, x: Number(e.target.value) } } : p
                      ))}
                      style={{ ...inputStyle, width: 55 }} placeholder="X" />
                    <input type="number"
                      value={Math.round(paths[selectedPath]?.transform.y || 0)}
                      onChange={(e) => setPaths(prev => prev.map((p, i) =>
                        i === selectedPath ? { ...p, transform: { ...p.transform, y: Number(e.target.value) } } : p
                      ))}
                      style={{ ...inputStyle, width: 55 }} placeholder="Y" />
                  </div>
                  <button
                    onClick={() => setPaths(prev => prev.map((p, i) =>
                      i === selectedPath ? { ...p, transform: { x: 0, y: 0, scale: 1 } } : p
                    ))}
                    style={{
                      padding: '8px 16px', background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8,
                      color: '#fff', cursor: 'pointer', fontSize: 12
                    }}
                  >
                    Reset Transform
                  </button>
                </div>
              ) : (
                <div style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center', padding: 20 }}>
                  Click on a path in the SVG to select it and edit its transform
                </div>
              )}
            </CollapsiblePanel>
          </div>
        </div>
      </div>
    </div>
  );
}
