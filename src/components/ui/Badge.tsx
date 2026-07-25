import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'discount' | 'neutral';
}

const TONE_CLASSES: Record<NonNullable<BadgeProps['tone']>, string> = {
  discount: 'bg-[var(--color-brand-600)] text-white',
  neutral: 'bg-transparent text-[var(--color-brand-600)]',
};

/** Small pill used for "Save 22%" badges and "N selected" step indicators. */
export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
