'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function MessageTemplate({ template }: { template: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-2 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-3 dark:border-stone-600 dark:bg-stone-900">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">{template}</p>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="shrink-0">
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}
