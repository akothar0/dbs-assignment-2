import { ActionType, Contact, Interaction } from './types';

/**
 * Generates a fill-in-the-blank message template for an action item.
 * Auto-fills contact name, company, and interaction summary where available.
 * Placeholders marked with {___} indicate fields the user should complete.
 * This scaffolds for future AI-generated messages.
 */
export function generateMessageTemplate(
  actionType: ActionType,
  contact: Contact,
  interaction?: Interaction
): string {
  const name = contact.name.split(' ')[0];

  switch (actionType) {
    case 'send-thankyou':
      return `Hi ${name}, thank you for taking the time to chat with me${interaction ? ` about ${interaction.summary}` : ''}. I especially appreciated {___}. I'd love to stay in touch and keep you updated on my search. Best regards.`;

    case 'send-followup':
      return `Hi ${name}, I hope you're doing well. I wanted to follow up on ${interaction ? `our conversation about ${interaction.summary}` : 'my previous message'}. I'd love to connect and learn more about {___}. Looking forward to hearing from you.`;

    case 'send-outreach':
      return `Hi ${name}, I came across your profile and was impressed by your work at ${contact.company}. I'm currently {___} and would love to learn more about your experience. Would you be open to a brief chat?`;

    case 'schedule-chat':
      return `Hi ${name}, thank you for being open to connecting! I'd love to schedule a quick chat to learn more about your work at ${contact.company}. Would any of these times work for you? {___}`;

    case 'apply':
      return `Application to ${contact.company} for {___} position. Reference: ${name} (${contact.role}).`;

    case 'other':
      return `Regarding ${name} at ${contact.company}: {___}`;
  }
}
