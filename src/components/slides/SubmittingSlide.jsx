import React from 'react';
import { colors, gradients } from '../../styles/theme';
import indesignIcon from '../../assets/InDesign.svg';

const warnings = [
  { pts: 10, reason: 'Incorrect folder naming' },
  { pts: 10, reason: 'Not packaging InDesign project' }
];

export default function SubmittingSlide() {
  return (
    <div style={{ textAlign: 'center', maxWidth: 750 }}>
      <h2 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 32
      }}>
        Submitting Assignments
      </h2>
      <div style={{
        background: colors.cardBackground,
        padding: '24px 36px',
        borderRadius: 16,
        marginBottom: 28
      }}>
        <code style={{ fontFamily: 'monospace', fontSize: 18, color: colors.success }}>
          26-SP-1140-N02-LastName-FirstName-Assignment01.zip
        </code>
      </div>
      <div style={{ marginBottom: 32 }}>
        {warnings.map((w, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: 16,
            background: 'rgba(255,51,102,0.1)',
            borderRadius: 12,
            marginBottom: 10
          }}>
            <span style={{ color: colors.error, fontWeight: 700, fontSize: 28 }}>-{w.pts} points</span>
            <span style={{ color: colors.textSecondary, fontSize: 18 }}>{w.reason}</span>
          </div>
        ))}
      </div>
      <div style={{
        background: colors.cardBackground,
        padding: '16px 28px',
        borderRadius: 28,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 18
      }}>
        <img src={indesignIcon} alt="InDesign" style={{ width: 28, height: 28 }} /> Package via File → Package in InDesign
      </div>
    </div>
  );
}
