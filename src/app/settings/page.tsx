'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context/app-context';
import { NetworkingRules } from '@/lib/types';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const [rules, setRules] = useState<NetworkingRules>(state.rules);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_RULES', payload: rules });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    const defaults: NetworkingRules = {
      thankYouDeadlineHours: 24,
      followUpNoResponseDays: 7,
      warmContactReengageDays: 14,
      coldContactReengageDays: 30,
    };
    setRules(defaults);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">Settings</h1>
      <p className="mt-1 text-sm text-muted">
        Configure your networking rules. These determine when action items are auto-created and when contacts are flagged for attention.
      </p>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">Networking Rules</h2>
        <p className="mt-1 text-sm text-muted">
          Adjust these thresholds to match your networking style. Changes apply to new actions going forward.
        </p>

        <div className="mt-6 space-y-6">
          <div>
            <Input
              label="Thank-you note deadline (hours)"
              type="number"
              min={1}
              max={168}
              value={rules.thankYouDeadlineHours}
              onChange={(e) => setRules({ ...rules, thankYouDeadlineHours: Number(e.target.value) })}
            />
            <p className="mt-1 text-xs text-muted">
              After a coffee chat or interview, a &quot;send thank-you&quot; action is created with this deadline.
            </p>
          </div>

          <div>
            <Input
              label="Follow-up if no response (days)"
              type="number"
              min={1}
              max={90}
              value={rules.followUpNoResponseDays}
              onChange={(e) => setRules({ ...rules, followUpNoResponseDays: Number(e.target.value) })}
            />
            <p className="mt-1 text-xs text-muted">
              After sending outreach, a &quot;follow up&quot; action is created if no response after this many days.
            </p>
          </div>

          <div>
            <Input
              label="Warm/hot contact re-engage (days)"
              type="number"
              min={1}
              max={90}
              value={rules.warmContactReengageDays}
              onChange={(e) => setRules({ ...rules, warmContactReengageDays: Number(e.target.value) })}
            />
            <p className="mt-1 text-xs text-muted">
              Warm, hot, and active contacts appear on the dashboard&apos;s &quot;needs attention&quot; list after this many days without interaction.
            </p>
          </div>

          <div>
            <Input
              label="Cold contact re-engage (days)"
              type="number"
              min={1}
              max={180}
              value={rules.coldContactReengageDays}
              onChange={(e) => setRules({ ...rules, coldContactReengageDays: Number(e.target.value) })}
            />
            <p className="mt-1 text-xs text-muted">
              Cold contacts appear on the dashboard&apos;s &quot;needs attention&quot; list after this many days without interaction.
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button onClick={handleSave}>
            {saved ? 'Saved!' : 'Save Rules'}
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset to Defaults
          </Button>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">About</h2>
        <div className="mt-3 space-y-2 text-sm text-muted">
          <p>
            <strong className="text-stone-900 dark:text-stone-100">Networking Buddy</strong> helps you track your professional networking during a job search.
          </p>
          <p>
            Data is stored in-memory and will reset on page refresh. A database-backed version is coming soon.
          </p>
          <p>
            Built for MPCS 51238 — Design, Build, Ship.
          </p>
        </div>
      </Card>
    </div>
  );
}
