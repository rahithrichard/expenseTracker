import type { Expense } from '../types/expense';

function List({ data }: { data: Expense[] }) {
  return (
    <div className="list">
      {data.map((expense) => (
        <div key={expense.id} className="expense">
          {Object.entries(expense)
            .filter(([key]) => key !== 'id')
            .map(([key, value]) => (
              <p key={`${expense.id}-${key}`}>
                {key}: {String(value)}
              </p>
            ))}
        </div>
      ))}
    </div>
  );
}

export default List;