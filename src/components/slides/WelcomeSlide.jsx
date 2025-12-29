import React from 'react';
import { colors, gradients } from '../../styles/theme';
import avatarImg from '../../assets/IMG_3765.jpeg';

export default function WelcomeSlide() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{
        fontSize: 'clamp(2rem, 6vw, 4rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 'clamp(24px, 4vw, 48px)'
      }}>
        Welcome!
      </h2>
      <div className="welcome-card">
        <img
          src={avatarImg}
          alt="Jacob Rankin"
          className="welcome-avatar"
        />
        <div style={{ textAlign: 'left' }}>
          <h3 className="welcome-name">Jacob Rankin</h3>
          <p className="welcome-title">
            Adjunct Faculty
          </p>
          <p className="welcome-info">
            Visual Communications Alumni
          </p>
          <p className="welcome-info">
            Videographer, Editor & Motion Designer
          </p>
        </div>
      </div>
    </div>
  );
}
