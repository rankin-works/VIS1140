import { useEffect, useRef } from 'react';

export default function ParticleNetwork({ particleCount = 20, lineDistance = 5000 }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const isPausedRef = useRef(false);
  const animateRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Listen for video modal events to pause/resume
    const handlePause = () => {
      isPausedRef.current = true;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
    const handleResume = () => {
      isPausedRef.current = false;
      if (!animationRef.current && animateRef.current) {
        animationRef.current = requestAnimationFrame(animateRef.current);
      }
    };
    window.addEventListener('videoModalOpen', handlePause);
    window.addEventListener('videoModalClose', handleResume);
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas size (no pixel ratio scaling for performance)
    const setSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setSize();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setSize, 100);
    };
    window.addEventListener('resize', handleResize);

    // Shape types and colors
    const shapes = ['circle', 'square', 'triangle'];
    const colors = [
      { r: 255, g: 255, b: 255 },  // white
      { r: 0, g: 149, b: 255 },     // blue
      { r: 255, g: 154, b: 0 }      // orange
    ];

    // Create particles - simpler properties for performance
    const createParticle = (fadeInDelay = 0) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 8 + Math.random() * 12,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      opacity: 0,
      targetOpacity: 0.06 + Math.random() * 0.06,
      fadeInDelay,
      fadeInStart: null,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.008 + Math.random() * 0.012,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    });

    // Initialize particles with staggered fade-in
    particlesRef.current = Array.from({ length: particleCount }, (_, i) =>
      createParticle(i * 300 + Math.random() * 600)
    );

    const startTime = performance.now();
    let lastTime = startTime;

    // Animation loop with delta time
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const delta = Math.min(currentTime - lastTime, 32); // Cap delta to ~30fps minimum
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Handle fade-in timing
        if (p.fadeInStart === null && elapsed >= p.fadeInDelay) {
          p.fadeInStart = currentTime;
        }

        // Calculate opacity
        if (p.fadeInStart !== null) {
          const fadeElapsed = currentTime - p.fadeInStart;
          const fadeInDuration = 2000;

          if (fadeElapsed < fadeInDuration) {
            p.opacity = (fadeElapsed / fadeInDuration) * p.targetOpacity;
          } else {
            p.phase += p.phaseSpeed * (delta / 16);
            p.opacity = p.targetOpacity * (0.7 + 0.3 * Math.sin(p.phase));
          }
        }

        // Move particle
        p.x += p.vx * (delta / 16);
        p.y += p.vy * (delta / 16);
        p.rotation += p.rotationSpeed * (delta / 16);

        // Wrap around edges
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      }

      // Draw connecting lines first (behind particles)
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.opacity < 0.01) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.opacity < 0.01) continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          const maxDistSq = lineDistance * lineDistance;

          if (distSq < maxDistSq) {
            // Softer falloff and higher base opacity for lines
            const distRatio = Math.sqrt(distSq) / lineDistance;
            const lineOpacity = (1 - distRatio * distRatio) * 0.12;

            if (lineOpacity > 0.005) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${lineOpacity})`;
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles with different shapes and colors
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.opacity > 0.02) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`;
          ctx.beginPath();

          if (p.shape === 'circle') {
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          } else if (p.shape === 'square') {
            const half = p.size / 2;
            ctx.rect(-half, -half, p.size, p.size);
          } else if (p.shape === 'triangle') {
            const half = p.size / 2;
            ctx.moveTo(0, -half);
            ctx.lineTo(half, half);
            ctx.lineTo(-half, half);
            ctx.closePath();
          }

          ctx.fill();
          ctx.restore();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Store reference to animate function for resume
    animateRef.current = animate;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('videoModalOpen', handlePause);
      window.removeEventListener('videoModalClose', handleResume);
      clearTimeout(resizeTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, lineDistance]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
      }}
    />
  );
}
