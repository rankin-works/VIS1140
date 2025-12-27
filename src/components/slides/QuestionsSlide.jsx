import { useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { colors, gradients } from '../../styles/theme';
import catRiv from '../../assets/13862-26228-interactive-cat.riv';

export default function QuestionsSlide() {
  const { rive, RiveComponent } = useRive({
    src: catRiv,
    stateMachines: 'State Machine 1',
    autoplay: true
  });

  // Get the tracking input
  const isTracking = useStateMachineInput(rive, 'State Machine 1', 'istracking');

  // Enable tracking when component mounts
  useEffect(() => {
    if (isTracking) {
      isTracking.value = true;
    }
  }, [isTracking]);

  return (
    <div style={{ textAlign: 'center', paddingBottom: 20 }}>
      <h2 style={{
        fontSize: 'clamp(2rem, 5vw, 4rem)',
        fontWeight: 700,
        background: gradients.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 16
      }}>
        Questions?
      </h2>
      <div
        style={{
          width: 'min(500px, 85vw)',
          height: 'min(500px, 85vw)',
          margin: '0 auto 20px',
          borderRadius: 20,
          overflow: 'hidden',
          background: colors.cardBackground
        }}
      >
        <RiveComponent
          style={{ width: '100%', height: '100%' }}
          onMouseMove={(e) => rive?.pointerMove(e)}
          onMouseDown={(e) => rive?.pointerDown(e)}
          onMouseUp={(e) => rive?.pointerUp(e)}
        />
      </div>
      <p style={{ color: colors.textSecondary, marginBottom: 8, fontSize: 'clamp(14px, 2.5vw, 18px)' }}>Contact:</p>
      <a
        href="mailto:jacob.rankin@sinclair.edu"
        style={{ fontSize: 'clamp(16px, 3vw, 26px)', color: colors.accentOrange, textDecoration: 'none' }}
      >
        jacob.rankin@sinclair.edu
      </a>
    </div>
  );
}
