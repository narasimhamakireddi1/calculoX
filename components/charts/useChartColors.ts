'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';

export interface ChartTheme {
  tooltipStyle: CSSProperties;
  gridColor: string;
  axisColor: string;
  axisFill: string;
  isDark: boolean;
}

export function useChartColors(): ChartTheme {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return {
    isDark,
    tooltipStyle: {
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      borderRadius: '10px',
      color: isDark ? '#f1f5f9' : '#0f172a',
      boxShadow: isDark
        ? '0 4px 20px rgba(0,0,0,0.5)'
        : '0 4px 20px rgba(0,0,0,0.08)',
      fontSize: '13px',
      padding: '10px 14px',
    },
    gridColor: isDark ? '#1e293b' : '#f1f5f9',
    axisColor: isDark ? '#475569' : '#94a3b8',
    axisFill: isDark ? '#94a3b8' : '#64748b',
  };
}
