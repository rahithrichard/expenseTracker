const express = require("express");
const cors = require("cors");
const path = require("path");
const expenseRoutes = require("./routes/expenseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const { checkDatabaseConnection } = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const distPath = path.join(__dirname, "../../frontend/dist");

app.use(cors());
app.use(express.json());

app.get("/api/health/database", async (req, res) => {
  const connection = await checkDatabaseConnection();
  res.json({ status: "ok", database: "connected", ...connection });
});

app.use("/api", expenseRoutes);
app.use("/api", categoryRoutes);

app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.join(distPath, "index.html"));
    return;
  }

  next();
});

app.use(errorHandler);

module.exports = app;
