const { query } = require("../config/db");
// for table data
const listExpenses = async (monthStart, userId) => {
  const result = await query(
    `SELECT id, title, amount, category, date::text AS date
     FROM expenses
     WHERE user_id = $2
       AND date >= $1::date AND date < ($1::date + INTERVAL '1 month')
     ORDER BY date DESC, created_at DESC`,
    [monthStart, userId],
  );
  return result.rows;
};
// total expenses for card 
const getTotalExpenses = async (monthStart, userId) => {
  const result = await query(`
    SELECT SUM(amount) AS total
    FROM expenses
    WHERE user_id = $2
      AND date >= $1::date AND date < ($1::date + INTERVAL '1 month')
  `, [monthStart, userId]);
  return Number(result.rows[0].total || 0);
};

const getCategoryTotals = async (category, monthStart, userId) => {
  const result = await query(`
    SELECT categories.name AS category,
           COALESCE(SUM(expenses.amount), 0)::numeric AS total
    FROM categories
    LEFT JOIN expenses ON expenses.category = categories.name
      AND expenses.user_id = $3
      AND expenses.date >= $2::date
      AND expenses.date < ($2::date + INTERVAL '1 month')
    WHERE ($1::varchar IS NULL OR categories.name = $1)
    GROUP BY categories.id, categories.name
    ORDER BY categories.id
  `, [category || null, monthStart, userId]);

  return result.rows.map((row) => ({
    category: row.category,
    total: Number(row.total),
  }));
};

// CRUD operation 
const createExpense = async ({ id, userId, title, amount, category, date }) => {
  const result = await query(`
    INSERT INTO expenses (id, user_id, title, amount, category, date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, title, amount, category, date::text AS date
  `, [id, userId, title, Number(amount), category, date]);

  return result.rows[0];
};

const updateExpense = async ({ id, userId, title, amount, category, date }) => {
  const result = await query(`
    UPDATE expenses
    SET title = $1, amount = $2, category = $3, date = $4, updated_at = CURRENT_TIMESTAMP
    WHERE id = $5 AND user_id = $6
    RETURNING id, title, amount, category, date::text AS date
  `, [title, Number(amount), category, date, id, userId]);

  return result.rows[0] || null;
};

const deleteExpense = async (id, userId) => {
  const result = await query("DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
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
