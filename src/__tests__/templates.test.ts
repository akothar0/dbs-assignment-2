import { generateMessageTemplate } from '@/lib/templates';
import { Contact, Interaction } from '@/lib/types';

const sampleContact: Contact = {
  id: 'c1',
  name: 'Sarah Chen',
  company: 'Google',
  role: 'Engineering Manager',
  email: 'sarah@gmail.com',
  linkedIn: '',
  phone: '',
  howWeMet: 'career-fair',
  howWeMetDetail: '',
  notes: '',
  status: 'hot',
  tags: [],
  createdAt: '2026-04-01T00:00:00Z',
  lastInteractionAt: null,
};

const sampleInteraction: Interaction = {
  id: 'i1',
  contactId: 'c1',
  type: 'coffee-chat',
  date: '2026-04-05T12:00:00Z',
  summary: 'Cloud team hiring plans',
  notes: '',
  followUpNeeded: false,
};

describe('generateMessageTemplate', () => {
  it('generates a thank-you template with contact first name', () => {
    const result = generateMessageTemplate('send-thankyou', sampleContact);
    expect(result).toContain('Hi Sarah');
    expect(result).toContain('{___}');
  });

  it('includes interaction summary in thank-you when provided', () => {
    const result = generateMessageTemplate('send-thankyou', sampleContact, sampleInteraction);
    expect(result).toContain('Cloud team hiring plans');
  });

  it('generates a follow-up template without interaction context', () => {
    const result = generateMessageTemplate('send-followup', sampleContact);
    expect(result).toContain('Hi Sarah');
    expect(result).toContain('my previous message');
  });

  it('generates a follow-up template with interaction context', () => {
    const result = generateMessageTemplate('send-followup', sampleContact, sampleInteraction);
    expect(result).toContain('our conversation about Cloud team hiring plans');
  });

  it('generates an outreach template with company name', () => {
    const result = generateMessageTemplate('send-outreach', sampleContact);
    expect(result).toContain('Google');
    expect(result).toContain('Hi Sarah');
  });

  it('generates a schedule-chat template with company name', () => {
    const result = generateMessageTemplate('schedule-chat', sampleContact);
    expect(result).toContain('Google');
    expect(result).toContain('times work for you');
  });

  it('generates an apply template with company and role', () => {
    const result = generateMessageTemplate('apply', sampleContact);
    expect(result).toContain('Google');
    expect(result).toContain('Engineering Manager');
  });

  it('generates a generic "other" template', () => {
    const result = generateMessageTemplate('other', sampleContact);
    expect(result).toContain('Sarah');
    expect(result).toContain('Google');
  });

  it('all templates include a {___} placeholder for user input', () => {
    const types = ['send-thankyou', 'send-followup', 'send-outreach', 'schedule-chat', 'apply', 'other'] as const;
    for (const type of types) {
      const result = generateMessageTemplate(type, sampleContact);
      expect(result).toContain('{___}');
    }
  });

  it('uses first name only, not full name', () => {
    const result = generateMessageTemplate('send-outreach', sampleContact);
    expect(result).toContain('Hi Sarah');
    expect(result).not.toContain('Hi Sarah Chen');
  });

  it('handles a contact with a single-word name', () => {
    const singleName = { ...sampleContact, name: 'Madonna' };
    const result = generateMessageTemplate('send-thankyou', singleName);
    expect(result).toContain('Hi Madonna');
  });
});
