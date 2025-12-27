import React from 'react';
import { colors, gradients } from '../../styles/theme';

export default function CritiqueSlide() {
  return (
    <div style={{ textAlign: 'center', maxWidth: 900 }}>
      <h2 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 40
      }}>
        Class Critique
      </h2>
      <blockquote style={{
        fontSize: 40,
        fontStyle: 'italic',
        color: colors.accentOrange,
        margin: '0 0 32px'
      }}>
        "Design is an iterative process."
      </blockquote>
      <p style={{
        color: colors.textSecondary,
        fontSize: 22,
        lineHeight: 1.7,
        marginBottom: 32
      }}>
        At each step, we subject our solutions to critiques for insight on ways to improve.
      </p>
      <p style={{ fontWeight: 600, fontSize: 26 }}>
        Critique is necessary for growth as a designer. Embrace it!
      </p>
    </div>
  );
}
