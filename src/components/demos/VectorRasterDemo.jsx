import React, { useState } from 'react';
import { colors } from '../../styles/theme';

// Import local assets
import catSvg from '../../assets/vector_cat_example.svg';
import catPng from '../../assets/vector_cat_example.png';
import illustratorIcon from '../../assets/Illustrator.svg';
import photoshopIcon from '../../assets/Photoshop.svg';

export default function VectorRasterDemo() {
  const [zoom, setZoom] = useState(1);

  const Panel = ({ type, icon, bgColor, src, alt, label, labelColor, labelBg, extensions }) => (
    <div style={{
      background: colors.cardBackground,
      borderRadius: 16,
      padding: 'clamp(12px, 2vw, 24px)',
      border: '1px solid rgba(255,255,255,0.1)',
      flex: 1,
      minWidth: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <img
          src={icon}
          alt={type}
          style={{
            width: 'clamp(32px, 5vw, 44px)',
            height: 'clamp(32px, 5vw, 44px)',
            borderRadius: 8,
            border: `2px solid ${bgColor}`
          }}
        />
        <div>
          <span style={{ fontWeight: 600, fontSize: 'clamp(16px, 2.5vw, 22px)', display: 'block' }}>{type}</span>
          <span style={{ color: bgColor, fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 500 }}>{extensions}</span>
        </div>
      </div>
      <div style={{
        height: 'clamp(200px, 30vw, 380px)',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.15s ease-out'
        }}>
          <img
            src={src}
            alt={alt}
            style={{
              display: 'block',
              width: 'clamp(140px, 22vw, 280px)',
              height: 'auto',
              imageRendering: type === 'Raster' && zoom > 2.5 ? 'pixelated' : 'auto'
            }}
          />
        </div>
      </div>
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <span style={{
          background: labelBg,
          color: labelColor,
          padding: '8px 16px',
          borderRadius: 20,
          fontSize: 'clamp(11px, 1.8vw, 15px)',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          display: 'inline-block'
        }}>
          {label}
        </span>
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }}>
      {/* Panels container */}
      <div className="demo-panels" style={{
        display: 'flex',
        gap: 'clamp(16px, 3vw, 32px)',
        width: '100%',
        marginBottom: 16
      }}>
        <Panel
          type="Vector"
          icon={illustratorIcon}
          bgColor={colors.illustrator}
          src={catSvg}
          alt="Vector cat"
          label="Perfect at any zoom"
          labelColor={colors.success}
          labelBg="rgba(0,255,136,0.2)"
          extensions=".svg .ai .eps .pdf"
        />
        <Panel
          type="Raster"
          icon={photoshopIcon}
          bgColor={colors.photoshop}
          src={catPng}
          alt="Raster cat"
          label={zoom > 3 ? 'Pixelated!' : zoom > 2 ? 'Getting blocky...' : 'Decent, but not perfect'}
          labelColor={zoom > 3 ? colors.error : zoom > 2 ? colors.warning : colors.success}
          labelBg={zoom > 3 ? 'rgba(255,51,102,0.2)' : zoom > 2 ? 'rgba(255,154,0,0.2)' : 'rgba(0,255,136,0.2)'}
          extensions=".jpg .png .gif .psd"
        />
      </div>
      {/* Single slider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: '12px 0',
        width: '100%'
      }}>
        <span style={{
          color: colors.textSecondary,
          fontSize: 'clamp(14px, 2vw, 18px)',
          fontWeight: 600
        }}>
          Zoom: {zoom.toFixed(1)}x
        </span>
        <input
          type="range"
          min="1"
          max="6"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          style={{ width: 'min(300px, 50vw)', height: 8, accentColor: colors.accentOrange, cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
