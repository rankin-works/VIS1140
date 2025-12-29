import React from 'react';
import { colors, gradients } from '../../styles/theme';

const formats = [
  { ext: '.ai', name: 'Adobe Illustrator', desc: 'Native Illustrator file, do not place .ai into InDesign layout for printing.', color: colors.illustrator },
  { ext: '.eps', name: 'Encapsulated PostScript', desc: 'Vector files we place in InDesign, optimized for printing purposes.', color: colors.illustrator },
  { ext: '.psd', name: 'Photoshop Document', desc: 'Native Photoshop file, retains all layer information for editing in Photoshop.', color: colors.photoshop },
  { ext: '.tiff', name: 'Tagged Image File', desc: 'High-quality raster, the only raster images we place in InDesign for print.', color: colors.photoshop },
  { ext: '.indd', name: 'InDesign Document', desc: 'Native InDesign file, where our assignments are finalized and printed.', color: colors.indesign },
  { ext: '.pdf', name: 'Portable Document', desc: 'Universal format, can be vector or raster, optimized for web and print.', color: colors.indesign }
];

export default function FormatsSlide() {
  return (
    <div style={{ width: '100%', maxWidth: 1000 }}>
      <h2 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 36,
        textAlign: 'center'
      }}>
        Know Your File Formats
      </h2>
      <div className="grid-3-cols" style={{ gap: 16 }}>
        {formats.map((f, i) => (
          <div key={i} className="card-hover" style={{
            background: colors.cardBackground,
            padding: 24,
            borderRadius: 16,
            display: 'flex',
            gap: 16,
            alignItems: 'center'
          }}>
            <span style={{ fontFamily: 'monospace', fontSize: 24, fontWeight: 700, color: f.color }}>
              {f.ext}
            </span>
            <div>
              <h4 style={{ margin: 0, fontSize: 17 }}>{f.name}</h4>
              <p style={{ margin: 0, fontSize: 14, color: colors.textSecondary }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
