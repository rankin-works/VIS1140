import React from 'react';
import { Link } from 'react-router-dom';
import { presentations } from '../data/presentations';
import { colors, gradients, shadows, borderRadius } from '../styles/theme';

export default function PresentationsPage() {
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
          Presentations
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: colors.textSecondary
        }}>
        </p>
      </div>

      {/* Presentations Grid */}
      <div className="grid-2-cols">
        {presentations.map(presentation => (
          <Link
            key={presentation.id}
            to={`/presentations/${presentation.id}`}
            className="card-hover"
            style={{
              display: 'block',
              background: colors.cardBackground,
              borderRadius: borderRadius.large,
              boxShadow: shadows.card,
              textDecoration: 'none',
              overflow: 'hidden'
            }}
          >
            {/* Thumbnail */}
            <div
              className="presentation-thumbnail"
              style={{
                height: 160,
                background: presentation.thumbnail ? 'none' : gradients.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {presentation.thumbnail ? (
                <img
                  src={presentation.thumbnail}
                  alt={presentation.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 55%'
                  }}
                />
              ) : (
                <span style={{
                  fontSize: '3rem',
                  opacity: 0.5
                }}>
                  📽️
                </span>
              )}
              {/* Slide count badge */}
              <div style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: 'rgba(0, 0, 0, 0.6)',
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: '0.8rem',
                fontWeight: 500,
                color: colors.textPrimary
              }}>
                {presentation.slides.length} slides
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: 24 }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: colors.textPrimary,
                marginBottom: 8
              }}>
                {presentation.title}
              </h3>
              <p style={{
                fontSize: '0.95rem',
                color: colors.textSecondary,
                lineHeight: 1.5
              }}>
                {presentation.description}
              </p>
              <div style={{
                marginTop: 16,
                color: colors.accentOrange,
                fontWeight: 500,
                fontSize: '0.9rem'
              }}>
                Launch Presentation →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state for when more presentations are added */}
      {presentations.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: colors.textSecondary
        }}>
          <p style={{ fontSize: '1.25rem', marginBottom: 8 }}>No presentations yet</p>
          <p style={{ fontSize: '0.95rem' }}>Check back soon for new content.</p>
        </div>
      )}
    </div>
  );
}
