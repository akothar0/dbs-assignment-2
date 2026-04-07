'use client';

import { useApp } from '@/lib/context/app-context';

export default function ContactsPage() {
  const { state } = useApp();

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Contacts</h1>
      <p className="mt-2 text-muted">{state.contacts.length} people in your network</p>
      <p className="mt-8 text-sm text-muted">Full contacts list coming soon.</p>
    </div>
  );
}
