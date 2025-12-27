import React from 'react';
import { colors, gradients } from '../../styles/theme';

const items = [
  { icon: 'Storage', title: 'Storage', desc: 'Flashdrive or External SSD. Or use Microsoft OneDrive, every Sinclair student has OneDrive storage.' },
  { icon: 'Laptop', title: 'Laptop (Optional)', desc: 'You are free to use your own laptop with Adobe CC installed. You will need to use the lab computer to use the printers.' },
  { icon: 'Mouse', title: 'Mouse', desc: 'If you find the Apple magic mouse in the lab to be frustrating to use bring your own!' },
  { icon: 'Creativity', title: 'Your Creativity!', desc: 'Always arrive to class ready to learn and stretch your creative muscles.' }
];

export default function RequirementsSlide() {
  return (
    <div style={{ width: '100%', maxWidth: 1200 }}>
      <h2 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 40,
        textAlign: 'center'
      }}>
        What is needed for this class?
      </h2>
      <div className="grid-4-cols">
        {items.map((item, i) => (
          <div key={i} className="card-hover" style={{
            background: colors.cardBackground,
            padding: 36,
            borderRadius: 20,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>
              {item.icon === 'Storage' ? '💾' : item.icon === 'Laptop' ? '💻' : item.icon === 'Mouse' ? '🖱️' : '🎨'}
            </div>
            <h4 style={{ margin: '0 0 12px', fontSize: 24 }}>{item.title}</h4>
            <p style={{ color: colors.textSecondary, margin: 0, fontSize: 18 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
