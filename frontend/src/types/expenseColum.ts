import capitalize from './capitalize';
import formatDate from './dateFormat';
import type { Column } from './tableType';
import type { Expense } from './expense';

const expenseColumns: Column<Expense>[] = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "amount",
    label: "Amount",
    render: (value) => `$${Number(value).toFixed(2)}`,
  },
  {
    key: "category",
    label: "Category",
    render: (value) => capitalize(String(value)),
  },
  {
    key: "date",
    label: "Date",
    render: (value) => formatDate(String(value)),
  },
];

export default expenseColumns;