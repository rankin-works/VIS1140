import React from 'react';
import { colors, gradients, borderRadius } from '../styles/theme';

export default function ResourcesPage() {
  return (
    <div style={{
      maxWidth: 1000,
      margin: '0 auto',
      padding: '40px 24px'
    }}>
      {/* Page Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          fontWeight: 700,
          marginBottom: 12,
          background: gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Resources
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: colors.textSecondary
        }}>
          Reference materials, tutorials, and helpful links for your design journey.
        </p>
      </div>

      {/* Coming Soon State */}
      <div style={{
        background: colors.cardBackground,
        borderRadius: borderRadius.large,
        padding: '60px 40px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: 20
        }}>
          📚
        </div>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: colors.textPrimary,
          marginBottom: 12
        }}>
          Coming Soon
        </h2>
        <p style={{
          fontSize: '1rem',
          color: colors.textSecondary,
          maxWidth: 400,
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Helpful resources, tutorials, and reference materials will be added here throughout the course.
        </p>
      </div>
    </div>
  );
}
