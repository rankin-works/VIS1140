import React from 'react';
import { colors, gradients } from '../../styles/theme';
import illustratorIcon from '../../assets/Illustrator.svg';
import photoshopIcon from '../../assets/Photoshop.svg';

export default function ComparisonSlide() {
  return (
    <div style={{ textAlign: 'center', width: '100%', maxWidth: 950 }}>
      <h2 style={{
        fontSize: 'clamp(1.8rem, 5vw, 4rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 8
      }}>
        Vector vs. Raster
      </h2>
      <p style={{ color: colors.textSecondary, fontSize: 'clamp(14px, 3vw, 24px)', marginBottom: 'clamp(20px, 4vw, 48px)' }}>
        Two fundamentally different ways to represent graphics
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(16px, 4vw, 60px)', flexWrap: 'wrap' }}>
        <div className="card-hover" style={{
          background: colors.cardBackground,
          padding: 'clamp(20px, 4vw, 40px) clamp(24px, 5vw, 56px)',
          borderRadius: 20,
          textAlign: 'center',
          minWidth: 140
        }}>
          <div>
            <img src={illustratorIcon} alt="Illustrator" style={{ width: 72, height: 72, borderRadius: 14, border: `2px solid ${colors.illustrator}` }} />
          </div>
          <div style={{ fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 600, marginBottom: 6 }}>Vector Graphics</div>
          <p style={{ color: colors.textSecondary, fontSize: 'clamp(13px, 2vw, 18px)', margin: 0 }}>Mathematical formulas used to create graphics, non-destructive, versatile and scalable.</p>
        </div>
        <div style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, color: '#ffffffff' }}>vs</div>
        <div className="card-hover" style={{
          background: colors.cardBackground,
          padding: 'clamp(20px, 4vw, 40px) clamp(24px, 5vw, 56px)',
          borderRadius: 20,
          textAlign: 'center',
          minWidth: 140
        }}>
          <div>
            <img src={photoshopIcon} alt="Photoshop" style={{ width: 72, height: 72, borderRadius: 14, border: `2px solid ${colors.photoshop}` }} />
          </div>
          <div style={{ fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 600, marginBottom: 6 }}>Raster Graphics</div>
          <p style={{ color: colors.textSecondary, fontSize: 'clamp(13px, 2vw, 18px)', margin: 0 }}>Pixels rendered on a grid, destructive, not as versatile or scalable, may require compression.</p>
        </div>
      </div>
    </div>
  );
}
