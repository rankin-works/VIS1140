import React from 'react';
import { colors, gradients, shadows, borderRadius } from '../styles/theme';

const videos = [
  {
    id: '9Y7nlqEmoIM',
    title: 'Illustrator Basics & Designing Emojis',
    thumbnail: 'https://i.ytimg.com/vi/9Y7nlqEmoIM/hqdefault.jpg',
    url: 'https://youtu.be/9Y7nlqEmoIM',
    duration: '1:01:46'
  },
  {
    id: 'N7miM75zMDU',
    title: 'Adobe Scan Guide',
    thumbnail: 'https://i.ytimg.com/vi/N7miM75zMDU/hqdefault.jpg',
    url: 'https://youtu.be/N7miM75zMDU',
    duration: '3:59'
  },
  {
    id: '5DOamt3M_Ts',
    title: 'Emoji EPS Files & InDesign Layout',
    thumbnail: 'https://i.ytimg.com/vi/5DOamt3M_Ts/hqdefault.jpg',
    url: 'https://youtu.be/5DOamt3M_Ts',
    duration: '13:04'
  },
  {
    id: 'oYVTTZqy6x4',
    title: 'Patterns and Pantone Color Guide',
    thumbnail: 'https://i.ytimg.com/vi/oYVTTZqy6x4/hqdefault.jpg',
    url: 'https://youtu.be/oYVTTZqy6x4',
    duration: '24:56'
  },
  {
    id: 'FQFewT6kpF8',
    title: 'Illustrate a Movie Poster',
    thumbnail: 'https://i.ytimg.com/vi/FQFewT6kpF8/hqdefault.jpg',
    url: 'https://youtu.be/FQFewT6kpF8',
    duration: '50:41'
  }
];

export default function ResourcesPage() {
  return (
    <div style={{
      maxWidth: 1000,
      margin: '0 auto',
      padding: '40px 24px'
    }}>
      {/* Page Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          fontWeight: 700,
          marginBottom: 12,
          background: gradients.primary,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Resources
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: colors.textSecondary
        }}>
          Reference materials, tutorials, and helpful links for your design journey.
        </p>
      </div>

      {/* Videos Section */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: colors.textPrimary,
          marginBottom: 24
        }}>
          Videos
        </h2>
        <div className="grid-2-cols">
          {videos.map(video => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-hover"
              style={{
                display: 'block',
                background: colors.cardBackground,
                borderRadius: borderRadius.large,
                boxShadow: shadows.card,
                textDecoration: 'none',
                overflow: 'hidden'
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  height: 160,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                />
                {/* Duration badge */}
                <div style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  background: 'rgba(0, 0, 0, 0.6)',
                  padding: '4px 10px',
                  borderRadius: 12,
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: colors.textPrimary
                }}>
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: 24 }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: colors.textPrimary,
                  marginBottom: 8
                }}>
                  {video.title}
                </h3>
                <div style={{
                  marginTop: 16,
                  color: colors.accentOrange,
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}>
                  Watch on YouTube →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
