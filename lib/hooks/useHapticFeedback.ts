type HapticPattern = 'tap' | 'doubleTap' | 'success' | 'error' | 'warning';

interface HapticPatterns {
  [key: string]: number | number[];
}

const hapticPatterns: HapticPatterns = {
  tap: 10,              // 10ms single pulse
  doubleTap: [10, 20, 10],  // 3 pulses: 10ms, gap 20ms, 10ms
  success: [20, 30, 20],    // Success pattern: 20ms, gap 30ms, 20ms
  error: 50,            // Single long pulse
  warning: [20, 10, 20, 10, 20] // 5 quick pulses
};

export function useHapticFeedback() {
  const isSupported = () => {
    // Check if Vibration API is supported
    if (typeof window === 'undefined') return false;
    return 'vibrate' in navigator;
  };

  const trigger = (pattern: HapticPattern) => {
    // Gracefully handle if Vibration API is not supported
    if (!isSupported()) return;

    try {
      const vibrationPattern = hapticPatterns[pattern];
      if (vibrationPattern) {
        navigator.vibrate(vibrationPattern);
      }
    } catch (error) {
      // Silently fail if vibration fails
      console.debug('Haptic feedback unavailable:', error);
    }
  };

  const triggerCustom = (pattern: number | number[]) => {
    if (!isSupported()) return;

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.debug('Custom haptic feedback failed:', error);
    }
  };

  const stop = () => {
    if (!isSupported()) return;
    try {
      navigator.vibrate(0);
    } catch (error) {
      console.debug('Haptic stop failed:', error);
    }
  };

  return {
    trigger,
    triggerCustom,
    stop,
    isSupported: isSupported()
  };
}
