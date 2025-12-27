import React, { useState } from 'react';
import { colors, gradients } from '../../styles/theme';

const steps = [
  { title: 'Define the Problem', desc: "You can't solve a problem without defining it first.", emoji: '🎯' },
  { title: 'Research', desc: 'Look at how others have solved similar problems.', emoji: '🔍' },
  { title: 'Brainstorming', desc: 'Generate ideas with thumbnail sketches.', emoji: '💡' },
  { title: 'Roughs', desc: 'Evolve thumbnails to refine your ideas.', emoji: '✏️' },
  { title: 'Comprehensive Comps', desc: 'Narrow down to a few solutions.', emoji: '🎨' },
  { title: 'Production', desc: 'Add colors, fonts, and digital form.', emoji: '🖥️' },
  { title: 'Final Product', desc: 'Print, cut, fold, and deliver.', emoji: '🚀' }
];

export default function ProcessSlide() {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ width: '100%', maxWidth: 900 }}>
      <h2 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 32,
        textAlign: 'center'
      }}>
        The Design Process
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((step, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '16px 24px',
              background: i === active ? 'rgba(255,154,0,0.1)' : colors.cardBackground,
              border: `2px solid ${i === active ? colors.accentOrange : 'transparent'}`,
              borderRadius: 16,
              cursor: 'pointer',
              transition: 'all 0.3s',
              transform: i === active ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#12121a',
              border: (i === active || i === hovered) ? '2px solid #ffd700' : '2px solid transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              flexShrink: 0,
              boxSizing: 'border-box',
              transition: 'border 0.3s'
            }}>
              {step.emoji}
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: 20 }}>{step.title}</h4>
              <p style={{
                margin: 0,
                fontSize: 16,
                color: colors.textSecondary,
                maxHeight: i === active ? 50 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s'
              }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
