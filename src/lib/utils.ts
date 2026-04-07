/** Formats a date as a human-readable relative string (e.g., "Yesterday", "3 days ago", "In 2 weeks") */
export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const futureDays = Math.abs(diffDays);
    if (futureDays === 0) return 'Today';
    if (futureDays === 1) return 'Tomorrow';
    if (futureDays < 7) return `In ${futureDays} days`;
    return `In ${Math.ceil(futureDays / 7)} weeks`;
  }

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Compares a due date against today to determine urgency. Strips time — compares dates only. */
export function getDueDateStatus(dueDate: string): 'overdue' | 'today' | 'upcoming' {
  const due = new Date(dueDate);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());

  if (dueDay < today) return 'overdue';
  if (dueDay.getTime() === today.getTime()) return 'today';
  return 'upcoming';
}

export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

import { Contact, ContactStatus } from './types';

/** Pipeline display order: progression from earliest to most engaged stage */
export const PIPELINE_ORDER: ContactStatus[] = ['lead', 'cold', 'warm', 'hot', 'active', 'inactive'];

/** Counts contacts per status, filtered to only statuses with at least one contact */
export function getPipelineCounts(contacts: Contact[]): { status: ContactStatus; count: number }[] {
  return PIPELINE_ORDER
    .map((status) => ({
      status,
      count: contacts.filter((c) => c.status === status).length,
    }))
    .filter((s) => s.count > 0);
}
