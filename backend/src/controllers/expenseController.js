const expenseService = require("../services/expenseService");

const getExpenses = async (req, res) => {
  res.json(await expenseService.listExpenses());
};

const getTotalExpenses = async (req, res) => {
  const total = await expenseService.getTotalExpenses();
  console.log("Total expenses:", total);
  const budget = 1000; // Example budget value, you can replace it with a dynamic value if needed
  res.json({ Total: total, Budget: budget, Remaining: budget - total });
};

const getCategoryTotals = async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : null;
  const totals = await expenseService.getCategoryTotals(category);
  console.log("Category totals:", totals);
  res.json(totals);
};

const createExpense = async (req, res) => {
  const expense = await expenseService.createExpense({
    id: req.body.id,
    title: req.body.title,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date || new Date().toISOString().split("T")[0],
  });

  res.status(201).json(expense);
};

const updateExpense = async (req, res) => {
  const expense = await expenseService.updateExpense(req.body);

  if (!expense) {
    res.status(404).json({ message: "Expense not found" });
    return;
  }

  res.json(expense);
};

const removeExpense = async (req, res) => {
  const deleted = await expenseService.deleteExpense(req.params.id);

  if (!deleted) {
    res.status(404).json({ message: "Expense not found" });
    return;
  }

  res.json({ message: "Expense deleted" });
};

module.exports = {
  getExpenses,
  getTotalExpenses,
  getCategoryTotals,
  createExpense,
  updateExpense,
  removeExpense,
};
