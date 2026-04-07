'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/context/app-context';
import { Action, ActionType, ACTION_TYPE_LABELS } from '@/lib/types';
import { getDueDateStatus } from '@/lib/utils';
import ActionCard from '@/components/actions/ActionCard';
import ActionForm from '@/components/actions/ActionForm';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

type FilterType = ActionType | 'all';
type ViewType = 'pending' | 'completed' | 'all';

const typeFilters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All Types' },
  ...Object.entries(ACTION_TYPE_LABELS).map(([value, label]) => ({ value: value as ActionType, label })),
];

export default function ActionsPage() {
  const { state, dispatch } = useApp();
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [viewFilter, setViewFilter] = useState<ViewType>('pending');
  const [showForm, setShowForm] = useState(false);

  const filteredActions = useMemo(() => {
    return state.actions
      .filter((a) => {
        if (viewFilter === 'pending' && a.completed) return false;
        if (viewFilter === 'completed' && !a.completed) return false;
        if (typeFilter !== 'all' && a.type !== typeFilter) return false;
        return true;
      })
      .sort((a, b) => {
        // Completed actions: sort by completion date desc
        if (a.completed && b.completed) {
          return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
        }
        // Pending actions: overdue first, then by due date asc
        const aStatus = getDueDateStatus(a.dueDate);
        const bStatus = getDueDateStatus(b.dueDate);
        const priority = { overdue: 0, today: 1, upcoming: 2 };
        if (priority[aStatus] !== priority[bStatus]) {
          return priority[aStatus] - priority[bStatus];
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [state.actions, typeFilter, viewFilter]);

  const handleToggle = (id: string) => dispatch({ type: 'TOGGLE_ACTION', payload: id });
  const handleDelete = (id: string) => dispatch({ type: 'DELETE_ACTION', payload: id });

  const handleAddAction = (action: Action) => {
    dispatch({ type: 'ADD_ACTION', payload: action });
    setShowForm(false);
  };

  const pendingCount = state.actions.filter((a) => !a.completed).length;
  const overdueCount = state.actions.filter(
    (a) => !a.completed && getDueDateStatus(a.dueDate) === 'overdue'
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Action Items</h1>
          <p className="mt-1 text-sm text-muted">
            {pendingCount} pending{overdueCount > 0 && <span className="text-danger"> &middot; {overdueCount} overdue</span>}
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Add Action</Button>
        )}
      </div>

      {/* Inline form for adding a new action */}
      {showForm && (
        <Card className="mt-4 p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">New Action</h2>
          <ActionForm
            contacts={state.contacts}
            onSubmit={handleAddAction}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      )}

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1">
          {(['pending', 'completed', 'all'] as ViewType[]).map((view) => (
            <button
              key={view}
              onClick={() => setViewFilter(view)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                viewFilter === view
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTypeFilter(filter.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                typeFilter === filter.value
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action list */}
      <div className="mt-6 space-y-3">
        {filteredActions.map((action) => {
          const contact = state.contacts.find((c) => c.id === action.contactId);
          if (!contact) return null;
          return (
            <ActionCard
              key={action.id}
              action={action}
              contact={contact}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          );
        })}
      </div>

      {filteredActions.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-muted">
            {viewFilter === 'completed'
              ? 'No completed actions yet.'
              : typeFilter !== 'all'
              ? 'No actions match this filter.'
              : 'No pending actions. Nice work!'}
          </p>
        </div>
      )}
    </div>
  );
}
