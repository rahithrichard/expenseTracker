module.exports = {
  async up(connection) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        month_start DATE NOT NULL UNIQUE,
        amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  },
};