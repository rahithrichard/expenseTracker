
interface CategoryTotal {
  category: string;
  total: number;
}

const chartColors = ['#2684ff', '#12b981', '#ff9f1c', '#8064d8', '#a8b4c8', '#e85d75'];

function SpendByCategory({ data }: { data: CategoryTotal[] }) {
  const totalSpend = data.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const segments = data.reduce<Array<CategoryTotal & { percentage: number; color: string; start: number; end: number }>>((result, item, index) => {
    const percentage = totalSpend > 0 ? (Number(item.total || 0) / totalSpend) * 100 : 0;
    const start = result[index - 1]?.end ?? 0;
    const end = start + percentage * 3.6;

    result.push({
      ...item,
      percentage,
      color: chartColors[index % chartColors.length],
      start,
      end,
    });
    return result;
  }, []);

  const gradient = segments.length > 0 && totalSpend > 0
    ? `conic-gradient(${segments.map((item) => `${item.color} ${item.start}deg ${item.end}deg`).join(', ')})`
    : '#dfe5ee';

  return (
    <section className="spend-category" aria-labelledby="spend-category-title">
      <div className="spend-category-heading">
        <div>
          <p className="table-kicker">Spending breakdown</p>
          <h2 id="spend-category-title">Spend by Category</h2>
        </div>
        <span className="table-count">{segments.length} categories</span>
      </div>
      <div className="spend-category-content">
        <div className="spend-donut" style={{ background: gradient }} aria-label={`Total spend $${totalSpend.toFixed(2)}`}>
          <div className="spend-donut-center">
            <strong>${totalSpend.toFixed(2)}</strong>
            <span>Total</span>
          </div>
        </div>
        <ul className="spend-legend">
          {segments.map((item) => (
            <li key={item.category}>
              <span className="spend-legend-name">
                <i style={{ backgroundColor: item.color }} aria-hidden="true" />
                {item.category}
              </span>
              <span className="spend-legend-percent">{item.percentage.toFixed(0)}%</span>
              <strong>${Number(item.total).toFixed(2)}</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default SpendByCategory;
