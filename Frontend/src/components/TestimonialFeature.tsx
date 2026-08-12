import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Testimonial } from '../types/hotel';
import { GLOBAL_TESTIMONIALS } from '../data/hotels';

interface TestimonialFeatureProps {
  testimonials?: Testimonial[];
}

const BG_IMAGES = [
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=75',
  'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1600&q=75',
  'https://images.unsplash.com/photo-1568454537842-d933259bb258?auto=format&fit=crop&w=1600&q=75',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1600&q=75',
];

/**
 * TestimonialFeature: premium editorial testimonial display.
 * Large quote, background photography, slow parallax, elegant fade transitions.
 * Auto-cycles testimonials every 7 seconds.
 */
export const TestimonialFeature: React.FC<TestimonialFeatureProps> = ({
  testimonials = GLOBAL_TESTIMONIALS,
}) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    const next = (index + testimonials.length) % testimonials.length;

    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setCurrent(next);
          gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
          );
        },
      });
    } else {
      setCurrent(next);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        goTo(current + 1);
      }, 7000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaused, current, testimonials.length]);

  if (!testimonials || testimonials.length === 0) return null;

  const item = testimonials[current];

  return (
    <div
      className="testimonial-feature"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background images */}
      <div ref={bgRef} className="testimonial-feature__bg-wrap">
        {BG_IMAGES.map((src, i) => (
          <div
            key={i}
            className={`testimonial-feature__bg ${i === current % BG_IMAGES.length ? 'testimonial-feature__bg--active' : ''}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
        <div className="testimonial-feature__bg-overlay" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="testimonial-feature__content">
        {/* Large gold quote mark */}
        <div className="testimonial-feature__quote-mark" aria-hidden="true">&ldquo;</div>

        {/* Stars */}
        <div className="testimonial-feature__stars" aria-label={`${item.stars} stars`}>
          {Array.from({ length: item.stars }).map((_, i) => (
            <i key={i} className="fa-solid fa-star testimonial-feature__star" />
          ))}
        </div>

        {/* Quote text */}
        <blockquote className="testimonial-feature__text">
          {item.text.replace(/^"|"$/g, '')}
        </blockquote>

        {/* Author */}
        <div className="testimonial-feature__author">
          <img
            src={item.avatar}
            alt={item.name}
            className="testimonial-feature__avatar"
            loading="lazy"
          />
          <div className="testimonial-feature__author-info">
            <span className="testimonial-feature__name">{item.name}</span>
            <span className="testimonial-feature__location">
              <i className="fa-solid fa-location-dot" /> {item.location}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="testimonial-feature__controls">
        <button
          className="testimonial-feature__btn testimonial-feature__btn--prev"
          aria-label="Previous review"
          onClick={() => goTo(current - 1)}
        >
          <i className="fa-solid fa-chevron-left" />
        </button>
        <div className="testimonial-feature__dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`testimonial-feature__dot ${i === current ? 'active' : ''}`}
              aria-label={`Review ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button
          className="testimonial-feature__btn testimonial-feature__btn--next"
          aria-label="Next review"
          onClick={() => goTo(current + 1)}
        >
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>
    </div>
  );
};
