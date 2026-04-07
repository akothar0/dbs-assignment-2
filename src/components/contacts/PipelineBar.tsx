'use client';

import { Contact, ContactStatus, STATUS_LABELS } from '@/lib/types';
import { getPipelineCounts } from '@/lib/utils';

/**
 * Visual breakdown of contacts by status, shown as a segmented bar.
 * Gives the user an at-a-glance view of their networking pipeline:
 * how many contacts are at each stage from lead → active.
 */

const statusColors: Record<ContactStatus, string> = {
  lead: 'bg-slate-400',
  cold: 'bg-blue-500',
  warm: 'bg-amber-500',
  hot: 'bg-red-500',
  active: 'bg-emerald-500',
  inactive: 'bg-stone-300',
};

export default function PipelineBar({ contacts }: { contacts: Contact[] }) {
  const total = contacts.length;
  if (total === 0) return null;

  const counts = getPipelineCounts(contacts);

  return (
    <div>
      {/* Segmented bar */}
      <div className="flex h-4 overflow-hidden rounded-full">
        {counts.map(({ status, count }) => (
          <div
            key={status}
            className={`${statusColors[status]} transition-all`}
            style={{ width: `${(count / total) * 100}%` }}
            title={`${STATUS_LABELS[status]}: ${count}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {counts.map(({ status, count }) => (
          <div key={status} className="flex items-center gap-1.5 text-xs">
            <div className={`h-2.5 w-2.5 rounded-full ${statusColors[status]}`} />
            <span className="text-muted">
              {STATUS_LABELS[status]}
            </span>
            <span className="font-medium text-stone-900 dark:text-stone-100">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
