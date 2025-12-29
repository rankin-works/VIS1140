import React from 'react';
import { Link } from 'react-router-dom';
import { colors, gradients, shadows, borderRadius } from '../styles/theme';
import sinclairLogo from '../assets/sinclair.svg';

const navCards = [
  {
    title: 'Presentations',
    description: 'All class presentations with interactive demonstrations.',
    icon: '📽️',
    path: '/presentations',
    color: colors.accentOrange
  },
  {
    title: 'Projects',
    description: 'Class projects with briefs, requirements, and submission guidelines.',
    icon: '🎨',
    path: '/projects',
    color: colors.accentPink
  },
  {
    title: 'Resources',
    description: 'Reference materials, tutorials, and downloads to assist your learning.',
    icon: '📚',
    path: '/resources',
    color: colors.accentBlue
  }
];

export default function HomePage() {
  return (
    <div style={{
      maxWidth: 1000,
      margin: '0 auto',
      padding: '60px 24px'
    }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          fontWeight: 700,
          marginBottom: 16,
          background: gradients.headerlogo,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          VIS 1140
        </h1>
        <h2 style={{
          fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
          fontWeight: 400,
          color: colors.textSecondary,
          marginBottom: 24
        }}>
          Design Processes I
        </h2>
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.125rem)',
          color: colors.textSecondary,
          maxWidth: 700,
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Welcome to the course hub for VIS 1140. Explore presentations, access project briefs,
          and find resources to help you succeed in your design journey.
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid-3-cols">
        {navCards.map(card => (
          <Link
            key={card.path}
            to={card.path}
            className="card-hover"
            style={{
              display: 'block',
              padding: 32,
              background: colors.cardBackground,
              borderRadius: borderRadius.large,
              boxShadow: shadows.card,
              textDecoration: 'none',
              textAlign: 'center'
            }}
          >
            <div style={{
              fontSize: '3rem',
              marginBottom: 16
            }}>
              {card.icon}
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: colors.textPrimary,
              marginBottom: 12
            }}>
              {card.title}
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: colors.textSecondary,
              lineHeight: 1.5
            }}>
              {card.description}
            </p>
            <div style={{
              marginTop: 20,
              color: card.color,
              fontWeight: 500,
              fontSize: '0.9rem'
            }}>
              Explore →
            </div>
          </Link>
        ))}
      </div>

      {/* Disclaimer and eLearn Button */}
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <p style={{
          fontSize: '0.85rem',
          color: colors.textSecondary,
          maxWidth: 600,
          margin: '0 auto 24px',
          lineHeight: 1.6,
          opacity: 0.8
        }}>
          This website is custom designed and managed by Jacob Rankin, adjunct faculty of Sinclair Community College.
          This is not an official Sinclair Community College website or application.
          All assignments are to be submitted via elearn.sinclair.edu.
          This website is only meant to serve as an interactive resource hub for the class.
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <a
          href="https://elearn.sinclair.edu"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 28px',
            background: colors.cardBackground,
            borderRadius: borderRadius.large,
            boxShadow: shadows.card,
            textDecoration: 'none',
            color: colors.textPrimary,
            fontWeight: 500,
            fontSize: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 154, 0, 0.1)';
            e.currentTarget.style.borderColor = colors.accentOrange;
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.cardBackground;
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img src={sinclairLogo} alt="Sinclair" style={{ width: 24, height: 24 }} />
          Go to eLearn
        </a>
      </div>
    </div>
  );
}
