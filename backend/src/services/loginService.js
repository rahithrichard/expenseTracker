const { query } = require("../config/db");

const userLogin = async ({ email }) => {
  const result = await query(
    `SELECT
      id,
      name,
      mobile,
      email,
      password_hash
     FROM users
     WHERE LOWER(email) = LOWER($1)`,
    [email],
  );

  return result.rows[0];
};

module.exports = {
  userLogin,
};