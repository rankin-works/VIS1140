import { gradients, colors } from '../../styles/theme';
import VectorRasterDemo from '../demos/VectorRasterDemo';

export default function DemoSlide() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
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
        See the Difference
      </h2>
      <p style={{ color: colors.textSecondary, fontSize: 'clamp(12px, 2vw, 16px)', marginBottom: 12, textAlign: 'center' }}>
        Use the slider to zoom in
      </p>
      <VectorRasterDemo />
    </div>
  );
}
