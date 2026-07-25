import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

/**
 * Only a "primary" look exists so far in every screen we've inspected
 * (Next: step buttons, Checkout). We add a variant prop the moment the
 * Figma actually shows a second style — not before.
 */
export function Button({ fullWidth = false, className = '', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-lg bg-[var(--color-brand-600)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-700)] disabled:cursor-not-allowed disabled:opacity-50 ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    />
  );
}
