'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/app-context';
import { Contact } from '@/lib/types';
import ContactForm from '@/components/contacts/ContactForm';

export default function NewContactPage() {
  const router = useRouter();
  const { dispatch } = useApp();

  const handleSubmit = (contact: Contact) => {
    dispatch({ type: 'ADD_CONTACT', payload: contact });
    router.push(`/contacts/${contact.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Add Contact</h1>
      <p className="mt-1 text-sm text-muted">Add a new person to your network.</p>
      <div className="mt-6">
        <ContactForm onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </div>
  );
}
