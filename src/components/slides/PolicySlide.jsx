import React from 'react';
import { colors, gradients } from '../../styles/theme';

export default function PolicySlide() {
  return (
    <div style={{ maxWidth: 700, width: '100%' }}>
      <h2 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 32,
        textAlign: 'center'
      }}>
        AI Policy
      </h2>
      <div style={{
        display: 'flex',
        gap: 16,
        background: 'rgba(255,51,102,0.1)',
        border: `2px solid ${colors.error}`,
        padding: 28,
        borderRadius: 16,
        marginBottom: 16,
        alignItems: 'flex-start'
      }}>
        <span style={{ fontSize: 32 }}>🚫</span>
        <p style={{ margin: 0, fontSize: 20 }}>
          Generative AI may NOT be used for generating any graphics or visual imagery that you submit for a grade.
        </p>
      </div>
      <div style={{
        background: colors.error,
        color: '#fff',
        padding: '18px 28px',
        borderRadius: 12,
        fontWeight: 600,
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 21
      }}>
        Submitting AI generated imagery for a grade = automatic zero
      </div>
      <div style={{
        display: 'flex',
        gap: 16,
        background: 'rgba(0,255,136,0.1)',
        border: `2px solid ${colors.success}`,
        padding: 28,
        borderRadius: 16,
        alignItems: 'flex-start'
      }}>
        <span style={{ fontSize: 32 }}>✅</span>
        <div>
          <p style={{ fontWeight: 600, margin: '0 0 12px', fontSize: 20 }}>Acceptable uses:</p>
          <ul style={{ color: colors.textSecondary, margin: 0, paddingLeft: 24, fontSize: 18, lineHeight: 1.8 }}>
            <li>ChatGPT or equivalent LLM for lists, brainstorming, and guidance.</li>
            <li>Generative fill in Photoshop is okay as an alternative to context-aware fill.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
