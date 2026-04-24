import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingContent?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
};

export default function Button({
  children,
  isLoading = false,
  loadingContent,
  leftIcon,
  rightIcon,
  disabled,
  iconOnly = false,
  className = '',
  ...props
}: ButtonProps) {
  const renderIcon = (icon: ReactNode) =>
    isValidElement(icon)
      ? cloneElement(icon as React.ReactElement<{ size?: number }>, {
          size: 20,
        })
      : icon;

  return (
    <button
      disabled={disabled || isLoading}
      className={`w-full flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3.5 text-sm font-bold text-white transition duration-150 enabled:hover:bg-rose-600 enabled:hover:cursor-pointer focus:outline-none focus:ring-4 disabled:opacity-40 disabled:cursor-default min-h-12 max-h-12 ${className}`}
      {...props}
    >
      {isLoading ? (
        (loadingContent ?? children)
      ) : iconOnly ? (
        renderIcon(leftIcon || rightIcon)
      ) : (
        <>
          {leftIcon && (
            <span className="flex items-center">{renderIcon(leftIcon)}</span>
          )}
          <span>{children}</span>
          {rightIcon && (
            <span className="flex items-center">{renderIcon(rightIcon)}</span>
          )}
        </>
      )}{' '}
    </button>
  );
}
