'use client';

import { useParams } from 'next/navigation';
import { useApp } from '@/lib/context/app-context';

export default function ContactDetailPage() {
  const params = useParams();
  const { state } = useApp();
  const contact = state.contacts.find((c) => c.id === params.id);

  if (!contact) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Contact Not Found</h1>
        <p className="mt-2 text-muted">This contact doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">{contact.name}</h1>
      <p className="mt-2 text-muted">{contact.role} at {contact.company}</p>
      <p className="mt-8 text-sm text-muted">Full contact detail coming soon.</p>
    </div>
  );
}
