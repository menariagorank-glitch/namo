import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GalleryImage {
  url: string;
  alt: string;
}

interface LuxuryGalleryProps {
  images: GalleryImage[];
  onImageClick: (src: string, alt: string) => void;
}

/**
 * LuxuryGallery: editorial-style staggered masonry gallery.
 * Variable image sizes via CSS grid named areas.
 * Each image reveals with a clip-path wipe on scroll entry.
 * Hover: scale + gold border + zoom icon.
 * Connects to existing GalleryLightbox.
 */
export const LuxuryGallery: React.FC<LuxuryGalleryProps> = ({
  images,
  onImageClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const items = containerRef.current!.querySelectorAll<HTMLElement>('.luxury-gallery__item');

      // Stagger reveal for all items
      gsap.from(items, {
        opacity: 0,
        y: 50,
        scale: 0.97,
        stagger: {
          each: 0.08,
          from: 'start',
        },
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [images]);

  return (
    <div ref={containerRef} className="luxury-gallery">
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`luxury-gallery__item luxury-gallery__item--${idx + 1}`}
          onClick={() => onImageClick(img.url, img.alt)}
          role="button"
          tabIndex={0}
          aria-label={`View: ${img.alt}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onImageClick(img.url, img.alt);
          }}
        >
          <div className="luxury-gallery__img-wrap">
            <img
              src={img.url}
              alt={img.alt}
              className="luxury-gallery__img"
              loading="lazy"
            />
          </div>
          <div className="luxury-gallery__overlay">
            <div className="luxury-gallery__zoom-icon">
              <i className="fa-solid fa-magnifying-glass-plus" />
            </div>
            <p className="luxury-gallery__caption">{img.alt}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
