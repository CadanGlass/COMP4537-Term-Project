/**
 * Authentication Service
 * Handles all authentication-related business logic including:
 * - User registration
 * - Login authentication
 * - Token generation and validation
 * - Password reset functionality
 * Serves as a middleware between routes and database operations.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthService {
  constructor(secretKey, saltRounds) {
    this.secretKey = secretKey;
    this.saltRounds = saltRounds;
  }

  generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verifyToken = (token) => {
    return jwt.verify(token, this.secretKey);
  }

  hashPassword = async (password) => {
    return await bcrypt.hash(password, this.saltRounds);
  }

  comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = AuthService; 