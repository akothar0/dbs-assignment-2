'use client';

import { Interaction, INTERACTION_TYPE_LABELS } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const typeVariant: Record<string, 'indigo' | 'emerald' | 'amber' | 'blue' | 'red' | 'slate' | 'default'> = {
  outreach: 'indigo',
  'coffee-chat': 'emerald',
  'follow-up': 'amber',
  'thank-you': 'blue',
  referral: 'slate',
  interview: 'red',
  other: 'default',
};

interface InteractionTimelineProps {
  interactions: Interaction[];
  onEdit: (interaction: Interaction) => void;
  onDelete: (id: string) => void;
}

export default function InteractionTimeline({ interactions, onEdit, onDelete }: InteractionTimelineProps) {
  const sorted = [...interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sorted.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted">
        No interactions yet. Log your first one below.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((interaction) => (
        <div
          key={interaction.id}
          className="relative border-l-2 border-stone-200 pl-4 dark:border-stone-700"
        >
          <div className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-surface bg-primary" />
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={typeVariant[interaction.type] || 'default'}>
                  {INTERACTION_TYPE_LABELS[interaction.type]}
                </Badge>
                <span className="text-xs text-muted">{formatDate(interaction.date)}</span>
              </div>
              <p className="mt-1 font-medium text-stone-900 dark:text-stone-100">
                {interaction.summary}
              </p>
              {interaction.notes && (
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
                  {interaction.notes}
                </p>
              )}
              {interaction.followUpNeeded && (
                <span className="mt-1 inline-block text-xs font-medium text-amber-600 dark:text-amber-400">
                  Follow-up needed
                </span>
              )}
            </div>
            <div className="ml-2 flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => onEdit(interaction)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(interaction.id)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
