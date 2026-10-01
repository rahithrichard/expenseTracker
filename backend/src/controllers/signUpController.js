const { hashPassword } = require("../middleware/bcrypt");
const signUpService = require("../services/signUpServices");
const { createToken } = require("../middleware/jwt");

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

const userSignUp = async (req, res) => {
  const name = String(req.body.name || "").trim();
  const mobile = String(req.body.mobile || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ message: "Name, mobile, email, and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  const password_hash = await hashPassword(password);
  const userData = await signUpService.userSignup({ name, mobile, email, password_hash });

  if (!userData) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const token = createToken({ email: userData.email, id: userData.id, name: userData.name });
  res.cookie("authToken", token, authCookieOptions);
  return res.status(201).json({
    id: userData.id,
    name: userData.name,
    email: userData.email,
  });
};
const getSession = (req, res) => {
  res.json(req.user);
};


module.exports={
    userSignUp,
    getSession
}
