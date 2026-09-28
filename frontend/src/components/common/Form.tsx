import { useState } from 'react';
import { useEffect } from 'react';
import type { SubmitEvent } from 'react';
import type { Expense } from '../../types/expense';

interface ExpenseFormProps {
    categories?: string[];
	template?: Expense;
	initialExpense?: Expense | null;
	onSubmit: (expense: Expense) => void;
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

function ExpenseForm({ template, initialExpense, onSubmit, onCancel, categories }: ExpenseFormProps) {
    const expenseCategories = categories ?? ['Food', 'Transport', 'Shopping', 'Health', 'Other'];
	const formTemplate = template ?? defaultExpenseTemplate;
	const fields = Object.keys(formTemplate).filter((key) => key !== 'id');
	const [formValues, setFormValues] = useState<FormValues>({});

	useEffect(() => {
		const source = initialExpense ?? formTemplate;
		const nextValues = fields.reduce<FormValues>((values, key) => {
			values[key] = initialExpense ? source[key as keyof Expense] : getDefaultValue(key, source[key as keyof Expense]);
			return values;
		}, {});
		setFormValues(nextValues);
	}, [initialExpense, template]);

	const updateValue = (key: string, value: FormValue) => {
		setFormValues((currentValues) => ({ ...currentValues, [key]: value }));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const title = String(formValues.title ?? '').trim();
		const amount = Number(formValues.amount);

		if (!title || !Number.isFinite(amount) || amount < 0 || !formValues.date) return;

		onSubmit({
			id: initialExpense?.id ?? 'EX'+Math.floor(100000 + Math.random() * 900000),
			title,
			amount,
			category: String(formValues.category ?? 'Other'),
			date: String(formValues.date),
		});
	};

	return (
		<form className="expense-form" onSubmit={handleSubmit}>
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
								<select id={key} value={String(value)} onChange={(event) => updateValue(key, event.target.value)} required>
									{expenseCategories.map((category) => (
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
									onChange={(event) => updateValue(key, event.target.value)}
									required
								/>
							)}
						</label>
					);
				})}
				<div className="form-buttons">
					{initialExpense && <button className="form-cancel" type="button" onClick={onCancel}>Cancel</button>}
					<button className="form-submit" type="submit">{initialExpense ? 'Update expense' : 'Add expense'}</button>
				</div>
			</div>
		</form>
	);
}

export default ExpenseForm;
