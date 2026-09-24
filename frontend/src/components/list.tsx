import type { Expense } from '../types/expense';
import capitalize from '../types/capitalize';
import '../assets/styles/style.css';

// Hard coded category icons for each expense category
const categoryIcons: Record<string, { name: string; symbol: string }> = {
  food: { name: 'food', symbol: '🍽' },
  transport: { name: 'transport', symbol: '🚌' },
  shopping: { name: 'shopping', symbol: '🛍' },
  bills: { name: 'bills', symbol: '🧾' },
  health: { name: 'health', symbol: '♥' },
  other: { name: 'other', symbol: '✦' },
};

interface ListProps {
  data: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

function List({ data, onDelete, onEdit }: ListProps) {
  const listItems = data?.map((expense) => {
    const icon = categoryIcons[expense.category.toLowerCase()] ?? categoryIcons.other;

    return (
      <li key={expense.id} className="expense">
        <div className={`expense-icon expense-icon--${icon.name}`} aria-hidden="true">
          {icon.symbol}
        </div>
        <div className="expense-details">
          <div className="expense-meta">
            <span className="expense-category">{capitalize(expense.category)}</span>
            <time dateTime={expense.date}>{expense.date}</time>
          </div>
          <h3>{capitalize(expense.title)}</h3>
          <p className="expense-amount">${expense.amount.toFixed(2)}</p>
        </div>
        <div className="expense-actions">
          <button type="button" className="expense-action expense-action--edit" onClick={() => onEdit(expense)} aria-label={`Edit ${expense.title}`}>
            Edit
          </button>
          <button type="button" className="expense-action expense-action--delete" onClick={() => onDelete(expense.id)} aria-label={`Delete ${expense.title}`}>
            Delete
          </button>
        </div>
      </li>
    );
  });

  return <ul className="list">{listItems}</ul>;
}

export default List;