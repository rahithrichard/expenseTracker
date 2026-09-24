const { checkDatabaseConnection } = require("./src/config/database");

checkDatabaseConnection()
  .then((connection) => {
    console.log("Database connection is healthy:", connection.connected_at);
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exitCode = 1;
  });