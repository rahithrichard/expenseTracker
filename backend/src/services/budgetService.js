const { query } = require("../config/db");

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
  const result = await query(`
    INSERT INTO budgets (user_id, month_start, amount)
    VALUES ($1, DATE_TRUNC('month', $2::date)::date, $3)
    ON CONFLICT (user_id, month_start)
    DO UPDATE SET amount = EXCLUDED.amount, updated_at = CURRENT_TIMESTAMP
    RETURNING month_start::text AS "monthStart", amount
  `, [userId, monthStart || new Date().toISOString().slice(0, 10), Number(amount)]);

  return {
    monthStart: result.rows[0].monthStart,
    amount: Number(result.rows[0].amount),
  };
};

module.exports = { getBudgetForMonth, saveBudget };