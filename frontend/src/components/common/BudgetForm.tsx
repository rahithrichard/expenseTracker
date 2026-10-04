import { useState, type FormEvent } from 'react';
import type { Budget } from '../../services/apiService';

interface BudgetFormProps {
  budget: Budget;
  onSubmit: (amount: number, monthStart: string) => Promise<void>;
}

function BudgetForm({ budget, onSubmit }: BudgetFormProps) {
  const [amount, setAmount] = useState(String(budget.amount || ''));
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value < 0) return;

    setSaving(true);
    setSubmitError('');
    try {
      await onSubmit(value, budget.monthStart);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save budget');
    } finally {
      setSaving(false);
    }
  };

  const monthLabel = new Date(`${budget.monthStart}T00:00:00`).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <div>
        <p className="form-kicker">Monthly budget</p>
        <h2>{monthLabel}</h2>
        <p className="budget-form-note">This budget expires at the end of the month.</p>
      </div>
      <label htmlFor="monthly-budget">
        Amount
        <input
          id="monthly-budget"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.00"
          required
        />
      </label>
      <button className="form-submit" type="submit" disabled={saving}>
        {saving ? 'Saving...' : budget.amount ? 'Update budget' : 'Add budget'}
      </button>
      {submitError && <p className="form-error" role="alert">{submitError}</p>}
    </form>
  );
}

export default BudgetForm;