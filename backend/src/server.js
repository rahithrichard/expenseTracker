const app = require("./app");
const { checkDatabaseConnection } = require("./config/db");

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const connection = await checkDatabaseConnection();
    console.log("Database connected:", connection.connected_at);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exitCode = 1;
  }
};

void startServer();
