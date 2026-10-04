const expenseService = require("../services/expenseService");
const budgetService = require("../services/budgetService");

const getMonthStart = (month) => {
  const selectedMonth = typeof month === "string" ? month : new Date().toISOString().slice(0, 7);
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(selectedMonth)) {
    return null;
  }
  return `${selectedMonth}-01`;
};

const getExpenses = async (req, res) => {
  const monthStart = getMonthStart(req.query.month);
  if (!monthStart) return res.status(400).json({ message: "Month must use YYYY-MM format" });
  res.json(await expenseService.listExpenses(monthStart, req.user.id));
};

const getTotalExpenses = async (req, res) => {
  const monthStart = getMonthStart(req.query.month);
  if (!monthStart) return res.status(400).json({ message: "Month must use YYYY-MM format" });
  const total = await expenseService.getTotalExpenses(monthStart, req.user.id);
  const budget = await budgetService.getBudgetForMonth(monthStart, req.user.id);
  res.json({ Total: total, Budget: budget.amount, Remaining: budget.amount - total });
};

const getBudget = async (req, res) => {
  const monthStart = getMonthStart(req.query.month);
  if (!monthStart) return res.status(400).json({ message: "Month must use YYYY-MM format" });
  res.json(await budgetService.getBudgetForMonth(monthStart, req.user.id));
};

const saveBudget = async (req, res) => {
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount < 0) {
    res.status(400).json({ message: "Budget amount must be a non-negative number" });
    return;
  }

  const monthStart = req.body.monthStart;
  if (typeof monthStart !== "string" || !/^\d{4}-(0[1-9]|1[0-2])-01$/.test(monthStart)) {
    res.status(400).json({ message: "Budget month must be the first day of a valid month" });
    return;
  }

  res.json(await budgetService.saveBudget({
    amount,
    monthStart,
    userId: req.user.id,
  }));
};

const getCategoryTotals = async (req, res) => {
  const monthStart = getMonthStart(req.query.month);
  if (!monthStart) return res.status(400).json({ message: "Month must use YYYY-MM format" });
  const category = typeof req.query.category === "string" ? req.query.category : null;
  const totals = await expenseService.getCategoryTotals(category, monthStart, req.user.id);
  console.log("Category totals:", totals);
  res.json(totals);
};

const createExpense = async (req, res) => {
  const expense = await expenseService.createExpense({
    id: req.body.id,
    userId: req.user.id,
    title: req.body.title,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date || new Date().toISOString().split("T")[0],
  });

  res.status(201).json(expense);
};

const updateExpense = async (req, res) => {
  const expense = await expenseService.updateExpense({
    ...req.body,
    userId: req.user.id,
  });

  if (!expense) {
    res.status(404).json({ message: "Expense not found" });
    return;
  }

  res.json(expense);
};

const removeExpense = async (req, res) => {
  const deleted = await expenseService.deleteExpense(req.params.id, req.user.id);

  if (!deleted) {
    res.status(404).json({ message: "Expense not found" });
    return;
  }

  res.json({ message: "Expense deleted" });
};

module.exports = {
  getExpenses,
  getTotalExpenses,
  getBudget,
  saveBudget,
  getCategoryTotals,
  createExpense,
  updateExpense,
  removeExpense,
};
