import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, error, className = '', ...props },
  ref,
) {
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-brand-textMain">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className={`w-full rounded-xl border bg-white px-3.5 py-3 text-brand-textMain transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
          hasError
            ? 'border-brand-danger focus:border-brand-danger focus:ring-red-100'
            : 'border-brand-border focus:border-brand-accent focus:ring-[color:color-mix(in_oklab,var(--focus)_48%,white)]'
        } ${className}`.trim()}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        {...props}
      />
      {hasError && (
        <p
          id={`${id}-error`}
          className="text-sm font-medium text-brand-danger"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
