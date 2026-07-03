import { useState, useEffect } from 'react';

export function useAnimatedNumber(targetValue: number, duration: number = 600) {
  const [displayValue, setDisplayValue] = useState(targetValue);

  useEffect(() => {
    if (displayValue === targetValue) return;

    const startValue = displayValue;
    const difference = targetValue - startValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: easeOutQuad for smooth deceleration
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const newValue = startValue + difference * easeProgress;

      setDisplayValue(Math.round(newValue));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [targetValue, displayValue, duration]);

  return displayValue;
}
