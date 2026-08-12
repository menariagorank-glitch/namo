import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MagneticButton } from './MagneticButton';

gsap.registerPlugin(ScrollTrigger);

const SLIDES = [
  {
    id: 0,
    image: '/images/kushal-bagh-palace.jpg',
    alt: 'The Kushal Bagh Palace — Heritage Palace, Udaipur',
    location: 'Udaipur, Rajasthan',
    chapter: '01',
  },
  {
    id: 1,
    image: '/images/namo-desert-camp.jpg',
    alt: 'Namo Desert Camp Talai — Sam Sand Dunes, Jaisalmer',
    location: 'Jaisalmer, Rajasthan',
    chapter: '02',
  },
  {
    id: 2,
    image: '/images/sun-hill-resort.jpg',
    alt: 'Sun Hill Resort — Panther Point, Kumbhalgarh',
    location: 'Kumbhalgarh, Rajasthan',
    chapter: '03',
  },
];

const HERO_MAIN_WORDS = ['Experience', 'Royal', 'Hospitality'];
const HERO_EM_WORDS   = ['Across', 'Rajasthan'];
const PARTICLE_COUNT  = 22;

type LenisWindow = Window & { __lenis?: { scrollTo: (t: string | HTMLElement | number, o?: object) => void } };

const lenisTo = (id: string) => {
  const lenis = (window as LenisWindow).__lenis;
  const el = document.getElementById(id);
  if (el) {
    if (lenis) lenis.scrollTo(el, { offset: -80 });
    else el.scrollIntoView({ behavior: 'smooth' });
  }
};

