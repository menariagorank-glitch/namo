import React, { useRef, useEffect, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollSceneProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * ScrollScene: wraps a section with a properly cleaned-up GSAP context.
 * Any GSAP animations created inside child components will be automatically
 * reverted on unmount.
 */
export const ScrollScene: React.FC<ScrollSceneProps> = ({
  children,
  className = '',
  id,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={className} id={id}>
      {children}
    </div>
  );
};
