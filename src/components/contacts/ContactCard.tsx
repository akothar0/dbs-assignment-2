'use client';

import { useRouter } from 'next/navigation';
import { Contact } from '@/lib/types';
import { formatRelativeDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import StatusBadge from './StatusBadge';

export default function ContactCard({ contact }: { contact: Contact }) {
  const router = useRouter();

  return (
    <Card hover onClick={() => router.push(`/contacts/${contact.id}`)}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">
              {contact.name}
            </h3>
            <p className="mt-0.5 text-sm text-muted">
              {contact.role} at {contact.company}
            </p>
          </div>
          <StatusBadge status={contact.status} />
        </div>

        {contact.notes && (
          <p className="mt-3 line-clamp-2 text-sm text-stone-600 dark:text-stone-400">
            {contact.notes}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>
            {contact.lastInteractionAt
              ? `Last contact: ${formatRelativeDate(contact.lastInteractionAt)}`
              : 'No interactions yet'}
          </span>
          {contact.tags.length > 0 && (
            <div className="flex gap-1">
              {contact.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-stone-100 px-1.5 py-0.5 text-stone-500 dark:bg-stone-800 dark:text-stone-400"
                >
                  {tag}
                </span>
              ))}
              {contact.tags.length > 2 && (
                <span className="text-stone-400">+{contact.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
