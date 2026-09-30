const express = require("express");
const expenseController = require("../controllers/expenseController");
const verifyToken = require("../middleware/verifyJWT");

const router = express.Router();

// for get table expense 
router.get("/expenses", verifyToken, expenseController.getExpenses);
// total card 
router.get("/totals-expenses", verifyToken, expenseController.getTotalExpenses);
router.get("/budget", verifyToken, expenseController.getBudget);
router.get("/filtered-categories-total", verifyToken, expenseController.getCategoryTotals);
// operations
router.post("/create-expense", verifyToken, expenseController.createExpense);
router.post("/update-expense", verifyToken, expenseController.updateExpense);
router.post("/save-budget", verifyToken, expenseController.saveBudget);
router.delete("/delete-expense/:id", verifyToken, expenseController.removeExpense);

module.exports = router;
