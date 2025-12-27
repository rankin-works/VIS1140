import React from 'react';
import { colors, gradients } from '../../styles/theme';
import creativeCloudIcon from '../../assets/Creative Cloud.svg';
import illustratorIcon from '../../assets/Illustrator.svg';
import photoshopIcon from '../../assets/Photoshop.svg';
import indesignIcon from '../../assets/InDesign.svg';

const tools = [
  { name: 'Illustrator', icon: illustratorIcon, desc: 'Vector graphics. Resolution independent. Perfect for logos.' },
  { name: 'Photoshop', icon: photoshopIcon, desc: 'Photo editing. Raster based, resolution dependent.' },
  { name: 'InDesign', icon: indesignIcon, desc: 'Page layout. Books, flyers, brochures.' }
];

export default function ToolsSlide() {
  return (
    <div style={{ width: '100%', maxWidth: 1100 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(12px, 2vw, 20px)',
        marginBottom: 'clamp(16px, 4vw, 48px)'
      }}>
        <img
          src={creativeCloudIcon}
          alt="Creative Cloud"
          style={{ width: 'clamp(40px, 6vw, 60px)', height: 'clamp(40px, 6vw, 60px)' }}
        />
        <h2 style={{
          fontSize: 'clamp(1.6rem, 4vw, 3.2rem)',
          fontWeight: 700,
          background: gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          Adobe Creative Cloud
        </h2>
      </div>
      <div className="grid-3-cols">
        {tools.map((t, i) => (
          <div key={i} className="card-hover" style={{
            background: colors.cardBackground,
            padding: 'clamp(16px, 3vw, 36px)',
            borderRadius: 16,
            textAlign: 'center'
          }}>
            <img
              src={t.icon}
              alt={t.name}
              style={{
                width: 'clamp(56px, 10vw, 100px)',
                height: 'clamp(56px, 10vw, 100px)',
                borderRadius: 12,
                margin: '0 auto clamp(12px, 2vw, 24px)',
                display: 'block'
              }}
            />
            <h3 style={{ margin: '0 0 8px', fontSize: 'clamp(18px, 3vw, 28px)' }}>{t.name}</h3>
            <p style={{ color: colors.textSecondary, fontSize: 'clamp(14px, 2vw, 18px)', margin: 0, lineHeight: 1.5 }}>{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
