'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

interface ParallaxImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  speed?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function ParallaxImage({
  src,
  alt,
  width = 800,
  height = 420,
  speed = 0.5,
  className = '',
  loading = 'eager',
}: ParallaxImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;

      const element = imageRef.current;
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY;
      const elementTop = rect.top + scrollY;
      const windowHeight = window.innerHeight;

      if (rect.bottom > 0 && rect.top < windowHeight) {
        const distanceFromTop = scrollY + windowHeight - elementTop;
        const parallaxOffset = (distanceFromTop - windowHeight / 2) * speed;
        element.style.transform = `translateY(${parallaxOffset}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={imageRef}
      className={`overflow-hidden parallax-image ${className}`}
      style={{
        willChange: 'transform',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className="w-full h-full object-cover"
        priority={loading === 'eager'}
      />
    </div>
  );
}
