/**
 * User Model
 * Defines the SQLite3 database operations for user accounts.
 * Handles:
 * - User CRUD operations
 * - Email/password storage
 * - Role management
 * - API usage tracking
 * Provides an abstraction layer between the database and server routes.
 */

class User {
  constructor(db) {
    this.db = db;
  }

  /**
   * SQL Injection Prevention:
   * All methods below use parameterized queries with ? placeholders
   * Parameters are passed separately from the SQL query
   * SQLite3 automatically escapes and sanitizes the parameters
   * This prevents malicious SQL code from being executed
   */
  
  getByEmail = async (email) => {
    // Using ? placeholder prevents SQL injection by treating email as a literal value
    const sql = "SELECT * FROM users WHERE email = ?";
    return await this.db.get(sql, [email]);
  };

  create = async (email, hashedPassword, role = "user", apiCount = 20) => {
    // Multiple parameters are passed as array, each ? is replaced safely
    const sql =
      "INSERT INTO users (email, password, role, api) VALUES (?, ?, ?, ?)";
    return await this.db.run(sql, [email, hashedPassword, role, apiCount]);
  };

  updatePassword = async (email, hashedPassword) => {
    // Even for updates, parameters are safely escaped
    const sql = "UPDATE users SET password = ? WHERE email = ?";
    return await this.db.run(sql, [hashedPassword, email]);
  };

  decrementApiCount = async (email) => {
    const sql = "UPDATE users SET api = api - 1 WHERE email = ?";
    return await this.db.run(sql, [email]);
  };

  getAllUsers = async () => {
    const sql = "SELECT id, email, role, api FROM users";
    return await this.db.all(sql, []);
  };

  updateRole = async (userId, newRole) => {
    const sql = "UPDATE users SET role = ? WHERE id = ?";
    return await this.db.run(sql, [newRole, userId]);
  };
}

module.exports = User;
