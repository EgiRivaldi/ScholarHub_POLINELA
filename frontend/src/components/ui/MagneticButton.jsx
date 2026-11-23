import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

export const MagneticButton = React.forwardRef(
  (
    {
      className,
      children,
      as: Component = 'button',
      strength = 0.35,
      scale = 1.05,
      ...props
    },
    forwardedRef
  ) => {
    const localRef = useRef(null);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * strength,
            y: y * strength,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: scale,
            ease: 'power2.out',
            duration: 0.35,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: 'elastic.out(1, 0.35)',
            duration: 1.1,
          });
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          element.removeEventListener('mousemove', handleMouseMove);
          element.removeEventListener('mouseleave', handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, [strength, scale]);

    return (
      <Component
        ref={(node) => {
          localRef.current = node;
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cn('cursor-pointer select-none inline-flex items-center justify-center', className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';
export default MagneticButton;
