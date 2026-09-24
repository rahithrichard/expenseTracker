const express = require('express');
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const expenses = [];
const expenseCategories = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Other'];
const distPath = path.join(__dirname, "../../../frontend/dist");

app.use(cors());
app.use(express.json());
console.log('Server running in:', __dirname);
app.get("/api/expenses", (req, res) => {
  res.json(expenses);
});

app.get("/api/expense-categories", (req, res) => {
   res.status(201).json(expenseCategories);
});

app.post("/api/create-expense", (req, res) => {
  const newExpense = {
    id: req.body.id,
    title: req.body.title,
    amount: Number(req.body.amount),
    category: req.body.category,
    date: new Date().toISOString().split("T")[0],
  };

  expenses.push(newExpense);
  console.log(expenses)
  res.status(201).json(newExpense);
});

app.post("/api/update-expense", (req, res) => {

  const updatedExpense = expenses.find(expense => expense.id === req.body.id);
  if (updatedExpense) {
    updatedExpense.amount = Number(req.body.amount);
    updatedExpense.category = req.body.category;
     console.log(updatedExpense)
    res.status(200).json(updatedExpense);
  } else {
    res.status(404).json({ message: "Expense not found" });
  }
});

app.delete("/api/delete-expense/:id", (req, res) => {
  const expenseIndex = expenses.findIndex(expense => expense.id === req.params.id);

  if (expenseIndex !== -1) {
    expenses.splice(expenseIndex, 1);
    res.status(200).json({ message: "Expense deleted" });
  } else {
    res.status(404).json({ message: "Expense not found" });
  }
});

app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.join(distPath, "index.html"));
    return;
  }

  next();
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
    console.log(expenses);
});