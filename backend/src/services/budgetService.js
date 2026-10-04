const { query, withTransaction } = require("../config/db");

const requestError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const getBudgetForMonth = async (monthStart, userId) => {
  const result = await query(`
    SELECT month_start::text AS "monthStart", amount
    FROM budgets
    WHERE month_start = $1::date AND user_id = $2
    LIMIT 1
  `, [monthStart, userId]);

  if (!result.rows[0]) {
    return { monthStart, amount: 0 };
  }

  return {
    monthStart: result.rows[0].monthStart,
    amount: Number(result.rows[0].amount),
  };
};

const saveBudget = async ({ amount, monthStart, userId }) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount < 0) {
    throw requestError("Budget amount must be a non-negative number");
  }

  const selectedMonth = monthStart || new Date().toISOString().slice(0, 10);
  return withTransaction(async (client) => {
    await client.query("SELECT id FROM users WHERE id = $1 FOR UPDATE", [userId]);

    const spentResult = await client.query(`
      SELECT COALESCE(SUM(amount), 0) AS spent
      FROM expenses
      WHERE user_id = $1
        AND date >= DATE_TRUNC('month', $2::date)::date
        AND date < (DATE_TRUNC('month', $2::date)::date + INTERVAL '1 month')
    `, [userId, selectedMonth]);
    const budgetIsValid = await client.query(
      "SELECT $1::numeric >= $2::numeric AS allowed",
      [numericAmount, spentResult.rows[0].spent],
    );

    if (!budgetIsValid.rows[0].allowed) {
      throw requestError("Budget cannot be less than expenses already recorded for this month");
    }

    const result = await client.query(`
      INSERT INTO budgets (user_id, month_start, amount)
      VALUES ($1, DATE_TRUNC('month', $2::date)::date, $3)
      ON CONFLICT (user_id, month_start)
      DO UPDATE SET amount = EXCLUDED.amount, updated_at = CURRENT_TIMESTAMP
      RETURNING month_start::text AS "monthStart", amount
    `, [userId, selectedMonth, numericAmount]);

    return {
      monthStart: result.rows[0].monthStart,
      amount: Number(result.rows[0].amount),
    };
  });
};

module.exports = { getBudgetForMonth, saveBudget };