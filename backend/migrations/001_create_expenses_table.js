module.exports = {
  async up(connection) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(32) NOT NULL,
        title VARCHAR(150) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )
    `);
  },
};
