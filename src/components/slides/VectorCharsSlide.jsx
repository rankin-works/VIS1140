import React from 'react';
import { colors, gradients } from '../../styles/theme';
import illustratorIcon from '../../assets/Illustrator.svg';
import appleLogo from '../../assets/apple-alt.svg';
import amazonLogo from '../../assets/amazon-light.svg';
import discordLogo from '../../assets/discord.svg';
import facebookLogo from '../../assets/facebook.svg';
import playstationLogo from '../../assets/playstation.svg';
import sinclairLogo from '../../assets/sinclair.svg';

const items = [
  { title: 'Scalability', desc: 'Scale infinitely without losing quality' },
  { title: 'File Size', desc: 'Smaller files - stores only math data' },
  { title: 'Editability', desc: 'Manipulate paths and anchor points' },
  { title: 'Best For', desc: 'Logos, icons, typography, motion design' },
  { title: 'Formats', desc: 'SVG, AI, EPS, PDF' }
];

const vectorLogos = [
  { src: appleLogo, alt: 'Apple' },
  { src: amazonLogo, alt: 'Amazon' },
  { src: discordLogo, alt: 'Discord' },
  { src: facebookLogo, alt: 'Facebook' },
  { src: playstationLogo, alt: 'PlayStation' },
  { src: sinclairLogo, alt: 'Sinclair' }
];

export default function VectorCharsSlide() {
  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px, 2vw, 20px)', marginBottom: 'clamp(16px, 3vw, 36px)' }}>
        <div>
          <img src={illustratorIcon} alt="Illustrator" style={{ width: 72, height: 72, borderRadius: 14, border: `2px solid ${colors.illustrator}` }} />
        </div>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 3.2rem)',
          fontWeight: 700,
          background: gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          Vector Graphics
        </h2>
      </div>
      <div className="grid-2-cols">
        {items.map((item, i) => (
          <div key={i} className="card-hover" style={{
            background: colors.cardBackground,
            padding: 'clamp(14px, 2.5vw, 28px)',
            borderRadius: 14
          }}>
            <h4 style={{ color: colors.illustrator, margin: '0 0 8px', fontSize: 'clamp(16px, 2.5vw, 22px)' }}>{item.title}</h4>
            <p style={{ color: colors.textSecondary, margin: 0, fontSize: 'clamp(13px, 2vw, 18px)', lineHeight: 1.4 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Vector logo marquee */}
      <div style={{
        position: 'relative',
        marginTop: 'clamp(24px, 4vw, 40px)',
        overflow: 'hidden',
        width: '100%',
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
      }}>
        <div style={{
          display: 'flex',
          animation: 'marqueeScroll 20s linear infinite',
          width: 'fit-content'
        }}>
          {/* Two identical sets for seamless loop */}
          {[0, 1].map((setIndex) => (
            <div
              key={setIndex}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(40px, 8vw, 80px)',
                paddingRight: 'clamp(40px, 8vw, 80px)'
              }}
            >
              {vectorLogos.map((logo, i) => (
                <img
                  key={i}
                  src={logo.src}
                  alt={logo.alt}
                  style={{
                    width: 'clamp(96px, 18vw, 144px)',
                    height: 'clamp(96px, 18vw, 144px)',
                    opacity: 0.7,
                    flexShrink: 0
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes marqueeScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </div>
  );
}
