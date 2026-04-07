'use client';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-stone-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:placeholder:text-stone-500 ${
          error ? 'border-danger' : ''
        } ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
