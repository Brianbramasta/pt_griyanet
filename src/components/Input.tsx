import React, { InputHTMLAttributes, forwardRef } from 'react';

/**
 * Input component props
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
}

/**
 * Input component for form fields
 * @param label - Label text for the input
 * @param error - Error message to display
 * @param className - Additional CSS classes for the input element
 * @param containerClassName - Additional CSS classes for the container
 * @param labelClassName - Additional CSS classes for the label
 * @param errorClassName - Additional CSS classes for the error message
 * @param props - Additional input attributes
 */
const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    error,
    className = '',
    containerClassName = '',
    labelClassName = '',
    errorClassName = '',
    ...props
  },
  ref
) => {
  // Generate a unique ID for the input
  const id = React.useId();

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`
          flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
          ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-destructive' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className={`text-sm text-destructive ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;