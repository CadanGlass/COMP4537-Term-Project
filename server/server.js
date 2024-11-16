require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const nodemailer = require("nodemailer");
const util = require("util");

// Import classes and middleware
const User = require('./models/User');
const AuthService = require('./services/AuthService');
const EmailService = require('./services/EmailService');
const { verifyJWT, checkAdmin } = require('./middleware/auth');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3003;
    this.setupDatabase();
    this.setupServices();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupDatabase = () => {
    this.db = new sqlite3.Database("./database.db");
    this.db.get = util.promisify(this.db.get).bind(this.db);
    this.db.run = util.promisify(this.db.run).bind(this.db);
    this.db.all = util.promisify(this.db.all).bind(this.db);
    
    this.userModel = new User(this.db);
    this.initializeDatabase();
  }

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
      }
    });

    this.emailService = new EmailService(
      transporter,
      process.env.CLIENT_URL || "http://localhost:3000"
    );
  }

  setupMiddleware = () => {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(this.logRequest);
  }

  logRequest = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
    next();
  }

  initializeDatabase = () => {
    const sql = `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      api INTEGER NOT NULL DEFAULT 20
    )`;
    
    this.db.run(sql);
  }

  setupRoutes = () => {
    this.app.post("/register", this.handleRegister);
    this.app.post("/login", this.handleLogin);
    this.app.get("/protected", verifyJWT(this.authService), this.handleProtected);
    this.app.get("/get-api-count", verifyJWT(this.authService), this.handleGetApiCount);
    this.app.post("/use-api", verifyJWT(this.authService), this.handleUseApi);
    this.app.get("/admin", verifyJWT(this.authService), checkAdmin, this.handleAdmin);
    this.app.post("/request-reset-password", this.handleRequestResetPassword);
    this.app.post("/reset-password", this.handleResetPassword);
  }

  start = () => {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }

  // Route handlers
  handleRegister = async (req, res) => {
    const { email, password, role } = req.body;

    if (!this.validateEmail(email) || !password) {
      return res.status(400).json({ 
        message: "Invalid email or missing password." 
      });
    }

    try {
      const hashedPassword = await this.authService.hashPassword(password);
      await this.userModel.create(email, hashedPassword, role);
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      this.handleError(res, err);
    }
  }

  handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required." 
      });
    }

    try {
      const user = await this.userModel.getByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const isValid = await this.authService.comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const token = this.authService.generateToken({ 
        email: user.email, 
        role: user.role 
      });

      res.json({ token, role: user.role });
    } catch (err) {
      this.handleError(res, err);
    }
  }

  // Helper methods
  validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && emailRegex.test(email);
  }

  handleError = (res, err) => {
    console.error('Error:', err.message);
    if (err.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

// Initialize and start server
const server = new Server();
server.start();
