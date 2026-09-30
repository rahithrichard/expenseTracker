module.exports = {
  async up(connection) {
    await connection.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS budgets_month_start_unique_idx
      ON budgets (month_start)
    `);
  },
};