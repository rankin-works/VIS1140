import { gradients, colors } from '../../styles/theme';
import SVGEditorDemo from '../demos/SVGEditorDemo';

export default function SVGEditorSlide() {
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
        How Code Creates Vector Graphics (SVG)
      </h2>
      <p style={{ color: colors.textSecondary, fontSize: 'clamp(12px, 2vw, 16px)', marginBottom: 16, textAlign: 'center' }}>
        SVG (Scalable Vector Graphic) is a code-based format for vector images that can be rendered by web browsers. They are the most popular form of vector graphic used on the web.
      </p>
      <SVGEditorDemo />
    </div>
  );
}
