import { useRef, useCallback } from 'react';

type SwipeDirection = 'left' | 'right' | 'up' | 'down';

interface SwipeConfig {
  threshold?: number;
  onSwipe: (direction: SwipeDirection, velocity: number) => void;
}

interface TouchCoordinates {
  x: number;
  y: number;
  timestamp: number;
}

export function useSwipeGesture(config: SwipeConfig) {
  const {
    threshold = 50,
    onSwipe
  } = config;

  const touchStartRef = useRef<TouchCoordinates | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      timestamp: Date.now()
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      timestamp: Date.now()
    };

    const diffX = touchStartRef.current.x - touchEnd.x;
    const diffY = touchStartRef.current.y - touchEnd.y;
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const timeDiff = touchEnd.timestamp - touchStartRef.current.timestamp;
    const velocity = distance / timeDiff;

    // Determine primary direction
    const isHorizontal = Math.abs(diffX) > Math.abs(diffY);

    if (isHorizontal && Math.abs(diffX) > threshold) {
      // Horizontal swipe
      if (diffX > 0) {
        // Swipe left (dragged left, so element moved left)
        onSwipe('left', velocity);
      } else {
        // Swipe right
        onSwipe('right', velocity);
      }
    } else if (!isHorizontal && Math.abs(diffY) > threshold) {
      // Vertical swipe
      if (diffY > 0) {
        // Swipe up
        onSwipe('up', velocity);
      } else {
        // Swipe down
        onSwipe('down', velocity);
      }
    }

    touchStartRef.current = null;
  }, [threshold, onSwipe]);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  };
}
