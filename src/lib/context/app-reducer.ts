import { AppState, Action, Contact, Interaction, NetworkingRules } from '../types';

export type AppAction =
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'ADD_INTERACTION'; payload: Interaction }
  | { type: 'UPDATE_INTERACTION'; payload: Interaction }
  | { type: 'DELETE_INTERACTION'; payload: string }
  | { type: 'ADD_ACTION'; payload: Action }
  | { type: 'TOGGLE_ACTION'; payload: string }
  | { type: 'UPDATE_ACTION'; payload: Action }
  | { type: 'DELETE_ACTION'; payload: string }
  | { type: 'UPDATE_RULES'; payload: NetworkingRules };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };

    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };

    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter((c) => c.id !== action.payload),
        interactions: state.interactions.filter((i) => i.contactId !== action.payload),
        actions: state.actions.filter((a) => a.contactId !== action.payload),
      };

    case 'ADD_INTERACTION': {
      const interaction = action.payload;
      const updatedContacts = state.contacts.map((c) => {
        if (c.id === interaction.contactId) {
          const currentLast = c.lastInteractionAt
            ? new Date(c.lastInteractionAt)
            : new Date(0);
          const newDate = new Date(interaction.date);
          return {
            ...c,
            lastInteractionAt:
              newDate > currentLast ? interaction.date : c.lastInteractionAt,
          };
        }
        return c;
      });
      return {
        ...state,
        contacts: updatedContacts,
        interactions: [...state.interactions, interaction],
      };
    }

    case 'UPDATE_INTERACTION':
      return {
        ...state,
        interactions: state.interactions.map((i) =>
          i.id === action.payload.id ? action.payload : i
        ),
      };

    case 'DELETE_INTERACTION':
      return {
        ...state,
        interactions: state.interactions.filter((i) => i.id !== action.payload),
      };

    case 'ADD_ACTION':
      return { ...state, actions: [...state.actions, action.payload] };

    case 'TOGGLE_ACTION':
      return {
        ...state,
        actions: state.actions.map((a) =>
          a.id === action.payload
            ? {
                ...a,
                completed: !a.completed,
                completedAt: !a.completed ? new Date().toISOString() : null,
              }
            : a
        ),
      };

    case 'UPDATE_ACTION':
      return {
        ...state,
        actions: state.actions.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };

    case 'DELETE_ACTION':
      return {
        ...state,
        actions: state.actions.filter((a) => a.id !== action.payload),
      };

    case 'UPDATE_RULES':
      return { ...state, rules: action.payload };

    default:
      return state;
  }
}
