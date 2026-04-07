'use client';

import { useApp } from '@/lib/context/app-context';

export default function DashboardPage() {
  const { state } = useApp();
  const pendingActions = state.actions.filter((a) => !a.completed);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Dashboard</h1>
      <p className="mt-2 text-muted">
        {state.contacts.length} contacts &middot; {pendingActions.length} pending actions
      </p>
      <p className="mt-8 text-sm text-muted">Full dashboard coming soon.</p>
    </div>
  );
}
