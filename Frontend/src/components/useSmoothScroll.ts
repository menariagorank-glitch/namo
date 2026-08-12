import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scroll and connects it to GSAP ScrollTrigger.
 * Respects `prefers-reduced-motion` — skips smooth scroll for accessibility.
 * Exposes the lenis instance on `window.__lenis` for use in Navbar / Footer.
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      // Register ScrollTrigger without Lenis so scroll animations still work,
      // but motion is minimized by CSS media query
      ScrollTrigger.normalizeScroll(false);
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Sync Lenis scroll to GSAP's ticker so ScrollTrigger stays accurate
    lenis.on('scroll', () => ScrollTrigger.update());

    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);


    // Expose for programmatic scrolls in Navbar / Footer
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);
};

/**
 * Utility: scroll to element using Lenis if available, otherwise native.
 */
export const lenisScrollTo = (
  target: string | HTMLElement | number,
  options?: { offset?: number; duration?: number }
) => {
  const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.4,
    });
  } else if (typeof target === 'string') {
    const el = document.getElementById(target.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};
