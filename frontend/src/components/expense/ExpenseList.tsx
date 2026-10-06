import capitalize from '../../utils/capitalize';
// import formatDate from '../../utils/dateFormat';

// Meaningful icons for the dashboard summary categories
const categoryIcons: Record<string, { name: string; symbol: string }> = {
  total: { name: 'total', symbol: '💰' },
  budget: { name: 'budget', symbol: '💳' },
  remaining: { name: 'remaining', symbol: '↗' },
  other: { name: 'other', symbol: '◇' },
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
          <span className={icon.name}>{icon.symbol}</span>
        </div>
        <div className="expense-details">
          <h3>{capitalize(item.category)}</h3>
          <p className="expense-amount">${item.total.toFixed(2)}</p>
        </div>
      </li>
    );
  });

  return <ul className="list">{listItems}</ul>;
}

export default List;