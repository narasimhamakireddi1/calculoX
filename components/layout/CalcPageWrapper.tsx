import type { ReactNode } from 'react';

type Category = 'Finance' | 'Health' | 'Utility';

// Full class strings must be static so Tailwind JIT picks them up at build time.
const gradients: Record<Category, string> = {
  Finance:
    'from-blue-100/60 via-blue-50/30 to-transparent dark:from-blue-500/[0.10] dark:via-blue-950/[0.05] dark:to-transparent',
  Health:
    'from-rose-100/60 via-rose-50/30 to-transparent dark:from-rose-500/[0.10] dark:via-rose-950/[0.05] dark:to-transparent',
  Utility:
    'from-violet-100/60 via-violet-50/30 to-transparent dark:from-violet-500/[0.10] dark:via-violet-950/[0.05] dark:to-transparent',
};

interface CalcPageWrapperProps {
  category: Category;
  children: ReactNode;
}

export function CalcPageWrapper({ category, children }: CalcPageWrapperProps) {
  return (
    <div className="relative">
      {/* Category ambient gradient — fades into the neutral body background by ~320px */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b ${gradients[category]}`}
      />
      {children}
    </div>
  );
}
