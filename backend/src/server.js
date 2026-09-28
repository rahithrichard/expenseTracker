const app = require("./app");
const { checkDatabaseConnection } = require("./config/db");

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);

  try {
    const connection = await checkDatabaseConnection();
    console.log("Database connected:", connection.connected_at);
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
});
