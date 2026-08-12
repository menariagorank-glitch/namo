import React, { useState, useEffect, useRef } from 'react';
import { Testimonial } from '../types/hotel';
import { GLOBAL_TESTIMONIALS } from '../data/hotels';

interface TestimonialSliderProps {
  testimonials?: Testimonial[];
  id?: string;
}

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials = GLOBAL_TESTIMONIALS,
  id = 'testimonial-slider',
}) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (testimonials.length > 0 && !isPaused) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
      }, 6000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testimonials.length, isPaused]);

  const goTo = (index: number) => {
    setCurrent((index + testimonials.length) % testimonials.length);
  };

  const handlePrev = () => {
    goTo(current - 1);
  };

  const handleNext = () => {
    goTo(current + 1);
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div
      className="testimonial-slider"
      id={id}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="testimonial-track"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: 'transform 0.5s ease-in-out',
        }}
      >
        {testimonials.map((item) => (
          <div key={item.id} className="testimonial-card">
            <div className="testimonial-inner">
              <div className="testimonial-stars">
                {Array.from({ length: item.stars }).map((_, i) => (
                  <i key={i} className="fa-solid fa-star"></i>
                ))}
              </div>
              <p className="testimonial-text">{item.text}</p>
              <div className="testimonial-author">
                <img src={item.avatar} alt={item.name} className="testimonial-avatar" loading="lazy" />
                <div>
                  <div className="testimonial-name">{item.name}</div>
                  <div className="testimonial-location">
                    <i className="fa-solid fa-location-dot" style={{ color: 'var(--color-gold)', fontSize: '10px' }}></i> {item.location}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonial-controls">
        <button className="testimonial-btn testimonial-btn--prev" aria-label="Previous review" onClick={handlePrev}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="testimonial-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`testimonial-dot ${i === current ? 'active' : ''}`}
              aria-label={`Review ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button className="testimonial-btn testimonial-btn--next" aria-label="Next review" onClick={handleNext}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};
