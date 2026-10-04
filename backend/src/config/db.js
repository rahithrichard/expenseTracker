require("dotenv").config();

const { Client } = require("pg");

const databaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "expense_tracker",
};

const createClient = () => new Client(databaseConfig);

const createAdminClient = () => new Client({
  ...databaseConfig,
  database: process.env.DB_ADMIN_DATABASE || "postgres",
});

const checkDatabaseConnection = async () => {
  const client = createClient();

  try {
    await client.connect();
    const result = await client.query("SELECT NOW() AS connected_at");
    return result.rows[0];
  } finally {
    await client.end();
  }
};

const query = async (text, values) => {
  const client = createClient();

  try {
    await client.connect();
    return await client.query(text, values);
  } finally {
    await client.end();
  }
};

const withTransaction = async (operation) => {
  const client = createClient();

  try {
    await client.connect();
    await client.query("BEGIN");
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Preserve the original transaction error.
    }
    throw error;
  } finally {
    await client.end();
  }
};

module.exports = {
  databaseConfig,
  createClient,
  createAdminClient,
  checkDatabaseConnection,
  query,
  withTransaction,
};
