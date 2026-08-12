import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Destination } from '../types/hotel';

gsap.registerPlugin(ScrollTrigger);

interface DestinationJourneyProps {
  destinations: Destination[];
}

/**
 * DestinationJourney: immersive scroll journey through Rajasthan destinations.
 * Each destination reveals with a parallax image, oversized name, and description.
 */
export const DestinationJourney: React.FC<DestinationJourneyProps> = ({
  destinations,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const cards = containerRef.current!.querySelectorAll<HTMLElement>('.dest-card');

      cards.forEach((card, i) => {
        const img = card.querySelector<HTMLElement>('.dest-card__img');
        const name = card.querySelector<HTMLElement>('.dest-card__name');
        const desc = card.querySelector<HTMLElement>('.dest-card__desc');
        const number = card.querySelector<HTMLElement>('.dest-card__number');
        const line = card.querySelector<HTMLElement>('.dest-card__route-line');

        // Stagger entrance
        gsap.from(card, {
          opacity: 0,
          y: 60,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          delay: (i % 3) * 0.15,
        });

        // Image parallax on hover is handled by CSS.
        // Scroll-based scale for the image
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.12 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'top 20%',
                scrub: true,
              },
            }
          );
        }

        // Name slide in
        if (name) {
          gsap.from(name, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          });
        }

        // Route line grow
        if (line && i < destinations.length - 1) {
          gsap.from(line, {
            scaleY: 0,
            transformOrigin: 'top center',
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'center 60%',
              toggleActions: 'play none none none',
            },
          });
        }

        if (number) {
          gsap.from(number, {
            opacity: 0,
            x: -20,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        }

        if (desc) {
          gsap.from(desc, {
            opacity: 0,
            y: 15,
            duration: 0.7,
            ease: 'power2.out',
            delay: 0.2,
            scrollTrigger: {
              trigger: card,
              start: 'top 72%',
              toggleActions: 'play none none none',
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [destinations]);

  return (
    <div ref={containerRef} className="destination-journey">
      {destinations.map((dest, idx) => (
        <div key={dest.id} className="dest-card-wrap">
          <div className="dest-card">
            {/* Image */}
            <div className="dest-card__img-wrap">
              <img
                src={dest.image}
                alt={dest.name}
                className="dest-card__img"
                loading="lazy"
              />
              <div className="dest-card__img-overlay" />
            </div>

            {/* Content */}
            <div className="dest-card__content">
              <span className="dest-card__number" aria-hidden="true">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="dest-card__marker" aria-hidden="true">
                <i className="fa-solid fa-location-dot" />
              </div>
              <h3 className="dest-card__name">{dest.name}</h3>
              <p className="dest-card__desc">{dest.description}</p>
              <span className="dest-card__explore">
                Explore <i className="fa-solid fa-arrow-right" />
              </span>
            </div>
          </div>

          {/* Animated route line connecting destinations */}
          {idx < destinations.length - 1 && (
            <div className="dest-card__route-line" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
};
