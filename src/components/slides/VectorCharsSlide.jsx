import React from 'react';
import { colors, gradients } from '../../styles/theme';
import illustratorIcon from '../../assets/Illustrator.svg';

const items = [
  { title: 'Scalability', desc: 'Scale infinitely without losing quality' },
  { title: 'File Size', desc: 'Smaller files - stores only math data' },
  { title: 'Editability', desc: 'Manipulate paths and anchor points' },
  { title: 'Best For', desc: 'Logos, icons, typography, motion design' },
  { title: 'Formats', desc: 'SVG, AI, EPS, PDF' }
];

export default function VectorCharsSlide() {
  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 20px)', marginBottom: 'clamp(16px, 3vw, 36px)' }}>
        <div>
          <img src={illustratorIcon} alt="Illustrator" style={{ width: 72, height: 72, borderRadius: 14, border: `2px solid ${colors.illustrator}` }} />
        </div>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 3.2rem)',
          fontWeight: 700,
          background: gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          Vector Graphics
        </h2>
      </div>
      <div className="grid-2-cols">
        {items.map((item, i) => (
          <div key={i} className="card-hover" style={{
            background: colors.cardBackground,
            padding: 'clamp(14px, 2.5vw, 28px)',
            borderRadius: 14
          }}>
            <h4 style={{ color: colors.illustrator, margin: '0 0 8px', fontSize: 'clamp(16px, 2.5vw, 22px)' }}>{item.title}</h4>
            <p style={{ color: colors.textSecondary, margin: 0, fontSize: 'clamp(13px, 2vw, 18px)', lineHeight: 1.4 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
