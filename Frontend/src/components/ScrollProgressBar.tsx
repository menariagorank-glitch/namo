import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollProgressBar — A fixed left-edge vertical line that fills as the user
 * scrolls down the page, providing a subtle narrative "story progress" indicator.
 */
export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const scrollTop    = window.scrollY || document.documentElement.scrollTop;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const pct          = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setProgress(pct);
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div
        className="scroll-progress__fill"
        style={{ height: `${progress}%` }}
      />
    </div>
  );
};
