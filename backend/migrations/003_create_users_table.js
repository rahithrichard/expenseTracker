module.exports = {
  async up(connection) {
    await connection.query(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY DEFAULT (100000 + floor(random() * 900000)::int),
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`
    )
}
}