import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingContent?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export default function Button({
  children,
  isLoading = false,
  loadingContent,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3.5 text-sm font-bold text-white transition duration-150 enabled:hover:bg-violet-700 enabled:hover:cursor-pointer focus:outline-none focus:ring-4 disabled:opacity-40 disabled:cursor-default ${className}`}
      {...props}
    >
      {isLoading ? (
        (loadingContent ?? children)
      ) : (
        <>
          {leftIcon && <span className="flex items-center">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </>
      )}{' '}
    </button>
  );
}
