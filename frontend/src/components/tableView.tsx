import { useEffect, useState } from 'react';
import { type TableProps } from '../types/tableType';
import formatValue from '../types/formatValue';

const normalizeDate = (value: unknown) => String(value ?? '').slice(0, 10);



function Table<T extends { id: string | number }>({
  data,
  columns,
  onDelete,
  onEdit,
}: TableProps<T>) {
  const visibleColumns = columns.slice(0, 5);
  const rowsPerPage = 5;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [date, setDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = Array.from(new Set(
    data
      .map((row) => row['category' as keyof T])
      .filter((value) => value !== undefined && value !== null)
      .map(String),
  )).sort();

  const filteredData = data.filter((row) => {
    const matchesSearch = !search || visibleColumns.some((column) =>
      String(row[column.key]).toLowerCase().includes(search.toLowerCase()),
    );
    const matchesCategory = category === 'all' || String(row['category' as keyof T]) === category;
    const matchesDate = !date || normalizeDate(row['date' as keyof T]) === date;

    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const pageData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, date]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  if (!data || data.length === 0) {
    return <p>No data found.</p>;
  }

  return (
    <section className="table-section">
      <div className="table-toolbar">
        <div>
          <p className="table-kicker">Expense overview</p>
          <h2>All transactions</h2>
        </div>
        <span className="table-count">{filteredData.length} of {data.length}</span>
      </div>
      <div className="table-filters">
        <label>
          Search
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search expenses"
          />
        </label>
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <button
          className="table-clear"
          type="button"
          onClick={() => {
            setSearch('');
            setCategory('all');
            setDate('');
          }}
        >
          Clear filters
        </button>
      </div>
      <div className="table-wrapper">
        <table className="table">
        <thead>
          <tr>
            {visibleColumns.map((column) => (
              <th key={String(column.key)}>
                {column.label}
              </th>
            ))}

            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {pageData.map((row) => (
            <tr key={row.id}>
              {visibleColumns.map((column) => {
                const value = row[column.key];

                return (
                  <td key={String(column.key)}>
                    {column.render
                      ? column.render(value, row)
                      : formatValue(value)}
                  </td>
                );
              })}

              {(onEdit || onDelete) && (
                <td className="table-actions">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                    >
                      Edit
                    </button>
                  )}

                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(row.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        </table>
        {filteredData.length === 0 && <p className="table-empty">No expenses match these filters.</p>}
      </div>
      {filteredData.length > 0 && (
        <div className="table-pagination">
          <span>Page {currentPage} of {totalPages}</span>
          <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
            Previous
          </button>
          <button type="button" disabled={currentPage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default Table;