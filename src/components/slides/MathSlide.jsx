import { gradients, colors } from '../../styles/theme';
import BezierDemo from '../demos/BezierDemo';

export default function MathSlide() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: 700
    }}>
      <h2 style={{
        fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 4,
        textAlign: 'center'
      }}>
        The Math Behind Vector Graphics
      </h2>
      <p style={{ color: colors.textSecondary, fontSize: 'clamp(12px, 2vw, 16px)', marginBottom: 8, textAlign: 'center' }}>
        How mathematical formulas create perfect curves
      </p>
      {/* Explanation */}
      <p style={{ color: colors.textSecondary, fontSize: 'clamp(10px, 2.5vw, 16px)', lineHeight: 1.6, marginBottom: 8, textAlign: 'center', margin: 0 }}>
        Drag the <span style={{ color: colors.accentOrange, fontWeight: 600 }}>orange</span>,{' '}
        <span style={{ color: colors.accentPink, fontWeight: 600 }}>pink</span>, and{' '}
        <span style={{ color: colors.success, fontWeight: 600 }}>green</span> points to reshape the curve.
      </p>
      <BezierDemo />
    </div>
  );
}
