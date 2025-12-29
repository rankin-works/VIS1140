import { colors, gradients } from '../../styles/theme';
import avatarImg from '../../assets/IMG_3765.jpeg';
import vhLogo from '../../assets/vh.svg';
import linkedinIcon from '../../assets/linkedin.svg';
import rankinLogo from '../../assets/rankin_r_logo.svg';

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
      <div className="welcome-card" style={{ maxWidth: 500, margin: '0 auto' }}>
        <img
          src={avatarImg}
          alt="Jacob Rankin"
          className="welcome-avatar"
        />
        <div style={{ textAlign: 'left', flex: 1 }}>
          <h3 className="welcome-name">Jacob Rankin</h3>
          <p className="welcome-title">
            Adjunct Faculty
          </p>
          <p className="welcome-info">
            Visual Communications Alumni class of 2020
          </p>
          <p className="welcome-info">
            My passions are anything to do with technology, design, animation, and music production. In my spare time, I enjoy gaming, cycling, and the gym!
          </p>
        </div>
      </div>

      {/* VisionHouse Card */}
      <a
        href="http://visionhouse.pro/"
        target="_blank"
        rel="noopener noreferrer"
        className="card-hover"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(16px, 3vw, 24px)',
          background: '#1a1a24',
          padding: 'clamp(16px, 3vw, 24px)',
          borderRadius: 16,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: 20,
          textDecoration: 'none',
          maxWidth: 500,
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        <img
          src={vhLogo}
          alt="VisionHouse"
          style={{
            width: 'clamp(48px, 8vw, 64px)',
            height: 'clamp(48px, 8vw, 64px)',
            flexShrink: 0
          }}
        />
        <div style={{ textAlign: 'left' }}>
          <h4 style={{
            color: colors.textPrimary,
            margin: '0 0 6px',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: 600
          }}>
            Motion Designer & Video Editor
          </h4>
          <p style={{
            color: colors.textSecondary,
            margin: 0,
            fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            lineHeight: 1.4
          }}>
            at VisionHouse Digital Marketing
          </p>
        </div>
        <span style={{
          color: colors.accentOrange,
          marginLeft: 'auto',
          fontSize: 'clamp(1rem, 2vw, 1.25rem)'
        }}>
          →
        </span>
      </a>

      {/* Social Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        marginTop: 20,
        flexWrap: 'wrap'
      }}>
        {/* Portfolio Button */}
        <a
          href="https://rankin.works/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #FF6B35, #FF3366)',
            borderRadius: 30,
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 500,
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 107, 53, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <img
            src={rankinLogo}
            alt="Portfolio"
            style={{ width: 30, height: 30 }}
          />
          Portfolio
        </a>

        {/* LinkedIn Button */}
        <a
          href="https://www.linkedin.com/in/rankinjacob/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 24px',
            background: '#0A66C2',
            borderRadius: 30,
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 500,
            fontSize: 'clamp(0.9rem, 2vw, 1rem)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(10, 102, 194, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <img
            src={linkedinIcon}
            alt="LinkedIn"
            style={{ width: 20, height: 20, borderRadius: 4 }}
          />
          Connect on LinkedIn
        </a>
      </div>
    </div>
  );
}
