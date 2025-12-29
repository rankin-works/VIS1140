import React from 'react';
import { colors, gradients } from '../../styles/theme';
import photoshopIcon from '../../assets/Photoshop.svg';
import auroraImg from '../../assets/aurora.jpg';
import daytonNightImg from '../../assets/dayton_night.jpg';
import billboardImg from '../../assets/Billboard 2 day.png';

const items = [
  { title: 'Resolution', desc: 'Quality defined by DPI/PPI. Scaling causes pixelation' },
  { title: 'Detail', desc: 'Rich textures, gradients, complex colors' },
  { title: 'File Size', desc: "Larger files - each pixel's data stored" },
  { title: 'Best For', desc: 'Photos, illustrations, digital paintings' },
  { title: 'Formats', desc: 'JPEG, PNG, GIF, BMP, TIFF, PSD' }
];

const rasterImages = [
  { src: auroraImg, alt: 'Aurora' },
  { src: daytonNightImg, alt: 'Dayton Night' },
  { src: billboardImg, alt: 'Billboard' }
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

      {/* Raster image marquee */}
      <div style={{
        position: 'relative',
        marginTop: 'clamp(24px, 4vw, 40px)',
        overflow: 'hidden',
        width: '100%',
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }}>
        <div style={{
          display: 'flex',
          animation: 'rasterMarquee 25s linear infinite',
          width: 'fit-content'
        }}>
          {/* Two identical sets for seamless loop */}
          {[0, 1].map((setIndex) => (
            <div
              key={setIndex}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(20px, 4vw, 40px)',
                paddingRight: 'clamp(20px, 4vw, 40px)'
              }}
            >
              {rasterImages.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={img.alt}
                  style={{
                    height: 'clamp(160px, 30vw, 240px)',
                    width: 'auto',
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                    flexShrink: 0
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes rasterMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </div>
  );
}
