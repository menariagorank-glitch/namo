import React from 'react';

const MARQUEE_ITEMS = [
  'Heritage', 'Luxury', 'Rajasthan', 'Royal Hospitality', 'Desert Camps',
  'Palace Stays', 'Adventure', 'NAMO', 'Heritage', 'Luxury', 'Rajasthan',
  'Royal Hospitality', 'Desert Camps', 'Palace Stays', 'Adventure', 'NAMO',
];

interface MarqueeBandProps {
  /** background color token or value */
  bg?: string;
  /** text color token or value */
  color?: string;
  /** separator icon class, defaults to Font Awesome diamond */
  icon?: string;
  /** direction: left (default) or right */
  direction?: 'left' | 'right';
}

/**
 * MarqueeBand — a continuously scrolling marquee ticker that acts as a
 * cinematic separator between page sections. Pure CSS animation, no JS.
 */
export const MarqueeBand: React.FC<MarqueeBandProps> = ({
  bg    = 'var(--color-primary)',
  color = 'rgba(255,255,255,0.85)',
  icon  = 'fa-solid fa-diamond',
  direction = 'left',
}) => {
  return (
    <div
      className="marquee-band"
      style={{ background: bg, color }}
      aria-hidden="true"
    >
      <div
        className={`marquee-track ${direction === 'right' ? 'marquee-track--reverse' : ''}`}
      >
        {/* Duplicate for seamless loop */}
        {[0, 1].map(copy => (
          <span key={copy} className="marquee-set">
            {MARQUEE_ITEMS.map((item, i) => (
              <React.Fragment key={i}>
                <span className="marquee-item">{item}</span>
                <i className={`${icon} marquee-sep`} />
              </React.Fragment>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};
