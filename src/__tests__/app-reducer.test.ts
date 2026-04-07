import { appReducer, AppAction } from '@/lib/context/app-reducer';
import { AppState, Contact, Interaction, Action } from '@/lib/types';

// Minimal valid state for testing
const emptyState: AppState = {
  contacts: [],
  interactions: [],
  actions: [],
  rules: {
    thankYouDeadlineHours: 24,
    followUpNoResponseDays: 7,
    warmContactReengageDays: 14,
    coldContactReengageDays: 30,
  },
};

const sampleContact: Contact = {
  id: 'c1',
  name: 'Test User',
  company: 'TestCo',
  role: 'Engineer',
  email: 'test@example.com',
  linkedIn: '',
  phone: '',
  howWeMet: 'linkedin',
  howWeMetDetail: '',
  notes: '',
  status: 'warm',
  tags: ['engineering'],
  createdAt: '2026-04-01T00:00:00Z',
  lastInteractionAt: null,
};

const sampleInteraction: Interaction = {
  id: 'i1',
  contactId: 'c1',
  type: 'coffee-chat',
  date: '2026-04-05T12:00:00Z',
  summary: 'Had coffee',
  notes: '',
  followUpNeeded: false,
};

const sampleAction: Action = {
  id: 'a1',
  contactId: 'c1',
  type: 'send-thankyou',
  description: 'Send thank-you note',
  dueDate: '2026-04-06T12:00:00Z',
  priority: 'high',
  completed: false,
  completedAt: null,
  createdAt: '2026-04-05T12:00:00Z',
  messageTemplate: null,
};

describe('appReducer', () => {
  describe('contacts', () => {
    it('ADD_CONTACT appends a new contact', () => {
      const result = appReducer(emptyState, { type: 'ADD_CONTACT', payload: sampleContact });
      expect(result.contacts).toHaveLength(1);
      expect(result.contacts[0].name).toBe('Test User');
    });

    it('UPDATE_CONTACT replaces the matching contact', () => {
      const state = { ...emptyState, contacts: [sampleContact] };
      const updated = { ...sampleContact, name: 'Updated Name' };
      const result = appReducer(state, { type: 'UPDATE_CONTACT', payload: updated });
      expect(result.contacts[0].name).toBe('Updated Name');
    });

    it('DELETE_CONTACT removes the contact and cascades to interactions and actions', () => {
      const state: AppState = {
        ...emptyState,
        contacts: [sampleContact],
        interactions: [sampleInteraction],
        actions: [sampleAction],
      };
      const result = appReducer(state, { type: 'DELETE_CONTACT', payload: 'c1' });
      expect(result.contacts).toHaveLength(0);
      expect(result.interactions).toHaveLength(0);
      expect(result.actions).toHaveLength(0);
    });

    it('DELETE_CONTACT does not affect unrelated contacts', () => {
      const otherContact = { ...sampleContact, id: 'c2', name: 'Other' };
      const state = { ...emptyState, contacts: [sampleContact, otherContact] };
      const result = appReducer(state, { type: 'DELETE_CONTACT', payload: 'c1' });
      expect(result.contacts).toHaveLength(1);
      expect(result.contacts[0].id).toBe('c2');
    });
  });

  describe('interactions', () => {
    it('ADD_INTERACTION appends and updates contact lastInteractionAt', () => {
      const state = { ...emptyState, contacts: [sampleContact] };
      const result = appReducer(state, { type: 'ADD_INTERACTION', payload: sampleInteraction });

      expect(result.interactions).toHaveLength(1);
      expect(result.contacts[0].lastInteractionAt).toBe(sampleInteraction.date);
    });

    it('ADD_INTERACTION does not overwrite a more recent lastInteractionAt', () => {
      const contactWithRecent = {
        ...sampleContact,
        lastInteractionAt: '2026-04-10T00:00:00Z', // more recent than the interaction
      };
      const state = { ...emptyState, contacts: [contactWithRecent] };
      const result = appReducer(state, { type: 'ADD_INTERACTION', payload: sampleInteraction });

      // lastInteractionAt should remain the more recent date
      expect(result.contacts[0].lastInteractionAt).toBe('2026-04-10T00:00:00Z');
    });

    it('UPDATE_INTERACTION replaces the matching interaction', () => {
      const state = { ...emptyState, interactions: [sampleInteraction] };
      const updated = { ...sampleInteraction, summary: 'Updated summary' };
      const result = appReducer(state, { type: 'UPDATE_INTERACTION', payload: updated });
      expect(result.interactions[0].summary).toBe('Updated summary');
    });

    it('DELETE_INTERACTION removes the matching interaction', () => {
      const state = { ...emptyState, interactions: [sampleInteraction] };
      const result = appReducer(state, { type: 'DELETE_INTERACTION', payload: 'i1' });
      expect(result.interactions).toHaveLength(0);
    });
  });

  describe('actions', () => {
    it('ADD_ACTION appends a new action', () => {
      const result = appReducer(emptyState, { type: 'ADD_ACTION', payload: sampleAction });
      expect(result.actions).toHaveLength(1);
    });

    it('TOGGLE_ACTION marks an action as completed with timestamp', () => {
      const state = { ...emptyState, actions: [sampleAction] };
      const result = appReducer(state, { type: 'TOGGLE_ACTION', payload: 'a1' });
      expect(result.actions[0].completed).toBe(true);
      expect(result.actions[0].completedAt).not.toBeNull();
    });

    it('TOGGLE_ACTION unchecks a completed action and clears completedAt', () => {
      const completedAction = { ...sampleAction, completed: true, completedAt: '2026-04-06T12:00:00Z' };
      const state = { ...emptyState, actions: [completedAction] };
      const result = appReducer(state, { type: 'TOGGLE_ACTION', payload: 'a1' });
      expect(result.actions[0].completed).toBe(false);
      expect(result.actions[0].completedAt).toBeNull();
    });

    it('DELETE_ACTION removes the matching action', () => {
      const state = { ...emptyState, actions: [sampleAction] };
      const result = appReducer(state, { type: 'DELETE_ACTION', payload: 'a1' });
      expect(result.actions).toHaveLength(0);
    });
  });

  describe('rules', () => {
    it('UPDATE_RULES replaces the networking rules', () => {
      const newRules = {
        thankYouDeadlineHours: 48,
        followUpNoResponseDays: 14,
        warmContactReengageDays: 21,
        coldContactReengageDays: 60,
      };
      const result = appReducer(emptyState, { type: 'UPDATE_RULES', payload: newRules });
      expect(result.rules.thankYouDeadlineHours).toBe(48);
      expect(result.rules.followUpNoResponseDays).toBe(14);
    });
  });

  it('returns state unchanged for unknown action types', () => {
    const result = appReducer(emptyState, { type: 'UNKNOWN' } as unknown as AppAction);
    expect(result).toBe(emptyState);
  });
});
