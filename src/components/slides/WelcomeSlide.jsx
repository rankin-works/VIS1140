import React from 'react';
import { colors, gradients } from '../../styles/theme';
import avatarImg from '../../assets/IMG_3765.jpeg';

export default function WelcomeSlide() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{
        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 48
      }}>
        Welcome!
      </h2>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        background: colors.cardBackground,
        padding: '36px 48px',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <img
          src={avatarImg}
          alt="Jacob Rankin"
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
            border: '3px solid',
            borderColor: colors.accentOrange
          }}
        />
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: 32, margin: 0 }}>Jacob Rankin</h3>
          <p style={{ color: colors.accentOrange, fontWeight: 600, margin: '8px 0', fontSize: 20 }}>
            Adjunct Faculty
          </p>
          <p style={{ color: colors.textSecondary, margin: '4px 0', fontSize: 18 }}>
            Visual Communications Alumni
          </p>
          <p style={{ color: colors.textSecondary, margin: '4px 0', fontSize: 18 }}>
            Videographer, Editor & Motion Designer
          </p>
        </div>
      </div>
    </div>
  );
}
