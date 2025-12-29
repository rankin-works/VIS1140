import React, { useState } from 'react';
import { colors, gradients } from '../../styles/theme';
import indesignIcon from '../../assets/InDesign.svg';
import VideoModal from '../VideoModal';
import packagingVideo from '../../assets/mp4/packaging_indesign_doc.mp4';

const warnings = [
  { pts: 10, reason: 'Incorrect folder naming' },
  { pts: 10, reason: 'Not packaging InDesign project' }
];

export default function SubmittingSlide() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div style={{ textAlign: 'center', maxWidth: 750 }}>
      <h2 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 16
      }}>
        Submitting Assignments
      </h2>
      <p style={{
        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
        color: colors.textSecondary,
        marginBottom: 24,
        lineHeight: 1.5
      }}>
        Always submit your <strong style={{ color: colors.textPrimary }}>PACKAGED</strong> InDesign project as a <strong style={{ color: colors.textPrimary }}>ZIPPED</strong> folder with the following name format:
      </p>
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
            gap: 'clamp(8px, 3vw, 16px)',
            padding: 'clamp(10px, 3vw, 16px)',
            background: 'rgba(255,51,102,0.25)',
            borderRadius: 12,
            marginBottom: 10
          }}>
            <span style={{ color: colors.error, fontWeight: 700, fontSize: 'clamp(18px, 5vw, 28px)', whiteSpace: 'nowrap' }}>-{w.pts} points</span>
            <span style={{ color: colors.textSecondary, fontSize: 'clamp(14px, 4vw, 18px)' }}>{w.reason}</span>
          </div>
        ))}
      </div>

      {/* Video button */}
      <button
        onClick={() => setShowVideo(true)}
        style={{
          background: colors.cardBackground,
          padding: '16px 28px',
          borderRadius: 28,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 18,
          border: `2px solid ${colors.indesign}`,
          cursor: 'pointer',
          color: colors.textPrimary,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 38, 190, 0.15)';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = colors.cardBackground;
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <img
          src={indesignIcon}
          alt="InDesign"
          style={{ width: 28, height: 28, borderRadius: 6, border: `2px solid ${colors.indesign}` }}
        />
        <span>Package via File → Package in InDesign</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={colors.indesign}
          style={{ marginLeft: 4 }}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      {/* Video Modal */}
      <VideoModal
        src={packagingVideo}
        isOpen={showVideo}
        onClose={() => setShowVideo(false)}
      />
    </div>
  );
}
