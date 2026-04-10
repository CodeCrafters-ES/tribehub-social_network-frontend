'use client';

import { forwardRef, useId } from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text rendered above the input. */
  label: string;
  /** Validation error message. When present, the hint is hidden. */
  error?: string;
  /**
   * Short guidance shown below the input.
   * Hidden whenever `error` is non-empty — the error already explains
   * what needs to be corrected.
   */
  hint?: string;
}

/**
 * Base controlled input component.
 *
 * Renders: label → input → hint (when no error) → error message.
 * Connects label, hint and error to the <input> via aria attributes
 * so assistive technologies can announce the full context.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id: externalId, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const inputId = externalId ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    // aria-describedby: point to hint when visible, error when present.
    const describedBy =
      error ? errorId : hint ? hintId : undefined;

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : undefined}
          className={[
            'rounded-md border px-3 py-2 text-sm outline-none transition-colors',
            'bg-white dark:bg-slate-900',
            'text-slate-900 dark:text-slate-100',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500',
            error
              ? 'border-red-500 focus:ring-2 focus:ring-red-400'
              : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />

        {/* Hint — only when there is no active validation error */}
        {hint && !error && (
          <p
            id={hintId}
            className="text-xs text-slate-500 dark:text-slate-400"
          >
            {hint}
          </p>
        )}

        {/* Error message */}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-red-600 dark:text-red-400"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
export default Input;
