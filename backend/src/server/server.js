const express = require('express');
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const distPath = path.join(__dirname, "../../../frontend/dist");
const { checkDatabaseConnection, selectNow } = require("../config/database");

app.use(cors());
app.use(express.json());
console.log('Server running in:', __dirname);


app.get("/api/expenses", (req, res) => {
  selectNow("SELECT id, title, amount, category, date::text AS date FROM expenses ORDER BY date DESC, created_at DESC")
    .then((result) => res.json(result.rows))
    .catch((error) => {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ message: "Error fetching expenses" });
    });
});

app.get("/api/expense-categories", (req, res) => {
  selectNow("SELECT name FROM categories ORDER BY id")
    .then((result) => res.json(result.rows.map((row) => row.name)))
    .catch((error) => {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Error fetching categories" });
    });
   
});

app.get("/api/totals-expenses", (req, res) => {
  selectNow("SELECT SUM(amount) AS total FROM expenses")
    .then((result) => {
      const total = Number(result.rows[0].total || 0);
      console.log("Total expenses:", total);
      res.json({ total });
    })
    .catch((error) => {
      console.error("Error calculating total expenses:", error);
      res.status(500).json({ message: "Error calculating total expenses" });
    });
});

app.get("/api/filtered-categories-total", (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : null;

  selectNow(`
    SELECT categories.name AS category,
           COALESCE(SUM(expenses.amount), 0)::numeric AS total
    FROM categories
    LEFT JOIN expenses ON expenses.category = categories.name
    WHERE ($1::varchar IS NULL OR categories.name = $1)
    GROUP BY categories.id, categories.name
    ORDER BY categories.id
  `, [category])
    .then((result) => {
      const totals = result.rows.map((row) => ({
        category: row.category,
        total: Number(row.total),
      }));

      console.log("Category totals:", totals);
      res.json(totals);
    })
    .catch((error) => {
      console.error("Error fetching filtered categories:", error);
      res.status(500).json({ message: "Error fetching filtered categories" });
    });
});

app.post("/api/create-expense", (req, res) => {
  const newExpense = {
    id: req.body.id,
    title: req.body.title,
    amount: Number(req.body.amount),
    category: req.body.category,
    date: req.body.date || new Date().toISOString().split("T")[0],
  };
// insert into expenses table
  const query = `INSERT INTO expenses (id, title, amount, category, date) VALUES ($1, $2, $3, $4, $5)`
  selectNow(query + " RETURNING id, title, amount, category, date::text AS date", [newExpense.id, newExpense.title, newExpense.amount, newExpense.category, newExpense.date])
  .then((result) => {
    res.status(201).json(result.rows[0]);
  })
  .catch((error) => {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Error creating expense" });
  });
});

app.post("/api/update-expense", (req, res) => {
  const query = `UPDATE expenses
    SET title = $1, amount = $2, category = $3, date = $4, updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING id, title, amount, category, date::text AS date`;

  selectNow(query, [req.body.title, Number(req.body.amount), req.body.category, req.body.date, req.body.id])
    .then((result) => {
      if (result.rowCount === 0) {
        res.status(404).json({ message: "Expense not found" });
        return;
      }
      res.json(result.rows[0]);
    })
    .catch((error) => {
      console.error("Error updating expense:", error);
      res.status(500).json({ message: "Error updating expense" });
    });
});

app.delete("/api/delete-expense/:id", (req, res) => {
  selectNow("DELETE FROM expenses WHERE id = $1 RETURNING id", [req.params.id])
    .then((result) => {
      if (result.rowCount === 0) {
        res.status(404).json({ message: "Expense not found" });
        return;
      }
      res.json({ message: "Expense deleted" });
    })
    .catch((error) => {
      console.error("Error deleting expense:", error);
      res.status(500).json({ message: "Error deleting expense" });
    });
});

app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.join(distPath, "index.html"));
    return;
  }

  next();
});

app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    try {
      const connection = await checkDatabaseConnection();
      console.log("Database connected:", connection.connected_at);
    } catch (error) {
      console.error("Database connection failed:", error.message);
    }
});