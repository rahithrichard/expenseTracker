module.exports = {
  async up(connection) {
    await connection.query(`
      ALTER TABLE users
      ALTER COLUMN id SET DEFAULT (100000 + floor(random() * 900000)::int)
    `);

    await connection.query(`
      ALTER TABLE expenses
      ADD COLUMN IF NOT EXISTS user_id INTEGER
    `);

    const expenseCount = await connection.query("SELECT COUNT(*)::int AS count FROM expenses");
    if (expenseCount.rows[0].count > 0) {
      const users = await connection.query("SELECT id FROM users ORDER BY id");
      if (users.rows.length !== 1) {
        throw new Error("Cannot link existing expenses unless exactly one user exists");
      }

      await connection.query("UPDATE expenses SET user_id = $1 WHERE user_id IS NULL", [users.rows[0].id]);
    }

    await connection.query(`
      ALTER TABLE expenses
      ALTER COLUMN user_id SET NOT NULL
    `);

    await connection.query(`
      ALTER TABLE expenses
      ADD CONSTRAINT expenses_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    `);
  },
};