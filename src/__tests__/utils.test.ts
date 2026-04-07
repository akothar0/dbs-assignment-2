import { formatRelativeDate, formatDate, getDueDateStatus, daysBetween, getPipelineCounts } from '@/lib/utils';
import { Contact } from '@/lib/types';

describe('formatRelativeDate', () => {
  it('returns "Today" for the current date', () => {
    const now = new Date().toISOString();
    expect(formatRelativeDate(now)).toBe('Today');
  });

  it('returns "Yesterday" for one day ago', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(yesterday)).toBe('Yesterday');
  });

  it('returns "X days ago" for 2-6 days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(threeDaysAgo)).toBe('3 days ago');
  });

  it('returns "X weeks ago" for 7-29 days ago', () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(twoWeeksAgo)).toBe('2 weeks ago');
  });

  it('returns "X months ago" for 30+ days ago', () => {
    const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(twoMonthsAgo)).toBe('2 months ago');
  });

  it('returns a future-relative string for dates ahead', () => {
    // formatRelativeDate uses Math.floor on the ms diff, so fractional days
    // round toward the larger absolute value for future dates
    const inTwoDays = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(inTwoDays)).toMatch(/In \d+ days/);
  });

  it('returns "In X days" for 2-6 days in the future', () => {
    const inFiveDays = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeDate(inFiveDays)).toBe('In 5 days');
  });
});

describe('formatDate', () => {
  it('formats a date as "Mon DD, YYYY"', () => {
    const result = formatDate('2026-04-07T12:00:00.000Z');
    expect(result).toMatch(/Apr 7, 2026/);
  });
});

describe('getDueDateStatus', () => {
  it('returns "today" for a date matching today', () => {
    const today = new Date().toISOString();
    expect(getDueDateStatus(today)).toBe('today');
  });

  it('returns "overdue" for a past date', () => {
    const yesterday = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(getDueDateStatus(yesterday)).toBe('overdue');
  });

  it('returns "upcoming" for a future date', () => {
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    expect(getDueDateStatus(nextWeek)).toBe('upcoming');
  });
});

describe('daysBetween', () => {
  it('returns 0 for the same date', () => {
    const date = '2026-04-07T12:00:00.000Z';
    expect(daysBetween(date, date)).toBe(0);
  });

  it('returns correct number of days between two dates', () => {
    expect(daysBetween('2026-04-01T00:00:00Z', '2026-04-08T00:00:00Z')).toBe(7);
  });

  it('is commutative (order does not matter)', () => {
    const a = '2026-04-01T00:00:00Z';
    const b = '2026-04-10T00:00:00Z';
    expect(daysBetween(a, b)).toBe(daysBetween(b, a));
  });
});

// Helper to build a minimal contact with a given status
function makeContact(id: string, status: Contact['status']): Contact {
  return {
    id, name: 'Test', company: 'Co', role: 'Eng', email: '', linkedIn: '',
    phone: '', howWeMet: 'linkedin', howWeMetDetail: '', notes: '',
    status, tags: [], createdAt: '2026-04-01T00:00:00Z', lastInteractionAt: null,
  };
}

describe('getPipelineCounts', () => {
  it('returns empty array for no contacts', () => {
    expect(getPipelineCounts([])).toEqual([]);
  });

  it('counts contacts by status', () => {
    const contacts = [
      makeContact('1', 'hot'),
      makeContact('2', 'hot'),
      makeContact('3', 'warm'),
      makeContact('4', 'lead'),
    ];
    const counts = getPipelineCounts(contacts);
    expect(counts).toEqual([
      { status: 'lead', count: 1 },
      { status: 'warm', count: 1 },
      { status: 'hot', count: 2 },
    ]);
  });

  it('excludes statuses with zero contacts', () => {
    const contacts = [makeContact('1', 'active')];
    const counts = getPipelineCounts(contacts);
    expect(counts).toHaveLength(1);
    expect(counts[0]).toEqual({ status: 'active', count: 1 });
  });

  it('maintains pipeline order (lead → cold → warm → hot → active → inactive)', () => {
    const contacts = [
      makeContact('1', 'active'),
      makeContact('2', 'lead'),
      makeContact('3', 'hot'),
    ];
    const statuses = getPipelineCounts(contacts).map((c) => c.status);
    expect(statuses).toEqual(['lead', 'hot', 'active']);
  });

  it('includes inactive contacts when present', () => {
    const contacts = [
      makeContact('1', 'warm'),
      makeContact('2', 'inactive'),
    ];
    const counts = getPipelineCounts(contacts);
    expect(counts).toEqual([
      { status: 'warm', count: 1 },
      { status: 'inactive', count: 1 },
    ]);
  });
});
