import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hotel } from '../types/hotel';

gsap.registerPlugin(ScrollTrigger);

interface PropertyShowcaseProps {
  hotels: Hotel[];
}

/**
 * PropertyShowcase — Full-bleed cinematic magazine-style property panels.
 * Each hotel is a 90vh scene with the image covering the full width.
 * Text is overlaid on a directional gradient, alternating left/right.
 * GSAP scroll animations: image scale scrub, number slide, line draw,
 * and staggered content reveals.
 */
export const PropertyShowcase: React.FC<PropertyShowcaseProps> = ({ hotels }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const panels = containerRef.current!.querySelectorAll<HTMLElement>('.property-scene');

      panels.forEach(panel => {
        const img      = panel.querySelector<HTMLElement>('.property-scene__img');
        const number   = panel.querySelector<HTMLElement>('.property-scene__number');
        const line     = panel.querySelector<HTMLElement>('.property-scene__line');
        const type     = panel.querySelector<HTMLElement>('.property-scene__type');
        const name     = panel.querySelector<HTMLElement>('.property-scene__name');
        const location = panel.querySelector<HTMLElement>('.property-scene__location');
        const desc     = panel.querySelector<HTMLElement>('.property-scene__desc');
        const cta      = panel.querySelector<HTMLElement>('.property-scene__cta');
        const badge    = panel.querySelector<HTMLElement>('.property-scene__badge');
        const isRight  = panel.classList.contains('property-scene--right');

        /* Image: scale scrub from 1.18 → 1.0 as it enters/exits viewport */
        if (img) {
          gsap.fromTo(img,
            { scale: 1.18 },
            {
              scale: 1.0,
              ease: 'none',
              scrollTrigger: {
                trigger: panel,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }

        /* Chapter number: dramatic lateral entrance */
        if (number) {
          gsap.from(number, {
            x: isRight ? 120 : -120,
            opacity: 0,
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        }

        /* Gold line: draw from correct origin */
        if (line) {
          gsap.from(line, {
            scaleX: 0,
            transformOrigin: isRight ? 'right center' : 'left center',
            duration: 1.4,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          });
        }

        /* Content lines reveal bottom-to-top with clip */
        const contentEls = [type, name, location, desc, cta].filter(Boolean) as HTMLElement[];
        gsap.from(contentEls, {
          y: 70,
          opacity: 0,
          clipPath: 'inset(100% 0 0 0)',
          stagger: 0.12,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 72%',
            toggleActions: 'play none none none',
          },
        });

        /* Badge pops in */
        if (badge) {
          gsap.from(badge, {
            scale: 0.6,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: panel,
              start: 'top 78%',
              toggleActions: 'play none none none',
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [hotels]);

  return (
    <div ref={containerRef} className="property-showcase-scenes">
      {hotels.map((hotel, idx) => {
        const isRight = idx % 2 === 1;
        return (
          <article
            key={hotel.slug}
            className={`property-scene ${isRight ? 'property-scene--right' : ''}`}
          >
            {/* Full-bleed background image */}
            <div className="property-scene__img-wrap">
              <img
                src={hotel.heroImage}
                alt={hotel.name}
                className="property-scene__img"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>

            {/* Directional gradient overlay */}
            <div className="property-scene__overlay" />
            <div className="property-scene__overlay-bottom" />

            {/* Content */}
            <div className="property-scene__content">
              {/* Outline chapter number */}
              <span className="property-scene__number" aria-hidden="true">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Gold line */}
              <div className="property-scene__line" aria-hidden="true" />

              {/* Property type */}
              <p className="property-scene__type">
                <i className={hotel.propertyTypeIcon} />
                {hotel.propertyType}
              </p>

              {/* Name */}
              <h3 className="property-scene__name">{hotel.name}</h3>

              {/* Location */}
              <p className="property-scene__location">
                <i className="fa-solid fa-location-dot" />
                {hotel.location}
              </p>

              {/* Short description */}
              <p className="property-scene__desc">{hotel.shortDescription}</p>

              {/* CTA */}
              <Link
                to={`/hotels/${hotel.slug}`}
                className="property-scene__cta"
                aria-label={`Explore ${hotel.name}`}
              >
                <span>Explore Property</span>
                <span className="property-scene__cta-arrow">
                  <i className="fa-solid fa-arrow-right" />
                </span>
              </Link>
            </div>

            {/* Badge — top corner */}
            {hotel.badge && (
              <span className="property-scene__badge">{hotel.badge}</span>
            )}
          </article>
        );
      })}
    </div>
  );
};
