class User {
  constructor(db) {
    this.db = db;
  }

  getByEmail = async (email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    return await this.db.get(sql, [email]);
  }

  create = async (email, hashedPassword, role = 'user', apiCount = 20) => {
    const sql = "INSERT INTO users (email, password, role, api) VALUES (?, ?, ?, ?)";
    return await this.db.run(sql, [email, hashedPassword, role, apiCount]);
  }

  updatePassword = async (email, hashedPassword) => {
    const sql = "UPDATE users SET password = ? WHERE email = ?";
    return await this.db.run(sql, [hashedPassword, email]);
  }

  decrementApiCount = async (email) => {
    const sql = "UPDATE users SET api = api - 1 WHERE email = ?";
    return await this.db.run(sql, [email]);
  }

  getAllUsers = async () => {
    const sql = "SELECT id, email, role, api FROM users";
    return await this.db.all(sql, []);
  }
}

module.exports = User; 