import capitalize from '../types/capitalize';
import '../assets/styles/style.css';
// import  formatDate  from '../types/dateFormat';

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
  data: { category: string; total: number }[];
}

function List({ data}: ListProps) {
  const listItems = data?.map((item) => {
    const icon = categoryIcons[item.category.toLowerCase()] ?? categoryIcons.other;

    return (
      <li key={item.category} className="expense">
        <div className={`expense-icon expense-icon--${icon.name}`} aria-hidden="true">
          {icon.symbol}
        </div>
        <div className="expense-details">
          {/* <div className="expense-meta">
            <span className="expense-category">{capitalize(expense.category)}</span>
            <time dateTime={expense.date}>{formatDate(expense.date)}</time>
          </div> */}
          <h3>{capitalize(item.category)}</h3>
          <p className="expense-amount">${item.total.toFixed(2)}</p>
        </div>
        {/* <div className="expense-actions">
          <button type="button" className="expense-action expense-action--edit" onClick={() => onEdit(expense)} aria-label={`Edit ${expense.title}`}>
            Edit
          </button>
          <button type="button" className="expense-action expense-action--delete" onClick={() => onDelete(expense.id)} aria-label={`Delete ${expense.title}`}>
            Delete
          </button>
        </div> */}
      </li>
    );
  });

  return <ul className="list">{listItems}</ul>;
}

export default List;