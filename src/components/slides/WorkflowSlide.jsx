import React from 'react';
import { colors, gradients } from '../../styles/theme';
import illustratorIcon from '../../assets/Illustrator.svg';
import indesignIcon from '../../assets/InDesign.svg';
import photoshopIcon from '../../assets/Photoshop.svg';

export default function WorkflowSlide() {
  return (
    <div style={{ textAlign: 'center', maxWidth: 800 }}>
      <h2 style={{
        fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 28
      }}>
        The InDesign Workflow
      </h2>
      <p style={{ fontSize: 24, marginBottom: 28 }}>
        All projects utilize an InDesign layout as your final product.
      </p>
      <div style={{
        background: 'rgba(255,154,0,0.1)',
        border: `2px solid ${colors.accentOrange}`,
        padding: '18px 32px',
        borderRadius: 16,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        fontWeight: 600,
        fontSize: 20,
        marginBottom: 40
      }}>
        <span style={{ fontSize: 28 }}>Warning: </span> We only use .EPS and .TIFF in InDesign layouts!
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <img src={illustratorIcon} alt="Illustrator" style={{ width: 72, height: 72, borderRadius: 14, border: `2px solid ${colors.illustrator}` }} />
          <span style={{ fontSize: 18 }}>.eps</span>
        </div>
        <span style={{ fontSize: 36, color: colors.textSecondary }}>→</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <img src={indesignIcon} alt="InDesign" style={{ width: 72, height: 72, borderRadius: 14, border: `2px solid ${colors.indesign}` }} />
          <span style={{ fontSize: 18 }}>Layout</span>
        </div>
        <span style={{ fontSize: 36, color: colors.textSecondary }}>←</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <img src={photoshopIcon} alt="Photoshop" style={{ width: 72, height: 72, borderRadius: 14, border: `2px solid ${colors.photoshop}` }} />
          <span style={{ fontSize: 18 }}>.tiff</span>
        </div>
      </div>
      <p style={{ color: colors.textSecondary, fontSize: 18 }}>
        Always keep copies of your original .ai and .psd files even if you have exported .eps and .tiff files! Files are a big part of your grade.
      </p>
    </div>
  );
}
