import { useEffect, useReducer } from 'react';
import type { Expense } from '../../types/expense';
import '../../assets/styles/styles.css';

type TimePeriod = 'day' | 'month';

interface TimeBar {
  key: string;
  label: string;
  total: number;
}

interface ChartState {
  period: TimePeriod;
  bars: TimeBar[];
}

type ChartAction =
  | { type: 'set-period'; period: TimePeriod; expenses: Expense[] }
  | { type: 'set-expenses'; expenses: Expense[] };

const initialState: ChartState = { period: 'month', bars: [] };

const getBucket = (date: string, period: TimePeriod) => {
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return null;

  if (period === 'day') {
    return {
      key: date,
      label: parsedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    };
  }

  if (period === 'month') {
    const key = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
    return {
      key,
      label: parsedDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
    };
  }

  const key = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}`;
  return {
    key,
    label: parsedDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
  };
};

const aggregateExpenses = (expenses: Expense[], period: TimePeriod): TimeBar[] => {
  const totals = expenses.reduce<Map<string, TimeBar>>((result, expense) => {
    const bucket = getBucket(expense.date, period);
    if (!bucket) return result;

    const current = result.get(bucket.key);
    result.set(bucket.key, {
      key: bucket.key,
      label: bucket.label,
      total: (current?.total ?? 0) + Number(expense.amount || 0),
    });
    return result;
  }, new Map());

  return [...totals.values()].sort((first, second) => first.key.localeCompare(second.key));
};

const chartReducer = (state: ChartState, action: ChartAction): ChartState => {
  if (action.type === 'set-period') {
    return { period: action.period, bars: aggregateExpenses(action.expenses, action.period) };
  }

  return { ...state, bars: aggregateExpenses(action.expenses, state.period) };
};

function SpendingByTime({ expenses }: { expenses: Expense[] }) {
  const [state, dispatch] = useReducer(chartReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'set-expenses', expenses });
  }, [expenses]);

  const maximum = Math.max(...state.bars.map((bar) => bar.total), 0);
  const colors: Record<TimePeriod, string> = {
    day: '#2684ff',
    month: '#12b981',
  };

  return (
    <section className="time-chart" aria-labelledby="time-chart-title">
      <div className="time-chart-heading">
        <div>
          <p className="table-kicker">Spending trends</p>
          <h2 id="time-chart-title">Spend over time</h2>
        </div>
        <div className="time-chart-controls" role="group" aria-label="Spending chart period">
          {(['day', 'month'] as TimePeriod[]).map((period) => (
            <button
              className={state.period === period ? 'time-chart-button active' : 'time-chart-button'}
              key={period}
              type="button"
              onClick={() => dispatch({ type: 'set-period', period, expenses })}
              aria-pressed={state.period === period}
            >
              {period[0].toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {state.bars.length === 0 ? (
        <p className="time-chart-empty">Add an expense to see spending trends.</p>
      ) : (
        <div className="time-chart-bars" style={{ '--bar-color': colors[state.period] } as React.CSSProperties}>
          {state.bars.map((bar) => (
            <div className="time-chart-bar-group" key={bar.key}>
              <span className="time-chart-value">${bar.total.toFixed(0)}</span>
              <div className="time-chart-bar-track">
                <div className="time-chart-bar" style={{ height: `${Math.max((bar.total / maximum) * 100, 4)}%` }} />
              </div>
              <span className="time-chart-label">{bar.label}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SpendingByTime;