const express = require("express");
const expenseController = require("../controllers/expenseController");

const router = express.Router();
// for get table expense 
router.get("/expenses", expenseController.getExpenses);
// total card 
router.get("/totals-expenses", expenseController.getTotalExpenses);
router.get("/filtered-categories-total", expenseController.getCategoryTotals);
// operations
router.post("/create-expense", expenseController.createExpense);
router.post("/update-expense", expenseController.updateExpense);
router.delete("/delete-expense/:id", expenseController.removeExpense);

module.exports = router;
