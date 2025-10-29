import type { ReactNode } from 'react';
import clsx from 'clsx';

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <table className={clsx('w-full table-auto border-collapse', className)}>
      {children}
    </table>
  );
}

export function TableHeader({ children, className }: TableHeaderProps) {
  return (
    <thead className={clsx(className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={clsx('space-y-2', className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, onClick }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={clsx(
        'group bg-white dark:bg-gray-800/40',
        'transition-all duration-200',
        'hover:bg-gray-50 dark:hover:bg-gray-700/60',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className }: TableHeadProps) {
  return (
    <th
      className={clsx(
        'px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-left text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tight sm:tracking-wide bg-gray-50/50 dark:bg-gray-800/30',
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={clsx('px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm align-middle', className)}>
      {children}
    </td>
  );
}
