import React from 'react';
import { colors, gradients } from '../../styles/theme';

export default function TitleSlide() {
  return (
    <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: '0.4em',
        color: colors.accentOrange,
        marginBottom: 20
      }}>
        Introduction
      </div>
      <h1 style={{
        fontSize: 'clamp(5rem, 15vw, 10rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
        margin: 0
      }}>
        VIS1140
      </h1>
      <h2 style={{
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 400,
        color: colors.textSecondary,
        marginTop: 20
      }}>
        Design Processes I
      </h2>

    </div>
  );
}
