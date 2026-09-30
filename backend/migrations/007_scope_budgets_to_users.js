module.exports = {
  async up(connection) {
    await connection.query(`
      CREATE TEMP TABLE previous_budgets ON COMMIT DROP AS
      SELECT month_start, amount, created_at, updated_at
      FROM budgets
    `);

    const [budgetCount, userCount] = await Promise.all([
      connection.query("SELECT COUNT(*)::int AS count FROM previous_budgets"),
      connection.query("SELECT COUNT(*)::int AS count FROM users"),
    ]);

    if (budgetCount.rows[0].count > 0 && userCount.rows[0].count === 0) {
      throw new Error("Cannot migrate existing budgets because no users exist");
    }

    await connection.query("ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_month_start_key");
    await connection.query("DROP INDEX IF EXISTS budgets_month_start_unique_idx");
    await connection.query("ALTER TABLE budgets ADD COLUMN IF NOT EXISTS user_id INTEGER");
    await connection.query("DELETE FROM budgets");
    await connection.query(`
      INSERT INTO budgets (user_id, month_start, amount, created_at, updated_at)
      SELECT users.id, previous_budgets.month_start, previous_budgets.amount,
             previous_budgets.created_at, previous_budgets.updated_at
      FROM users
      CROSS JOIN previous_budgets
    `);
    await connection.query("ALTER TABLE budgets ALTER COLUMN user_id SET NOT NULL");
    await connection.query(`
      ALTER TABLE budgets
      ADD CONSTRAINT budgets_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    `);
    await connection.query(`
      ALTER TABLE budgets
      ADD CONSTRAINT budgets_user_id_month_start_key UNIQUE (user_id, month_start)
    `);
  },
};