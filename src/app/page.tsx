'use client';

import Link from 'next/link';
import { useApp } from '@/lib/context/app-context';
import { getDueDateStatus, daysBetween } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import StatusBadge from '@/components/contacts/StatusBadge';
import PipelineBar from '@/components/contacts/PipelineBar';

export default function DashboardPage() {
  const { state } = useApp();

  const pendingActions = state.actions.filter((a) => !a.completed);
  const overdueActions = pendingActions.filter((a) => getDueDateStatus(a.dueDate) === 'overdue');
  const todayActions = pendingActions.filter((a) => getDueDateStatus(a.dueDate) === 'today');
  const todayAndOverdue = [...overdueActions, ...todayActions];

  // Due this week: pending actions due within the next 7 days (excluding overdue)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const dueThisWeek = pendingActions.filter((a) => {
    const due = new Date(a.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due >= today && due <= nextWeek;
  });

  // Hot leads: contacts with hot or active status
  const hotLeads = state.contacts.filter((c) => c.status === 'hot' || c.status === 'active');

  // Contacts needing attention: warm/hot with no interaction in warmContactReengageDays,
  // cold with no interaction in coldContactReengageDays, or leads with no interactions
  const now = new Date().toISOString();
  const contactsNeedingAttention = state.contacts.filter((c) => {
    if (c.status === 'inactive') return false;
    if (c.status === 'lead' && !c.lastInteractionAt) return true;
    if (!c.lastInteractionAt) return true;
    const daysSince = daysBetween(c.lastInteractionAt, now);
    if ((c.status === 'warm' || c.status === 'hot' || c.status === 'active') && daysSince >= state.rules.warmContactReengageDays) return true;
    if (c.status === 'cold' && daysSince >= state.rules.coldContactReengageDays) return true;
    return false;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Your networking overview at a glance.</p>

      {/* Stats row */}
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Link href="/contacts">
          <Card hover className="p-4">
            <p className="text-sm text-muted">Total Contacts</p>
            <p className="mt-1 text-2xl font-bold text-stone-900 dark:text-stone-100">{state.contacts.length}</p>
            <p className="mt-1 text-xs text-muted">
              {hotLeads.length} hot/active lead{hotLeads.length !== 1 ? 's' : ''}
            </p>
          </Card>
        </Link>
        <Link href="/actions">
          <Card hover className="p-4">
            <p className="text-sm text-muted">Due This Week</p>
            <p className="mt-1 text-2xl font-bold text-stone-900 dark:text-stone-100">{dueThisWeek.length}</p>
            <p className="mt-1 text-xs text-muted">
              {pendingActions.length} total pending
            </p>
          </Card>
        </Link>
        <Card className={`p-4 ${overdueActions.length > 0 ? 'border-danger/50' : ''}`}>
          <p className="text-sm text-muted">Overdue</p>
          <p className={`mt-1 text-2xl font-bold ${overdueActions.length > 0 ? 'text-danger' : 'text-stone-900 dark:text-stone-100'}`}>
            {overdueActions.length}
          </p>
          <p className="mt-1 text-xs text-muted">
            {overdueActions.length > 0 ? 'needs your attention' : 'you\'re on track'}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted">Need Attention</p>
          <p className={`mt-1 text-2xl font-bold ${contactsNeedingAttention.length > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-stone-900 dark:text-stone-100'}`}>
            {contactsNeedingAttention.length}
          </p>
          <p className="mt-1 text-xs text-muted">
            contact{contactsNeedingAttention.length !== 1 ? 's' : ''} going quiet
          </p>
        </Card>
      </div>

      {/* Pipeline: visual breakdown of contacts by status */}
      {state.contacts.length > 0 && (
        <Card className="mt-6 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Networking Pipeline
          </h2>
          <PipelineBar contacts={state.contacts} />
        </Card>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Today's Actions */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900 dark:text-stone-100">
              Today&apos;s Actions
              {todayAndOverdue.length > 0 && (
                <Badge variant="red" size="md">
                  {todayAndOverdue.length}
                </Badge>
              )}
            </h2>
            <Link href="/actions" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {todayAndOverdue.length === 0 && (
              <Card className="p-4">
                <p className="text-sm text-muted">No urgent actions. You&apos;re on track!</p>
              </Card>
            )}
            {todayAndOverdue.map((action) => {
              const contact = state.contacts.find((c) => c.id === action.contactId);
              const dueDateStatus = getDueDateStatus(action.dueDate);
              return (
                <Card key={action.id} className="p-3">
                  <div className="flex items-start gap-2">
                    <div
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                        dueDateStatus === 'overdue' ? 'bg-danger' : 'bg-amber-500'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                        {action.description}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                        {contact && (
                          <Link href={`/contacts/${contact.id}`} className="text-primary hover:underline">
                            {contact.name}
                          </Link>
                        )}
                        <span>
                          {dueDateStatus === 'overdue' ? 'Overdue' : 'Due today'}
                        </span>
                        <Badge variant={action.priority === 'high' ? 'red' : action.priority === 'medium' ? 'amber' : 'default'}>
                          {action.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Contacts Needing Attention */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900 dark:text-stone-100">
              Contacts Needing Attention
              {contactsNeedingAttention.length > 0 && (
                <Badge variant="amber" size="md">
                  {contactsNeedingAttention.length}
                </Badge>
              )}
            </h2>
            <Link href="/contacts" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {contactsNeedingAttention.length === 0 && (
              <Card className="p-4">
                <p className="text-sm text-muted">All contacts are up to date!</p>
              </Card>
            )}
            {contactsNeedingAttention.map((contact) => {
              const daysSince = contact.lastInteractionAt
                ? daysBetween(contact.lastInteractionAt, now)
                : null;
              return (
                <Link key={contact.id} href={`/contacts/${contact.id}`}>
                  <Card hover className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                          {contact.name}
                        </p>
                        <p className="text-xs text-muted">
                          {contact.role} at {contact.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">
                          {daysSince !== null
                            ? `${daysSince}d since last contact`
                            : 'No contact yet'}
                        </span>
                        <StatusBadge status={contact.status} />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
