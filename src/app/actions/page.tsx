'use client';

import { useApp } from '@/lib/context/app-context';

export default function ActionsPage() {
  const { state } = useApp();
  const pendingActions = state.actions.filter((a) => !a.completed);

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Action Items</h1>
      <p className="mt-2 text-muted">{pendingActions.length} pending actions</p>
      <p className="mt-8 text-sm text-muted">Full actions list coming soon.</p>
    </div>
  );
}
