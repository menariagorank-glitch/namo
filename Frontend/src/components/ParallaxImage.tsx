import React, { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  /** How many % of the image height to travel during scroll. Default: 20 */
  speed?: number;
  /** Scale the image up to avoid edge gaps from translate. Default: 1.15 */
  scale?: number;
  loading?: 'lazy' | 'eager';
  children?: ReactNode;
}

/**
 * ParallaxImage: an img that moves slower than the page scroll speed,
 * creating a cinematic depth parallax effect via GSAP ScrollTrigger scrub.
 * Degrades gracefully when prefers-reduced-motion is active.
 */
export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = '',
  wrapperClassName = '',
  speed = 20,
  scale = 1.15,
  loading = 'lazy',
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced || !wrapperRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { yPercent: -speed / 2 },
        {
          yPercent: speed / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div
      ref={wrapperRef}
      className={`parallax-image-wrap ${wrapperClassName}`}
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`parallax-image ${className}`}
        loading={loading}
        style={{
          width: '100%',
          height: `${100 + speed}%`,
          objectFit: 'cover',
          display: 'block',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      />
      {children}
    </div>
  );
};
