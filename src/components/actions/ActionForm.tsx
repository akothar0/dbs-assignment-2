'use client';

import { useState } from 'react';
import { Action, ActionType, ActionPriority, ACTION_TYPE_LABELS, Contact } from '@/lib/types';
import { generateMessageTemplate } from '@/lib/templates';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

interface ActionFormProps {
  /** Pre-selected contact (when adding from a contact detail page) */
  contactId?: string;
  contacts: Contact[];
  onSubmit: (action: Action) => void;
  onCancel: () => void;
}

const typeOptions = Object.entries(ACTION_TYPE_LABELS).map(([value, label]) => ({ value, label }));

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export default function ActionForm({ contactId, contacts, onSubmit, onCancel }: ActionFormProps) {
  const [selectedContactId, setSelectedContactId] = useState(contactId || contacts[0]?.id || '');
  const [type, setType] = useState<ActionType>('send-followup');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<ActionPriority>('medium');
  const [notes, setNotes] = useState('');

  const contactOptions = contacts.map((c) => ({ value: c.id, label: `${c.name} (${c.company})` }));
  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !selectedContactId) return;

    // Auto-generate a message template if the user didn't write custom notes
    const template = selectedContact
      ? notes.trim() || generateMessageTemplate(type, selectedContact)
      : null;

    const action: Action = {
      id: crypto.randomUUID(),
      contactId: selectedContactId,
      type,
      description: description.trim(),
      dueDate: new Date(dueDate).toISOString(),
      priority,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      messageTemplate: template,
    };

    onSubmit(action);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Only show contact picker when not pre-selected */}
      {!contactId && (
        <Select
          label="Contact"
          value={selectedContactId}
          onChange={(e) => setSelectedContactId(e.target.value)}
          options={contactOptions}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value as ActionType)}
          options={typeOptions}
        />
        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as ActionPriority)}
          options={priorityOptions}
        />
      </div>

      <Input
        label="Description *"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What do you need to do?"
      />

      <Input
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <Textarea
        label="Message Template (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Leave blank to auto-generate, or write your own draft..."
      />

      <div className="flex gap-3">
        <Button type="submit">Add Action</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
