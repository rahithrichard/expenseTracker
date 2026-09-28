import capitalize from '../../utils/capitalize';
import '../../assets/styles/styles.css';
// import formatDate from '../../utils/dateFormat';

// Hard coded category icons for each expense category
const categoryIcons: Record<string, { name: string; symbol: string }> = {
  total: { name: 'Total', symbol: '🧾' },
  budget: { name: 'Budget', symbol: '♥' },
  remaining: { name: 'Remaining', symbol: '✦' },
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
          <h3>{capitalize(item.category)}</h3>
          <p className="expense-amount">${item.total.toFixed(2)}</p>
        </div>
      </li>
    );
  });

  return <ul className="list">{listItems}</ul>;
}

export default List;