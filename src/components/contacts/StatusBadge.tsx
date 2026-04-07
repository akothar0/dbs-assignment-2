'use client';

import { ContactStatus, STATUS_LABELS } from '@/lib/types';
import Badge from '@/components/ui/Badge';

const statusVariant: Record<ContactStatus, 'slate' | 'blue' | 'amber' | 'red' | 'emerald' | 'stone'> = {
  lead: 'slate',
  cold: 'blue',
  warm: 'amber',
  hot: 'red',
  active: 'emerald',
  inactive: 'stone',
};

export default function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <Badge variant={statusVariant[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
