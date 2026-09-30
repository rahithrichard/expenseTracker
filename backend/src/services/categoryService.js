const { query } = require("../config/db");

const listCategories = async () => {
  const result = await query("SELECT name FROM categories ORDER BY id");
  return result.rows.map((row) => row.name);
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

module.exports = {
  listCategories,
  getCategoryTotals,
};
