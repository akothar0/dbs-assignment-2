export type ContactStatus = 'lead' | 'warm' | 'hot' | 'active' | 'cold' | 'inactive';

export type HowWeMet =
  | 'career-fair'
  | 'linkedin'
  | 'alumni-network'
  | 'referral'
  | 'meetup'
  | 'conference'
  | 'class-course'
  | 'other';

export const HOW_WE_MET_LABELS: Record<HowWeMet, string> = {
  'career-fair': 'Career Fair',
  'linkedin': 'LinkedIn',
  'alumni-network': 'Alumni Network',
  'referral': 'Referral',
  'meetup': 'Meetup',
  'conference': 'Conference',
  'class-course': 'Class / Course',
  'other': 'Other',
};

export const STATUS_LABELS: Record<ContactStatus, string> = {
  lead: 'Lead',
  warm: 'Warm',
  hot: 'Hot',
  active: 'Active',
  cold: 'Cold',
  inactive: 'Inactive',
};

export type InteractionType =
  | 'outreach'
  | 'coffee-chat'
  | 'follow-up'
  | 'thank-you'
  | 'referral'
  | 'interview'
  | 'other';

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  'outreach': 'Outreach',
  'coffee-chat': 'Coffee Chat',
  'follow-up': 'Follow-up',
  'thank-you': 'Thank You',
  'referral': 'Referral',
  'interview': 'Interview',
  'other': 'Other',
};

export type ActionType =
  | 'send-followup'
  | 'send-thankyou'
  | 'schedule-chat'
  | 'send-outreach'
  | 'apply'
  | 'other';

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  'send-followup': 'Send Follow-up',
  'send-thankyou': 'Send Thank You',
  'schedule-chat': 'Schedule Chat',
  'send-outreach': 'Send Outreach',
  'apply': 'Apply',
  'other': 'Other',
};

export type ActionPriority = 'low' | 'medium' | 'high';

export interface Contact {
  id: string;
  name: string;
  company: string;
  role: string;
  email: string;
  linkedIn: string;
  phone: string;
  howWeMet: HowWeMet;
  howWeMetDetail: string;
  notes: string;
  status: ContactStatus;
  tags: string[];
  createdAt: string;
  lastInteractionAt: string | null;
}

export interface Interaction {
  id: string;
  contactId: string;
  type: InteractionType;
  date: string;
  summary: string;
  notes: string;
  followUpNeeded: boolean;
}

export interface Action {
  id: string;
  contactId: string;
  type: ActionType;
  description: string;
  dueDate: string;
  priority: ActionPriority;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  messageTemplate: string | null;
}

export interface NetworkingRules {
  thankYouDeadlineHours: number;
  followUpNoResponseDays: number;
  warmContactReengageDays: number;
  coldContactReengageDays: number;
}

export interface AppState {
  contacts: Contact[];
  interactions: Interaction[];
  actions: Action[];
  rules: NetworkingRules;
}
