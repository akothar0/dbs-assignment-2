'use client';

import { useState } from 'react';
import { Contact, ContactStatus, HowWeMet, HOW_WE_MET_LABELS, STATUS_LABELS } from '@/lib/types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

interface ContactFormProps {
  initialData?: Contact;
  onSubmit: (contact: Contact) => void;
  onCancel?: () => void;
}

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }));
const howWeMetOptions = Object.entries(HOW_WE_MET_LABELS).map(([value, label]) => ({ value, label }));

export default function ContactForm({ initialData, onSubmit, onCancel }: ContactFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [role, setRole] = useState(initialData?.role || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [linkedIn, setLinkedIn] = useState(initialData?.linkedIn || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [howWeMet, setHowWeMet] = useState<HowWeMet>(initialData?.howWeMet || 'linkedin');
  const [howWeMetDetail, setHowWeMetDetail] = useState(initialData?.howWeMetDetail || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [status, setStatus] = useState<ContactStatus>(initialData?.status || 'lead');
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(', ') || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!company.trim()) newErrors.company = 'Company is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const contact: Contact = {
      id: initialData?.id || crypto.randomUUID(),
      name: name.trim(),
      company: company.trim(),
      role: role.trim(),
      email: email.trim(),
      linkedIn: linkedIn.trim(),
      phone: phone.trim(),
      howWeMet,
      howWeMetDetail: howWeMet === 'other' ? howWeMetDetail.trim() : '',
      notes: notes.trim(),
      status,
      tags,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      lastInteractionAt: initialData?.lastInteractionAt || null,
    };

    onSubmit(contact);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sarah Chen"
          error={errors.name}
        />
        <Input
          label="Company *"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Google"
          error={errors.company}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Engineering Manager"
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ContactStatus)}
          options={statusOptions}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="sarah@gmail.com"
        />
        <Input
          label="LinkedIn"
          value={linkedIn}
          onChange={(e) => setLinkedIn(e.target.value)}
          placeholder="linkedin.com/in/sarahchen"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="555-0123"
        />
        <Select
          label="How We Met"
          value={howWeMet}
          onChange={(e) => setHowWeMet(e.target.value as HowWeMet)}
          options={howWeMetOptions}
        />
      </div>

      {howWeMet === 'other' && (
        <Input
          label="How We Met (Details)"
          value={howWeMetDetail}
          onChange={(e) => setHowWeMetDetail(e.target.value)}
          placeholder="Describe how you met..."
        />
      )}

      <Input
        label="Tags"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        placeholder="engineering, google, referral (comma-separated)"
      />

      <Textarea
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="What should you remember about this person?"
        rows={4}
      />

      <div className="flex gap-3">
        <Button type="submit">
          {initialData ? 'Save Changes' : 'Add Contact'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
