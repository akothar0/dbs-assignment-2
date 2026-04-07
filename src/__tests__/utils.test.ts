import { formatRelativeDate, formatDate, getDueDateStatus, daysBetween } from '@/lib/utils';

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
