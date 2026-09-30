const express = require("express");
const categoryController = require("../controllers/categoryController");
const verifyToken = require("../middleware/verifyJWT");
const router = express.Router();

// drop down list 
router.get("/expense-categories", verifyToken, categoryController.getCategories);

module.exports = router;
