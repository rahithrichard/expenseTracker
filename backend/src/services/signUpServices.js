const { query } = require("../config/db");

const userSignup = async (data) => {
  const result = await query(
    `
      INSERT INTO users (
        name,
        mobile,
        email,
        password_hash
      )
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email;
    `,
    [
      data.name,
      data.mobile,
      data.email,
      data.password_hash,
    ]
  );

  return result.rows[0];
};

module.exports = {
  userSignup,
};