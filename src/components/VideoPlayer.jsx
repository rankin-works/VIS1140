import { useState, useRef, useEffect, useCallback } from 'react';
import { colors } from '../styles/theme';

export default function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeout = useRef(null);

  // Format time as MM:SS
  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Play/Pause toggle
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    // Handle buffering - try to resume when enough data is available
    const handleProgress = () => {
      if (video.buffered.length > 0 && video.paused && isPlaying) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('progress', handleProgress);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('progress', handleProgress);
    };
  }, [isPlaying]);

  // Apply mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Apply volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [isPlaying, resetControlsTimeout]);

  // Handle progress bar seek (works for both mouse and touch)
  const seekToPosition = useCallback((clientX) => {
    if (!progressRef.current || !videoRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pos * duration;
  }, [duration]);

  // Handle progress bar click
  const handleProgressClick = (e) => {
    seekToPosition(e.clientX);
  };

  // Handle progress bar drag (mouse)
  const handleProgressDrag = (e) => {
    if (e.buttons !== 1) return;
    seekToPosition(e.clientX);
  };

  // Handle touch events for progress bar
  const handleProgressTouchStart = (e) => {
    e.stopPropagation();
    if (e.touches.length > 0) {
      seekToPosition(e.touches[0].clientX);
    }
  };

  const handleProgressTouchMove = (e) => {
    e.stopPropagation();
    if (e.touches.length > 0) {
      seekToPosition(e.touches[0].clientX);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#000',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8)',
        width: 'clamp(280px, 70vmin, 600px)',
        height: 'clamp(280px, 70vmin, 600px)',
        touchAction: 'none'
      }}
      onMouseMove={resetControlsTimeout}
      onMouseEnter={() => setShowControls(true)}
      onTouchStart={(e) => { e.stopPropagation(); resetControlsTimeout(); }}
      onTouchMove={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          cursor: 'pointer'
        }}
        playsInline
        loop
        autoPlay
        muted
        preload="auto"
        onClick={togglePlay}
        onContextMenu={(e) => e.preventDefault()}
        onWaiting={() => console.log('Video buffering...')}
        onCanPlay={() => {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }}
        onStalled={() => {
          // Try to resume playback if stalled
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }}
      />

      {/* Play/Pause overlay icon */}
      {!isPlaying && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(0, 149, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0, 170, 255, 0.4)'
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Controls - slide up from bottom */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '16px 16px 12px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          transform: showControls ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          onMouseMove={handleProgressDrag}
          onTouchStart={handleProgressTouchStart}
          onTouchMove={handleProgressTouchMove}
          style={{
            height: 24,
            padding: '9px 0',
            background: 'transparent',
            cursor: 'pointer',
            position: 'relative',
            touchAction: 'none'
          }}
        >
          <div style={{
            height: 6,
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 3,
            position: 'relative'
          }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${progress}%`,
                background: colors.accentBlue,
                borderRadius: 3
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: `${progress}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 14,
                height: 14,
                background: '#fff',
                borderRadius: '50%',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }}
            />
          </div>
        </div>

        {/* Control buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Play/Pause button */}
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Volume control */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 8,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {isMuted || volume === 0 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>

            {/* Time display */}
            <span style={{
              color: '#fff',
              fontSize: 13,
              fontFamily: 'monospace'
            }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
