'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context/app-context';
import { Contact, Interaction, Action, HOW_WE_MET_LABELS } from '@/lib/types';
import { formatDate, formatRelativeDate, getDueDateStatus } from '@/lib/utils';
import { generateMessageTemplate } from '@/lib/templates';
import StatusBadge from '@/components/contacts/StatusBadge';
import ContactForm from '@/components/contacts/ContactForm';
import InteractionTimeline from '@/components/interactions/InteractionTimeline';
import InteractionForm from '@/components/interactions/InteractionForm';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, dispatch } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState<Interaction | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const contact = state.contacts.find((c) => c.id === params.id);
  const interactions = state.interactions
    .filter((i) => i.contactId === params.id);
  const actions = state.actions.filter((a) => a.contactId === params.id);
  const pendingActions = actions.filter((a) => !a.completed);
  const completedActions = actions.filter((a) => a.completed);

  if (!contact) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Contact Not Found</h1>
        <p className="mt-2 text-muted">This contact doesn&apos;t exist.</p>
        <Link href="/contacts" className="mt-4 inline-block text-sm text-primary hover:underline">
          Back to contacts
        </Link>
      </div>
    );
  }

  const handleUpdateContact = (updated: Contact) => {
    dispatch({ type: 'UPDATE_CONTACT', payload: updated });
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_CONTACT', payload: contact.id });
    router.push('/contacts');
  };

  const handleAddInteraction = (interaction: Interaction) => {
    dispatch({ type: 'ADD_INTERACTION', payload: interaction });

    // Auto-create action items based on the interaction type and the user's networking rules:
    // - Coffee chat or interview → "send thank-you" due in thankYouDeadlineHours
    // - Outreach → "send follow-up" due in followUpNoResponseDays
    // Due dates are calculated relative to the interaction date, not the current time.
    const { rules } = state;
    let autoAction: Action | null = null;

    if (interaction.type === 'coffee-chat' || interaction.type === 'interview') {
      const dueDate = new Date(
        new Date(interaction.date).getTime() + rules.thankYouDeadlineHours * 60 * 60 * 1000
      ).toISOString();
      autoAction = {
        id: crypto.randomUUID(),
        contactId: contact.id,
        type: 'send-thankyou',
        description: `Send thank-you note to ${contact.name} after ${interaction.type === 'coffee-chat' ? 'coffee chat' : 'interview'}`,
        dueDate,
        priority: 'high',
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        messageTemplate: generateMessageTemplate('send-thankyou', contact, interaction),
      };
    } else if (interaction.type === 'outreach') {
      const dueDate = new Date(
        new Date(interaction.date).getTime() + rules.followUpNoResponseDays * 24 * 60 * 60 * 1000
      ).toISOString();
      autoAction = {
        id: crypto.randomUUID(),
        contactId: contact.id,
        type: 'send-followup',
        description: `Follow up with ${contact.name} if no response to outreach`,
        dueDate,
        priority: 'medium',
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString(),
        messageTemplate: generateMessageTemplate('send-followup', contact, interaction),
      };
    }

    if (autoAction) {
      dispatch({ type: 'ADD_ACTION', payload: autoAction });
    }

    setShowInteractionForm(false);
  };

  const handleEditInteraction = (interaction: Interaction) => {
    dispatch({ type: 'UPDATE_INTERACTION', payload: interaction });
    setEditingInteraction(null);
  };

  const handleDeleteInteraction = (id: string) => {
    dispatch({ type: 'DELETE_INTERACTION', payload: id });
  };

  const handleToggleAction = (id: string) => {
    dispatch({ type: 'TOGGLE_ACTION', payload: id });
  };

  const handleDeleteAction = (id: string) => {
    dispatch({ type: 'DELETE_ACTION', payload: id });
  };

  if (isEditing) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Edit Contact</h1>
        <div className="mt-6">
          <ContactForm
            initialData={contact}
            onSubmit={handleUpdateContact}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/contacts" className="text-sm text-muted hover:text-foreground">
            &larr; Back to contacts
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
              {contact.name}
            </h1>
            <StatusBadge status={contact.status} />
          </div>
          <p className="mt-1 text-muted">
            {contact.role} at {contact.company}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <Card className="mt-4 border-danger p-4">
          <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
            Delete {contact.name}? This will also remove all their interactions and action items.
          </p>
          <div className="mt-3 flex gap-2">
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Yes, delete
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left column: Info + Interactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact info */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Contact Info</h2>
            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              {contact.email && (
                <div>
                  <span className="text-muted">Email:</span>{' '}
                  <span className="text-stone-900 dark:text-stone-100">{contact.email}</span>
                </div>
              )}
              {contact.linkedIn && (
                <div>
                  <span className="text-muted">LinkedIn:</span>{' '}
                  <span className="text-stone-900 dark:text-stone-100">{contact.linkedIn}</span>
                </div>
              )}
              {contact.phone && (
                <div>
                  <span className="text-muted">Phone:</span>{' '}
                  <span className="text-stone-900 dark:text-stone-100">{contact.phone}</span>
                </div>
              )}
              <div>
                <span className="text-muted">How we met:</span>{' '}
                <span className="text-stone-900 dark:text-stone-100">
                  {HOW_WE_MET_LABELS[contact.howWeMet]}
                  {contact.howWeMetDetail && ` — ${contact.howWeMetDetail}`}
                </span>
              </div>
              {contact.tags.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-muted">Tags:</span>{' '}
                  <span className="inline-flex gap-1">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="default">{tag}</Badge>
                    ))}
                  </span>
                </div>
              )}
            </div>
            {contact.notes && (
              <div className="mt-4 border-t border-border pt-3">
                <span className="text-sm text-muted">Notes:</span>
                <p className="mt-1 text-sm text-stone-700 dark:text-stone-300">{contact.notes}</p>
              </div>
            )}
          </Card>

          {/* Interactions */}
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                Interactions ({interactions.length})
              </h2>
              {!showInteractionForm && !editingInteraction && (
                <Button size="sm" onClick={() => setShowInteractionForm(true)}>
                  + Log Interaction
                </Button>
              )}
            </div>

            {showInteractionForm && (
              <div className="mt-4 rounded-lg border border-border bg-stone-50 p-4 dark:bg-stone-900">
                <InteractionForm
                  contactId={contact.id}
                  onSubmit={handleAddInteraction}
                  onCancel={() => setShowInteractionForm(false)}
                />
              </div>
            )}

            {editingInteraction && (
              <div className="mt-4 rounded-lg border border-border bg-stone-50 p-4 dark:bg-stone-900">
                <InteractionForm
                  contactId={contact.id}
                  initialData={editingInteraction}
                  onSubmit={handleEditInteraction}
                  onCancel={() => setEditingInteraction(null)}
                />
              </div>
            )}

            <div className="mt-4">
              <InteractionTimeline
                interactions={interactions}
                onEdit={(i) => {
                  setShowInteractionForm(false);
                  setEditingInteraction(i);
                }}
                onDelete={handleDeleteInteraction}
              />
            </div>
          </Card>
        </div>

        {/* Right column: Actions */}
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Action Items ({pendingActions.length})
            </h2>
            <div className="mt-3 space-y-3">
              {pendingActions.length === 0 && (
                <p className="text-sm text-muted">No pending actions.</p>
              )}
              {pendingActions.map((action) => {
                const dueDateStatus = getDueDateStatus(action.dueDate);
                return (
                  <div key={action.id} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={action.completed}
                      onChange={() => handleToggleAction(action.id)}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-stone-900 dark:text-stone-100">
                        {action.description}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span
                          className={`text-xs font-medium ${
                            dueDateStatus === 'overdue'
                              ? 'text-danger'
                              : dueDateStatus === 'today'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-muted'
                          }`}
                        >
                          {dueDateStatus === 'overdue' ? 'Overdue' : dueDateStatus === 'today' ? 'Due today' : `Due ${formatDate(action.dueDate)}`}
                        </span>
                        <Badge variant={action.priority === 'high' ? 'red' : action.priority === 'medium' ? 'amber' : 'default'}>
                          {action.priority}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAction(action.id)}
                      className="text-xs text-muted hover:text-danger"
                    >
                      &times;
                    </button>
                  </div>
                );
              })}
            </div>
          </Card>

          {completedActions.length > 0 && (
            <Card className="p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                Completed ({completedActions.length})
              </h2>
              <div className="mt-3 space-y-2">
                {completedActions.map((action) => (
                  <div key={action.id} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked
                      onChange={() => handleToggleAction(action.id)}
                      className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <p className="text-sm text-muted line-through">{action.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Quick Stats</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Added</span>
                <span className="text-stone-900 dark:text-stone-100">{formatDate(contact.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Last interaction</span>
                <span className="text-stone-900 dark:text-stone-100">
                  {contact.lastInteractionAt ? formatRelativeDate(contact.lastInteractionAt) : 'Never'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Total interactions</span>
                <span className="text-stone-900 dark:text-stone-100">{interactions.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
