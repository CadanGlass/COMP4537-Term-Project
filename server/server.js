/**
 * Main Server Application
 * Entry point for the Express.js server application.
 * 
 * Resources & Attributions:
 * - OpenAI's ChatGPT: Assisted with code structure, debugging, and Swagger documentation
 * - Express.js Documentation: https://expressjs.com/
 * - Swagger/OpenAPI Documentation: https://swagger.io/docs/
 * - JWT Implementation: https://jwt.io/
 * - SQLite Documentation: https://www.sqlite.org/docs.html
 * 
 * This project was developed with assistance from:
 * - ChatGPT 3.5/4.0: Helped with API design, security implementations, and documentation
 * - COMP4537 Course Materials: Database design and REST API principles
 * - Stack Overflow: Various debugging solutions and best practices
 * 
 * Configures:
 * - Express middleware
 * - Database connection
 * - Authentication routes
 * - API endpoints
 * - Error handling
 * - Server startup
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const nodemailer = require("nodemailer");
const util = require("util");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import classes and middleware
const User = require("./models/User");
const AuthService = require("./services/AuthService");
const EmailService = require("./services/EmailService");
const { verifyJWT, checkAdmin } = require("./middleware/auth");

const swaggerOptions = require('./config/swagger');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3003;
    this.setupDatabase();
    this.setupServices();
    this.setupMiddleware();
    this.setupRoutes();
    this.initializeEndpointTracking();
  }

  setupDatabase = () => {
    this.db = new sqlite3.Database("./database.db");
    this.db.get = util.promisify(this.db.get).bind(this.db);
    this.db.run = util.promisify(this.db.run).bind(this.db);
    this.db.all = util.promisify(this.db.all).bind(this.db);

    this.userModel = new User(this.db);
    this.initializeDatabase();
  };

  setupServices = () => {
    this.authService = new AuthService(
      process.env.SECRET_KEY || "your_secret_key",
      10
    );

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    this.emailService = new EmailService(
      transporter,
      process.env.CLIENT_URL || "http://localhost:3000"
    );
  };

  setupMiddleware = () => {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(this.trackEndpoint);
    this.app.use(this.logRequest);

    const specs = swaggerJsdoc(swaggerOptions);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: "Image to Text API Documentation",
    }));
  };

  logRequest = (req, res, next) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} request to ${req.url}`
    );
    next();
  };

  initializeDatabase = () => {
    const sql = `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      api INTEGER NOT NULL DEFAULT 20
    )`;

    this.db.run(sql);
  };

  setupRoutes = () => {
    this.app.post("/register", this.handleRegister);
    this.app.post("/login", this.handleLogin);
    this.app.get(
      "/protected",
      verifyJWT(this.authService),
      this.handleProtected
    );
    this.app.get(
      "/get-api-count",
      verifyJWT(this.authService),
      this.handleGetApiCount
    );
    this.app.post("/use-api", verifyJWT(this.authService), this.handleUseApi);
    this.app.get(
      "/admin",
      verifyJWT(this.authService),
      checkAdmin,
      this.handleAdmin
    );
    this.app.post("/request-reset-password", this.handleRequestResetPassword);
    this.app.post("/reset-password", this.handleResetPassword);
    this.app.put(
      "/admin/promote",
      verifyJWT(this.authService),
      checkAdmin,
      this.handlePromoteUser
    );
    this.app.delete(
      "/admin/delete-user/:userId",
      verifyJWT(this.authService),
      checkAdmin,
      this.handleDeleteUser
    );
    this.app.get(
      "/admin/endpoint-stats",
      verifyJWT(this.authService),
      checkAdmin,
      this.handleGetEndpointStats
    );
  };

  start = () => {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  };

  // Route handlers
  handleRegister = async (req, res) => {
    const { email, password, role } = req.body;

    if (!this.validateEmail(email) || !password) {
      return res.status(400).json({
        message: "Invalid email or missing password.",
      });
    }

    try {
      const hashedPassword = await this.authService.hashPassword(password);
      const newUser = await this.userModel.create(email, hashedPassword, role);
      
      res.status(201).json({ 
        message: "User registered successfully",
        userId: newUser.id
      });
    } catch (err) {
      console.error("Database error during registration:", err);
      
      if (err.message === 'Email already exists') {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      res.status(500).json({ message: "Registration failed" });
    }
  };

  handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }
//
    try {
      const user = await this.userModel.getByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const isValid = await this.authService.comparePassword(
        password,
        user.password
      );
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const token = this.authService.generateToken({
        email: user.email,
        role: user.role,
      });

      res.json({ token, role: user.role });
    } catch (err) {
      this.handleError(res, err);
    }
  };

  // Helper methods
  validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && emailRegex.test(email);
  };

  handleError = (res, err) => {
    console.error("Error:", err.message);
    if (err.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  };

  handlePromoteUser = async (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    try {
      await this.userModel.updateRole(userId, "admin");
      res.json({ message: "User promoted to admin successfully" });
    } catch (err) {
      this.handleError(res, err);
    }
  };

  handleAdmin = async (req, res) => {
    try {
      const users = await this.userModel.getAllUsers();
      res.json({ users });
    } catch (err) {
      this.handleError(res, err);
    }
  };

  handleProtected = async (req, res) => {
    res.json({ message: "Access granted to protected route" });
  };

  handleGetApiCount = async (req, res) => {
    try {
      const user = await this.userModel.getByEmail(req.user.email);
      const apiCount = await this.userModel.getApiCount(user.id);
      res.json({ apiCount });
    } catch (err) {
      this.handleError(res, err);
    }
  };

  handleUseApi = async (req, res) => {
    try {
      const user = await this.userModel.getByEmail(req.user.email);
      await this.userModel.decrementApiCount(user.id);
      const apiCount = await this.userModel.getApiCount(user.id);
      res.json({ apiCount });
    } catch (err) {
      this.handleError(res, err);
    }
  };

  handleRequestResetPassword = async (req, res) => {
    const { email } = req.body;

    if (!this.validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    try {
      const user = await this.userModel.getByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = this.authService.generateToken(
        { email: user.email },
        '1h'
      );

      await this.emailService.sendResetEmail(email, resetToken);
      res.json({ message: "Password reset email sent" });
    } catch (err) {
      this.handleError(res, err);
    }
  };

  handleResetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    try {
      const decoded = this.authService.verifyToken(token);
      const hashedPassword = await this.authService.hashPassword(newPassword);
      await this.userModel.updatePassword(decoded.email, hashedPassword);
      res.json({ message: "Password reset successful" });
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      this.handleError(res, err);
    }
  };

  handleDeleteUser = async (req, res) => {
    const { userId } = req.params;
    
    try {
      // Check if the requesting user is admin@admin.com
      if (req.user.email !== 'admin@admin.com') {
        return res.status(403).json({ 
          message: "Only the super admin can delete users" 
        });
      }

      // Prevent deletion of the super admin account
      const userToDelete = await this.userModel.getById(userId);
      if (userToDelete?.email === 'admin@admin.com') {
        return res.status(403).json({ 
          message: "Super admin account cannot be deleted" 
        });
      }

      await this.userModel.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      this.handleError(res, err);
    }
  };

  initializeEndpointTracking = async () => {
    await this.userModel.createEndpointStatsTable();
  };

  trackEndpoint = async (req, res, next) => {
    const method = req.method;
    const endpoint = req.path;
    
    try {
      await this.userModel.incrementEndpointStat(method, endpoint);
    } catch (err) {
      console.error('Error tracking endpoint:', err);
    }
    next();
  };

  handleGetEndpointStats = async (req, res) => {
    try {
      const stats = await this.userModel.getEndpointStats();
      res.json({ stats });
    } catch (err) {
      this.handleError(res, err);
    }
  };
}

// Initialize and start server
const server = new Server();
server.start();
