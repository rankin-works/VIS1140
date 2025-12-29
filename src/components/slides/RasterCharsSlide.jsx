import React from 'react';
import { colors, gradients } from '../../styles/theme';
import photoshopIcon from '../../assets/Photoshop.svg';

const items = [
  { title: 'Resolution', desc: 'Quality defined by DPI/PPI. Scaling causes pixelation' },
  { title: 'Detail', desc: 'Rich textures, gradients, complex colors' },
  { title: 'File Size', desc: "Larger files - each pixel's data stored" },
  { title: 'Best For', desc: 'Photos, illustrations, digital paintings' },
  { title: 'Formats', desc: 'JPEG, PNG, GIF, BMP, TIFF, PSD' }
];

export default function RasterCharsSlide() {
  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 20px)', marginBottom: 'clamp(16px, 3vw, 36px)' }}>
        <div>
        <img src={photoshopIcon} alt="Photoshop" style={{ width: 72, height: 72, borderRadius: 14, border: `2px solid ${colors.photoshop}` }} />
        </div>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 3.2rem)',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #31A8FF, #FF3366)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          Raster Images
        </h2>
      </div>
      <div className="grid-2-cols">
        {items.map((item, i) => (
          <div key={i} className="card-hover" style={{
            background: colors.cardBackground,
            padding: 'clamp(14px, 2.5vw, 28px)',
            borderRadius: 14
          }}>
            <h4 style={{ color: colors.photoshop, margin: '0 0 8px', fontSize: 'clamp(16px, 2.5vw, 22px)' }}>{item.title}</h4>
            <p style={{ color: colors.textSecondary, margin: 0, fontSize: 'clamp(13px, 2vw, 18px)', lineHeight: 1.4 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
