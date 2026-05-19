'use client';

import { type ButtonHTMLAttributes, forwardRef } from 'react';

type SwitchOmittedKeys = 'onChange' | 'role' | 'aria-checked' | 'type';

export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, SwitchOmittedKeys> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
}

const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked,
    onCheckedChange,
    disabled = false,
    className = '',
    label,
    onClick,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        onCheckedChange?.(!checked);
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-brand-border transition-colors duration-150 focus:outline-none focus:ring-4 focus:ring-[color:color-mix(in_oklab,var(--focus)_48%,white)] disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? 'bg-brand-accent' : 'bg-brand-surface'
      } ${className}`.trim()}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-150 ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
});

export default Switch;
