const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

// drop down list 
router.get("/expense-categories", categoryController.getCategories);

module.exports = router;
