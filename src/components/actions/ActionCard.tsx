'use client';

import Link from 'next/link';
import { Action, Contact, ACTION_TYPE_LABELS } from '@/lib/types';
import { formatDate, getDueDateStatus } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import MessageTemplate from './MessageTemplate';

interface ActionCardProps {
  action: Action;
  contact: Contact;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ActionCard({ action, contact, onToggle, onDelete }: ActionCardProps) {
  const dueDateStatus = getDueDateStatus(action.dueDate);

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={action.completed}
          onChange={() => onToggle(action.id)}
          className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className={`text-sm font-medium ${action.completed ? 'text-muted line-through' : 'text-stone-900 dark:text-stone-100'}`}>
                {action.description}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Link
                  href={`/contacts/${contact.id}`}
                  className="text-xs text-primary hover:underline"
                >
                  {contact.name}
                </Link>
                <span className="text-xs text-muted">&middot;</span>
                <Badge variant={
                  action.type === 'send-thankyou' ? 'blue' :
                  action.type === 'send-followup' ? 'amber' :
                  action.type === 'send-outreach' ? 'indigo' :
                  action.type === 'schedule-chat' ? 'emerald' :
                  'default'
                }>
                  {ACTION_TYPE_LABELS[action.type]}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${
                  action.completed
                    ? 'text-muted'
                    : dueDateStatus === 'overdue'
                    ? 'text-danger'
                    : dueDateStatus === 'today'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-muted'
                }`}
              >
                {action.completed
                  ? `Done ${action.completedAt ? formatDate(action.completedAt) : ''}`
                  : dueDateStatus === 'overdue'
                  ? `Overdue (${formatDate(action.dueDate)})`
                  : dueDateStatus === 'today'
                  ? 'Due today'
                  : `Due ${formatDate(action.dueDate)}`}
              </span>
              {!action.completed && (
                <Badge variant={action.priority === 'high' ? 'red' : action.priority === 'medium' ? 'amber' : 'default'}>
                  {action.priority}
                </Badge>
              )}
              <button
                onClick={() => onDelete(action.id)}
                className="text-xs text-muted hover:text-danger"
              >
                &times;
              </button>
            </div>
          </div>

          {action.messageTemplate && !action.completed && (
            <MessageTemplate template={action.messageTemplate} />
          )}
        </div>
      </div>
    </Card>
  );
}
