require("dotenv").config();
const jwt = require("jsonwebtoken");

const createToken = (data) => {
  return jwt.sign(
    {
      userId: data.id,
      email: data.email,
      name: data.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
};

module.exports = {
    createToken
}