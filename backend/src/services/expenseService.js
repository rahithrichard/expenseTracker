const { query, withTransaction } = require("../config/db");

const requestError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const assertExpenseFitsBudget = async (client, { userId, date, amount, excludeExpenseId }) => {
  const budgetResult = await client.query(`
    SELECT amount
    FROM budgets
    WHERE user_id = $1
      AND month_start = DATE_TRUNC('month', $2::date)::date
  `, [userId, date]);

  if (!budgetResult.rows[0] || Number(budgetResult.rows[0].amount) <= 0) {
    throw requestError("Add a positive monthly budget before recording expenses");
  }

  const spentResult = await client.query(`
    SELECT COALESCE(SUM(amount), 0) AS spent
    FROM expenses
    WHERE user_id = $1
      AND date >= DATE_TRUNC('month', $2::date)::date
      AND date < (DATE_TRUNC('month', $2::date)::date + INTERVAL '1 month')
      AND ($3::varchar IS NULL OR id <> $3)
  `, [userId, date, excludeExpenseId || null]);

  const affordabilityResult = await client.query(
    "SELECT $1::numeric + $2::numeric <= $3::numeric AS allowed",
    [spentResult.rows[0].spent, amount, budgetResult.rows[0].amount],
  );

  if (!affordabilityResult.rows[0].allowed) {
    throw requestError("Expense exceeds the remaining monthly budget");
  }
};
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
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount < 0) {
    throw requestError("Expense amount must be a non-negative number");
  }

  return withTransaction(async (client) => {
    await client.query("SELECT id FROM users WHERE id = $1 FOR UPDATE", [userId]);
    await assertExpenseFitsBudget(client, { userId, date, amount: numericAmount });

    const result = await client.query(`
      INSERT INTO expenses (id, user_id, title, amount, category, date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, amount, category, date::text AS date
    `, [id, userId, title, numericAmount, category, date]);

    return result.rows[0];
  });
};

const updateExpense = async ({ id, userId, title, amount, category, date }) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount < 0) {
    throw requestError("Expense amount must be a non-negative number");
  }

  return withTransaction(async (client) => {
    await client.query("SELECT id FROM users WHERE id = $1 FOR UPDATE", [userId]);
    const existingExpense = await client.query(
      "SELECT id FROM expenses WHERE id = $1 AND user_id = $2 FOR UPDATE",
      [id, userId],
    );
    if (!existingExpense.rows[0]) return null;

    await assertExpenseFitsBudget(client, {
      userId,
      date,
      amount: numericAmount,
      excludeExpenseId: id,
    });

    const result = await client.query(`
      UPDATE expenses
      SET title = $1, amount = $2, category = $3, date = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND user_id = $6
      RETURNING id, title, amount, category, date::text AS date
    `, [title, numericAmount, category, date, id, userId]);

    return result.rows[0] || null;
  });
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
