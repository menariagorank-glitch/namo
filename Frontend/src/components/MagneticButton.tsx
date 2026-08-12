import React, { useRef, ReactNode } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: 'a' | 'button';
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  style?: React.CSSProperties;
  id?: string;
  'aria-label'?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * MagneticButton: adds a subtle magnetic pull effect on hover.
 * The button follows the cursor slightly, then snaps back elastically on leave.
 * Disabled automatically on touch devices.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 0.35,
  as: Tag = 'button',
  href,
  onClick,
  style,
  id,
  'aria-label': ariaLabel,
  disabled,
  type = 'button',
}) => {
  const ref = useRef<HTMLElement>(null);
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isTouchDevice || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    gsap.to(ref.current, { x, y, duration: 0.4, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    if (isTouchDevice || !ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  const commonProps = {
    ref: ref as React.RefObject<HTMLAnchorElement & HTMLButtonElement>,
    className,
    style,
    id,
    'aria-label': ariaLabel,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
  };

  if (Tag === 'a') {
    return (
      <a {...commonProps} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button {...commonProps} type={type} disabled={disabled}>
      {children}
    </button>
  );
};
