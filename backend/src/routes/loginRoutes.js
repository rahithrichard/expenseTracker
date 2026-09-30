const express = require("express");
const loginController = require("../controllers/loginController");
const verifyToken = require("../middleware/verifyJWT");

const router = express.Router();

router.post("/user-login", loginController.userLogin);
router.get("/auth-session", verifyToken, loginController.getSession);
router.post("/user-logout", loginController.userLogout);

module.exports = router;