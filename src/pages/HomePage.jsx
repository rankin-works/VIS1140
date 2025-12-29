import React from 'react';
import { Link } from 'react-router-dom';
import { colors, gradients, shadows, borderRadius } from '../styles/theme';

const navCards = [
  {
    title: 'Presentations',
    description: 'Interactive slides covering design fundamentals, tools, and workflows.',
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
    description: 'Reference materials, tutorials, and helpful links for your design journey.',
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
          background: gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          VIS1140
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
          maxWidth: 660,
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Welcome to the course hub. Explore presentations, access project briefs,
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
    </div>
  );
}
