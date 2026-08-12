import React, { useState, useEffect, useRef } from 'react';

interface Slide {
  id: number;
  image: string;
  alt: string;
}

const SLIDES: Slide[] = [
  {
    id: 0,
    image: '/images/kushal-bagh-palace.jpg',
    alt: 'The Kushal Bagh Palace Udaipur — Heritage property',
  },
  {
    id: 1,
    image: '/images/namo-desert-camp.jpg',
    alt: 'Namo Desert Camp Talai — Sam, Jaisalmer',
  },
  {
    id: 2,
    image: '/images/sun-hill-resort.jpg',
    alt: 'Sun Hill Resort Kumbhalgarh — Luxury hill resort',
  },
];

export const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % SLIDES.length);
      }, 5500);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const goTo = (index: number) => {
    setCurrent(index);
  };

  const handleScrollClick = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home" aria-label="Hero">
      <div
        className="hero__slider"
        id="hero-slider"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {SLIDES.map((slide, idx) => (
          <div key={slide.id} className={`hero__slide ${idx === current ? 'active' : ''}`}>
            <img src={slide.image} alt={slide.alt} className="hero__slide-img" loading={idx === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

      <div className="hero__overlay"></div>

      <div className="hero__content">
        <p className="hero__label">Est. In Rajasthan, India</p>
        <h1 className="hero__heading">
          Experience Royal Hospitality
          <br />
          Across Rajasthan
        </h1>
        <p className="hero__subheading">
          Discover heritage palaces, luxury resorts, desert camps, adventure camps and unforgettable experiences under one trusted hospitality brand.
        </p>
        <div className="hero__actions">
          <a href="#hotels" className="btn btn-gold btn-lg">
            Explore Hotels
          </a>
          <a href="#contact" className="btn btn-outline-white btn-lg">
            Contact Us
          </a>
        </div>
      </div>

      {/* Dots */}
      <div className="hero__dots" role="tablist" aria-label="Hero slides">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`hero__dot ${idx === current ? 'active' : ''}`}
            role="tab"
            aria-label={`Slide ${idx + 1}`}
            aria-selected={idx === current}
            onClick={() => goTo(idx)}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="hero__scroll" aria-hidden="true" onClick={handleScrollClick} style={{ cursor: 'pointer' }}>
        <span>Scroll</span>
        <div className="hero__scroll-line"></div>
      </div>
    </section>
  );
};
