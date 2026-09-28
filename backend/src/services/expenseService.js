const { query } = require("../config/db");
// for table data
const listExpenses = async () => {
  const result = await query(
    "SELECT id, title, amount, category, date::text AS date FROM expenses ORDER BY date DESC, created_at DESC",
  );
  return result.rows;
};
// total expenses for card 
const getTotalExpenses = async () => {
  const result = await query("SELECT SUM(amount) AS total FROM expenses");
  return Number(result.rows[0].total || 0);
};

const getCategoryTotals = async (category) => {
  const result = await query(`
    SELECT categories.name AS category,
           COALESCE(SUM(expenses.amount), 0)::numeric AS total
    FROM categories
    LEFT JOIN expenses ON expenses.category = categories.name
    WHERE ($1::varchar IS NULL OR categories.name = $1)
    GROUP BY categories.id, categories.name
    ORDER BY categories.id
  `, [category || null]);

  return result.rows.map((row) => ({
    category: row.category,
    total: Number(row.total),
  }));
};

// CRUD operation 
const createExpense = async ({ id, title, amount, category, date }) => {
  const result = await query(`
    INSERT INTO expenses (id, title, amount, category, date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, amount, category, date::text AS date
  `, [id, title, Number(amount), category, date]);

  return result.rows[0];
};

const updateExpense = async ({ id, title, amount, category, date }) => {
  const result = await query(`
    UPDATE expenses
    SET title = $1, amount = $2, category = $3, date = $4, updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING id, title, amount, category, date::text AS date
  `, [title, Number(amount), category, date, id]);

  return result.rows[0] || null;
};

const deleteExpense = async (id) => {
  const result = await query("DELETE FROM expenses WHERE id = $1 RETURNING id", [id]);
  return result.rowCount > 0;
};

module.exports = {
  listExpenses,
  getTotalExpenses,
  getCategoryTotals,
  createExpense,
  updateExpense,
  deleteExpense,
};
