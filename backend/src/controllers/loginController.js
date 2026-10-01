const { comparePassword, hashPassword } = require("../middleware/bcrypt");
const loginServices = require("../services/loginService");
const { createToken } = require("../middleware/jwt");

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

const userLogin = async (req, res) => {
  const userData = await loginServices.userLogin(req.body);
  if (!userData) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const isValid = await comparePassword(req.body.password, userData.password_hash);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = createToken({ email: userData.email, id: userData.id, name: userData.name });
  res.cookie("authToken", token, authCookieOptions);
  res.json({
    id: userData.id,
    name: userData.name,
    email: userData.email,
  });
};

const getSession = (req, res) => {
  res.json(req.user);
};

const userLogout = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.status(204).end();
};

module.exports = {
  userLogin,
  getSession,
  userLogout,
};