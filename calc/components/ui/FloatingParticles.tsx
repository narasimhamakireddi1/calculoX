'use client';

import { useEffect, useState } from 'react';

interface FloatingParticlesProps {
  count?: number;
  className?: string;
  duration?: number;
}

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export function FloatingParticles({
  count = 15,
  className = '',
  duration = 4000,
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generatedParticles: Particle[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2000,
      duration: duration + Math.random() * 2000,
      size: 2 + Math.random() * 4,
    }));
    setParticles(generatedParticles);
  }, [count, duration]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bottom-0 floating-particle"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            animation: `floatingParticle ${particle.duration}ms ease-out forwards`,
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}
