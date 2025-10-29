import { Field, Label, Input as HeadlessInput, Textarea, Description } from '@headlessui/react';
import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps {
  label?: string;
  description?: string;
  error?: string;
  className?: string;
  as?: 'input' | 'textarea';
  rows?: number;
  [key: string]: any;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, description, error, className, as = 'input', rows = 3, ...props }, ref) => {
    const Component = as === 'textarea' ? Textarea : HeadlessInput;
    
    return (
      <Field>
        {label && (
          <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </Label>
        )}
        {description && (
          <Description className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {description}
          </Description>
        )}
        <Component
          ref={ref as any}
          rows={as === 'textarea' ? rows : undefined}
          className={clsx(
            'w-full px-4 py-3 text-sm rounded-xl border transition-all',
            'glass-card text-gray-900 dark:text-gray-100',
            'border-gray-300/50 dark:border-gray-700/50',
            'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:shadow-lg dark:focus:ring-blue-500 dark:focus:border-blue-500',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            as === 'textarea' && 'resize-y',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </Field>
    );
  }
);

Input.displayName = 'Input';

export default Input;
