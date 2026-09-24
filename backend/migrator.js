require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "expense_tracker",
};

const migrationsPath = path.join(__dirname, "migrations");

const quoteDatabaseName = (databaseName) => {
  if (!/^[a-zA-Z0-9_]+$/.test(databaseName)) {
    throw new Error("DB_NAME may contain only letters, numbers, and underscores");
  }

  return `"${databaseName}"`;
};

async function runMigrations() {
  const adminConnection = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: process.env.DB_ADMIN_DATABASE || "postgres",
  });

  await adminConnection.connect();
  const databaseResult = await adminConnection.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [config.database],
  );

  if (databaseResult.rowCount === 0) {
    await adminConnection.query(`CREATE DATABASE ${quoteDatabaseName(config.database)}`);
  }

  await adminConnection.end();

  const connection = new Client(config);
  await connection.connect();

  await connection.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const appliedResult = await connection.query("SELECT name FROM migrations ORDER BY id");
  const appliedMigrations = new Set(appliedResult.rows.map((row) => row.name));
  const migrationFiles = fs.readdirSync(migrationsPath)
    .filter((fileName) => fileName.endsWith(".js"))
    .sort();

  for (const migrationFile of migrationFiles) {
    if (appliedMigrations.has(migrationFile)) {
      continue;
    }

    const migration = require(path.join(migrationsPath, migrationFile));
    if (typeof migration.up !== "function") {
      throw new Error(`${migrationFile} must export an up(connection) function`);
    }

    console.log(`Applying migration: ${migrationFile}`);
    await connection.query("BEGIN");

    try {
      await migration.up(connection);
      await connection.query("INSERT INTO migrations (name) VALUES ($1)", [migrationFile]);
      await connection.query("COMMIT");
      console.log(`Applied migration: ${migrationFile}`);
    } catch (error) {
      await connection.query("ROLLBACK");
      throw error;
    }
  }

  await connection.end();
  console.log("Migrations complete.");
}

runMigrations().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
});