export const CinematicHero: React.FC = () => {
  const heroRef     = useRef<HTMLElement>(null);
  const bgRef       = useRef<HTMLDivElement>(null);
  const veilRef     = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const labelRef    = useRef<HTMLParagraphElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const actionsRef  = useRef<HTMLDivElement>(null);
  const ornamentRef = useRef<HTMLDivElement>(null);
  const slideRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const chapterRef  = useRef<HTMLSpanElement>(null);

  const [current, setCurrent]             = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused]           = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Auto-cycle slides ── */
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrent(prev => (prev + 1) % SLIDES.length);
      }, 6500);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused]);

  /* ── GSAP crossfade between slides ── */
  useEffect(() => {
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      if (i === current) {
        gsap.to(slide, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.inOut' });
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 1400);

        // chapter number tick
        if (chapterRef.current) {
          gsap.fromTo(chapterRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
          );
        }
      } else {
        gsap.to(slide, { opacity: 0, scale: 1.06, duration: 1.4, ease: 'power2.inOut' });
      }
    });
  }, [current]);

  /* ── Dramatic cinematic entrance + scroll parallax ── */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      /* 1. BG zooms out dramatically from over-scale */
      tl.fromTo(bgRef.current,
        { scale: 1.4 },
        { scale: 1.0, duration: 2.6, ease: 'power2.out' },
        0
      );

      /* 2. Cinematic veil peels back */
      const topBar    = heroRef.current?.querySelector<HTMLElement>('.hero-veil__top');
      const bottomBar = heroRef.current?.querySelector<HTMLElement>('.hero-veil__bottom');
      if (topBar && bottomBar) {
        tl.to(topBar,    { yPercent: -100, duration: 1.6, ease: 'power4.inOut' }, 0.2);
        tl.to(bottomBar, { yPercent:  100, duration: 1.6, ease: 'power4.inOut' }, 0.2);
      } else if (veilRef.current) {
        tl.to(veilRef.current, { opacity: 0, duration: 1.6, ease: 'power2.inOut' }, 0.2);
      }

      /* 3. Label */
      tl.from(labelRef.current, { opacity: 0, y: 32, duration: 1.0 }, 1.0);

      /* 4. Words reveal: each word slides up from beneath its clip container */
      const wordInners = headingRef.current
        ? Array.from(headingRef.current.querySelectorAll<HTMLElement>('.hero-word__inner'))
        : [];
      if (wordInners.length > 0) {
        tl.from(wordInners, {
          yPercent: 120,
          opacity: 0,
          stagger: 0.09,
          duration: 1.1,
        }, 1.3);
      }

      /* 5. Subtitle reveal */
      tl.from(subRef.current, { opacity: 0, y: 56, duration: 1.1 }, 1.9);

      /* 6. Ornament draws in */
      tl.from(ornamentRef.current, { opacity: 0, scaleX: 0, duration: 1.0 }, 2.1);

      /* 7. CTA buttons spring up with bounce */
      const btns = actionsRef.current ? Array.from(actionsRef.current.children) : [];
      tl.from(btns, {
        opacity: 0,
        y: 48,
        scale: 0.85,
        stagger: 0.18,
        duration: 1.0,
        ease: 'back.out(1.7)',
      }, 2.2);

      /* ── Scroll-driven: BG strong parallax ── */
      gsap.to(bgRef.current, {
        yPercent: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      /* ── Scroll-driven: content wipes out fast ── */
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -120,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: '8% top',
          end: '50% top',
          scrub: 1.2,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="cinematic-hero"
      id="home"
      aria-label="NAMO Hotel & Travel Hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background slides */}
      <div ref={bgRef} className="cinematic-hero__bg">
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            ref={el => { slideRefs.current[idx] = el; }}
            className={`cinematic-hero__slide ${idx === 0 ? 'cinematic-hero__slide--active' : ''}`}
            aria-hidden={idx !== current}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="cinematic-hero__slide-img"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>

      {/* Cinematic letterbox veil (two bars) */}
      <div ref={veilRef} className="hero-veil" aria-hidden="true">
        <div className="hero-veil__top" />
        <div className="hero-veil__bottom" />
      </div>

      {/* Layered overlays */}
      <div className="cinematic-hero__overlay" />
      <div className="cinematic-hero__overlay-vignette" />

      {/* Chapter number watermark */}
      <span ref={chapterRef} className="cinematic-hero__chapter" aria-hidden="true">
        {SLIDES[current].chapter}
      </span>

      {/* Atmospheric particles */}
      <div className="cinematic-hero__particles" aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <span
            key={i}
            className="cinematic-hero__particle"
            style={{
              left:              `${5  + (i * 73)  % 90}%`,
              bottom:            `${10 + (i * 37)  % 60}%`,
              animationDelay:    `${(i * 0.7) % 8}s`,
              animationDuration: `${8 + (i * 1.3) % 12}s`,
              width:             `${2 + (i * 0.8) % 4}px`,
              height:            `${2 + (i * 0.8) % 4}px`,
              opacity:           0.12 + (i * 0.025) % 0.28,
            }}
          />
        ))}
      </div>

      {/* Gold ornament */}
      <div ref={ornamentRef} className="cinematic-hero__ornament" aria-hidden="true">
        <svg viewBox="0 0 280 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="cinematic-hero__ornament-svg">
          <line x1="0"   y1="12" x2="100" y2="12" stroke="#C9A227" strokeWidth="0.75" strokeOpacity="0.65" />
          <path d="M108 12 L118 3 L128 12 L118 21 Z" fill="#C9A227" fillOpacity="0.75" />
          <circle cx="140" cy="12" r="4.5" fill="#C9A227" fillOpacity="0.9" />
          <path d="M152 12 L162 3 L172 12 L162 21 Z" fill="#C9A227" fillOpacity="0.75" />
          <line x1="180" y1="12" x2="280" y2="12" stroke="#C9A227" strokeWidth="0.75" strokeOpacity="0.65" />
        </svg>
      </div>

      {/* ── Main Content ── */}
      <div ref={contentRef} className="cinematic-hero__content">
        <p ref={labelRef} className="cinematic-hero__label">
          Est. In Rajasthan, India
        </p>

        {/* Word-by-word animated heading */}
        <h1 ref={headingRef} className="cinematic-hero__heading">
          <span className="hero-word-line">
            {HERO_MAIN_WORDS.map((word, i) => (
              <span key={i} className="hero-word">
                <span className="hero-word__inner">{word}</span>
              </span>
            ))}
          </span>
          <em className="cinematic-hero__heading-em">
            <span className="hero-word-line">
              {HERO_EM_WORDS.map((word, i) => (
                <span key={i} className="hero-word">
                  <span className="hero-word__inner">{word}</span>
                </span>
              ))}
            </span>
          </em>
        </h1>

        <p ref={subRef} className="cinematic-hero__sub">
          Discover heritage palaces, luxury resorts, desert camps and adventure camps —<br />
          curated under one trusted hospitality brand.
        </p>

        <div ref={actionsRef} className="cinematic-hero__actions">
          <MagneticButton
            as="a" href="#hotels"
            className="btn btn-gold btn-lg cinematic-hero__btn-primary"
            onClick={e => { e.preventDefault(); lenisTo('hotels'); }}
          >
            Explore Properties
          </MagneticButton>
          <MagneticButton
            as="a" href="#contact"
            className="btn btn-outline-white btn-lg"
            onClick={e => { e.preventDefault(); lenisTo('contact'); }}
          >
            Plan Your Stay
          </MagneticButton>
        </div>

        {/* Current slide location */}
        <div className="cinematic-hero__slide-info" aria-live="polite">
          <i className="fa-solid fa-location-dot" style={{ color: 'var(--color-gold)', fontSize: '0.75rem' }} />
          <span>{SLIDES[current].location}</span>
        </div>
      </div>

      {/* Slide dots */}
      <div className="cinematic-hero__dots" role="tablist" aria-label="Hero slides">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            className={`cinematic-hero__dot ${idx === current && !isTransitioning ? 'active' : ''}`}
            role="tab"
            aria-label={`View ${slide.location}`}
            aria-selected={idx === current}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <button
        className="cinematic-hero__scroll-indicator"
        aria-label="Scroll to content"
        onClick={() => lenisTo('about')}
      >
        <span className="cinematic-hero__scroll-label">Scroll</span>
        <span className="cinematic-hero__scroll-mouse">
          <span className="cinematic-hero__scroll-wheel" />
        </span>
      </button>
    </section>
  );
};
