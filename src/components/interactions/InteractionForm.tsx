'use client';

import { useState } from 'react';
import { Interaction, InteractionType, INTERACTION_TYPE_LABELS } from '@/lib/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

interface InteractionFormProps {
  contactId: string;
  initialData?: Interaction;
  onSubmit: (interaction: Interaction) => void;
  onCancel: () => void;
}

const typeOptions = Object.entries(INTERACTION_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default function InteractionForm({ contactId, initialData, onSubmit, onCancel }: InteractionFormProps) {
  const [type, setType] = useState<InteractionType>(initialData?.type || 'coffee-chat');
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [followUpNeeded, setFollowUpNeeded] = useState(initialData?.followUpNeeded || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;

    const interaction: Interaction = {
      id: initialData?.id || crypto.randomUUID(),
      contactId,
      type,
      date: new Date(date).toISOString(),
      summary: summary.trim(),
      notes: notes.trim(),
      followUpNeeded,
    };

    onSubmit(interaction);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value as InteractionType)}
          options={typeOptions}
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <Input
        label="Summary *"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Brief description of the interaction"
      />

      <Textarea
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="What did you discuss? Any key takeaways?"
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={followUpNeeded}
          onChange={(e) => setFollowUpNeeded(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <span className="text-stone-700 dark:text-stone-300">Follow-up needed</span>
      </label>

      <div className="flex gap-3">
        <Button type="submit">{initialData ? 'Save' : 'Log Interaction'}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
