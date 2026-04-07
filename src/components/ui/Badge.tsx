'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'slate' | 'blue' | 'amber' | 'red' | 'emerald' | 'stone' | 'indigo';
  size?: 'sm' | 'md';
}

const variantClasses: Record<string, string> = {
  default: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
  stone: 'bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
};

export default function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      } ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
