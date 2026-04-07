'use client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:placeholder:text-stone-500 ${
          error ? 'border-danger' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
