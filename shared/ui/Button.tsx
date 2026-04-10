import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export default function Button({
  children,
  isLoading = false,
  disabled,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`w-full rounded-xl bg-brand-accent px-4 py-3.5 text-sm font-bold text-white transition duration-150 hover:-translate-y-0.5 hover:bg-brand-accentHover focus:outline-none focus:ring-4 focus:ring-[color:color-mix(in_oklab,var(--focus)_48%,white)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Procesando...' : children}
    </button>
  );
}
