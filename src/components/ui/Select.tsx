import { forwardRef } from 'react';
import clsx from 'clsx';

interface SelectProps {
  label?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, children, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'w-full px-4 py-3 text-sm rounded-xl border transition-all',
            'glass-card text-gray-900 dark:text-gray-100',
            'border-gray-300/50 dark:border-gray-700/50',
            'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:shadow-lg dark:focus:ring-blue-500 dark:focus:border-blue-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'cursor-pointer',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
