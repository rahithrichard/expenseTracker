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

const selectNow = async (query, values) => {
  const client = createClient();

  try {
    await client.connect();
    const result = await client.query(query, values);
    return result;
  } finally {
    await client.end();
  }
};


module.exports = {
  databaseConfig,
  createClient,
  createAdminClient,
  checkDatabaseConnection,
  selectNow,
};
