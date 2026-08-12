import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Experience } from '../types/hotel';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceShowcaseProps {
  experiences: Experience[];
}

/**
 * ExperienceShowcase: full-panel editorial experience sections.
 * Large photography with scroll-driven parallax and staggered text reveals.
 */
export const ExperienceShowcase: React.FC<ExperienceShowcaseProps> = ({
  experiences,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const panels = containerRef.current!.querySelectorAll<HTMLElement>('.exp-panel');

      panels.forEach((panel) => {
        const img = panel.querySelector<HTMLElement>('.exp-panel__img');
        const mask = panel.querySelector<HTMLElement>('.exp-panel__mask');
        const content = panel.querySelectorAll<HTMLElement>(
          '.exp-panel__category, .exp-panel__title, .exp-panel__desc, .exp-panel__icon'
        );

        // Image reveal mask (wipe from side)
        if (mask) {
          gsap.fromTo(
            mask,
            { scaleX: 1, transformOrigin: 'left center' },
            {
              scaleX: 0,
              duration: 1,
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: panel,
                start: 'top 72%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // Parallax on image
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -10 },
            {
              yPercent: 10,
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

        // Text stagger reveal
        if (content.length > 0) {
          gsap.from(content, {
            opacity: 0,
            x: panel.classList.contains('exp-panel--reverse') ? 40 : -40,
            stagger: 0.15,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: panel,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [experiences]);

  return (
    <div ref={containerRef} className="experience-showcase">
      {experiences.map((exp, idx) => (
        <div
          key={exp.id}
          className={`exp-panel ${exp.reverse ? 'exp-panel--reverse' : ''}`}
        >
          {/* Image */}
          <div className="exp-panel__img-wrap">
            <img
              src={exp.image}
              alt={exp.title}
              className="exp-panel__img"
              loading="lazy"
            />
            {/* Wipe-reveal mask */}
            <div className="exp-panel__mask" aria-hidden="true" />
            <div className="exp-panel__img-overlay" />
          </div>

          {/* Content */}
          <div className="exp-panel__content">
            <div className="exp-panel__icon">
              <i className={exp.icon} />
            </div>
            <p className="exp-panel__category section-label">{exp.category}</p>
            <h3 className="exp-panel__title">{exp.title}</h3>
            <p className="exp-panel__desc">{exp.description}</p>

            {/* Index marker */}
            <span className="exp-panel__index" aria-hidden="true">
              {String(idx + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
