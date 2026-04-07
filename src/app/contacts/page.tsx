'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/app-context';
import { ContactStatus } from '@/lib/types';
import ContactCard from '@/components/contacts/ContactCard';
import SearchInput from '@/components/ui/SearchInput';
import Button from '@/components/ui/Button';

const statusFilters: { value: ContactStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'hot', label: 'Hot' },
  { value: 'active', label: 'Active' },
  { value: 'warm', label: 'Warm' },
  { value: 'lead', label: 'Lead' },
  { value: 'cold', label: 'Cold' },
  { value: 'inactive', label: 'Inactive' },
];

export default function ContactsPage() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'all'>('all');

  const filteredContacts = useMemo(() => {
    return state.contacts
      .filter((c) => {
        if (statusFilter !== 'all' && c.status !== statusFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            c.name.toLowerCase().includes(q) ||
            c.company.toLowerCase().includes(q) ||
            c.role.toLowerCase().includes(q) ||
            c.tags.some((t) => t.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        const aDate = a.lastInteractionAt || a.createdAt;
        const bDate = b.lastInteractionAt || b.createdAt;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
  }, [state.contacts, search, statusFilter]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Contacts</h1>
          <p className="mt-1 text-sm text-muted">
            {state.contacts.length} people in your network
          </p>
        </div>
        <Link href="/contacts/new">
          <Button>+ Add Contact</Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search contacts..."
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === filter.value
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-muted">
            {search || statusFilter !== 'all'
              ? 'No contacts match your search.'
              : 'No contacts yet. Add your first contact to get started.'}
          </p>
        </div>
      )}
    </div>
  );
}
