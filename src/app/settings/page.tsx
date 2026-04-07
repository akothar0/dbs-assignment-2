'use client';

import { useApp } from '@/lib/context/app-context';

export default function SettingsPage() {
  const { state } = useApp();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Settings</h1>
      <p className="mt-2 text-muted">Configure your networking rules.</p>
      <div className="mt-8 text-sm text-muted">
        <p>Current rules:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Thank-you deadline: {state.rules.thankYouDeadlineHours} hours</li>
          <li>Follow-up no response: {state.rules.followUpNoResponseDays} days</li>
          <li>Warm contact re-engage: {state.rules.warmContactReengageDays} days</li>
          <li>Cold contact re-engage: {state.rules.coldContactReengageDays} days</li>
        </ul>
        <p className="mt-4">Editable settings form coming soon.</p>
      </div>
    </div>
  );
}
