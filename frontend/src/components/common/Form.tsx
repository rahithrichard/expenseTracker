import { useState, useRef } from 'react';
import { useEffect } from 'react';
import type { SubmitEvent } from 'react';
import type { Expense } from '../../types/expense';

interface ExpenseFormProps {
    categories?: string[];
	template?: Expense;
	initialExpense?: Expense | null;
	onSubmit: (expense: Expense) => Promise<void>;
	onCancel?: () => void;
}

type FormValue = string | number;
type FormValues = Record<string, FormValue>;

const defaultExpenseTemplate: Expense = {
	id: '',
	title: '',
	amount: 0,
	category: 'Food',
	date: new Date().toISOString().slice(0, 10),
};

const getDefaultValue = (key: string, value: FormValue): FormValue => {
	if (key === 'date') return new Date().toISOString().slice(0, 10);
	if (key === 'category') return value;
	return typeof value === 'number' ? '' : '';
};

const getInitialValues = (source: Expense, isEditing: boolean, fields: string[]): FormValues => {
	return fields.reduce<FormValues>((values, key) => {
		values[key] = isEditing
			? source[key as keyof Expense]
			: getDefaultValue(key, source[key as keyof Expense]);
		return values;
	}, {});
};

function ExpenseForm({ template, initialExpense, onSubmit, onCancel, categories }: ExpenseFormProps) {
    const defaultCategories = ['Food', 'Transport', 'Shopping', 'Health', 'Bills', 'Entertainment', 'Other'];
    const expenseCategories = categories && categories.length > 0 ? categories : defaultCategories;
	const formTemplate = template ?? defaultExpenseTemplate;
	const fields = Object.keys(formTemplate).filter((key) => key !== 'id');
	const [formValues, setFormValues] = useState<FormValues>(() =>
		getInitialValues(initialExpense ?? formTemplate, Boolean(initialExpense), fields),
	);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState('');
	const submittingRef = useRef(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (initialExpense) inputRef.current?.focus();
	}, [initialExpense]);

	const updateValue = (key: string, value: FormValue) => {
		setFormValues((currentValues) => ({ ...currentValues, [key]: value }));
	};

	const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (submittingRef.current) return;

		const title = String(formValues.title ?? '').trim();
		const amount = Number(formValues.amount);

		if (!title || !Number.isFinite(amount) || amount < 0 || !formValues.date) return;

		submittingRef.current = true;
		setSubmitting(true);
		setSubmitError('');

		try {
			await onSubmit({
				id: initialExpense?.id ?? 'EX'+Math.floor(100000 + Math.random() * 900000),
				title,
				amount,
				category: String(formValues.category ?? 'Other'),
				date: String(formValues.date),
			});
			setFormValues(getInitialValues(formTemplate, false, fields));
		} catch (error) {
			setSubmitError(error instanceof Error ? error.message : 'Failed to save expense');
		} finally {
			submittingRef.current = false;
			setSubmitting(false);
		}
	};

	return (
		<form className="expense-form" onSubmit={handleSubmit}>
			{submitting && (
				<div className="expense-saving-overlay" role="status" aria-live="polite">
					<div className="expense-saving-indicator">
						<span className="expense-saving-spinner" aria-hidden="true" />
						<span>Saving transaction...</span>
					</div>
				</div>
			)}
			<div className="form-heading">
				<div>
					<p className="form-kicker">{initialExpense ? 'Edit expense' : 'New expense'}</p>
					<h2>{initialExpense ? 'Update transaction' : 'Add a transaction'}</h2>
				</div>
				{/* <span className="form-badge">{fields.length} fields</span> */}
			</div>
			<div className="form-fields">
				{fields.map((key) => {
					const value = formValues[key] ?? '';
					const label = key.charAt(0).toUpperCase() + key.slice(1);
					const inputType = key === 'amount' ? 'number' : key === 'date' ? 'date' : 'text';

					return (
						<label htmlFor={key} key={key}>
							{label}
							{key === 'category' ? (
								<select
									id={key}
									value={String(value)}
									onChange={(event) => updateValue(key, event.target.value)}
									required
								>
									{[...new Set([...expenseCategories, String(value)])].map((category) => (
										<option key={category} value={category}>{category}</option>
									))}
								</select>
							) : (
								<input
									id={key}
									type={inputType}
									min={inputType === 'number' ? '0' : undefined}
									step={inputType === 'number' ? '0.01' : undefined}
									value={value}
									ref={key === 'title' ? inputRef : undefined}
									onChange={(event) => updateValue(key, event.target.value)}
									required
								/>
							)}
						</label>
					);
				})}
				<div className="form-buttons">
					{initialExpense && <button className="form-cancel" type="button" onClick={onCancel}>Cancel</button>}
					<button className="form-submit" type="submit" disabled={submitting}>
						{submitting ? 'Saving...' : initialExpense ? 'Update expense' : 'Add expense'}
					</button>
				</div>
				{submitError && <p className="form-error" role="alert">{submitError}</p>}
			</div>
		</form>
	);
}

export default ExpenseForm;
