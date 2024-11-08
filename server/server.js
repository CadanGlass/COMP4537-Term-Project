// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const util = require("util"); // To promisify SQLite methods

const app = express();
const db = new sqlite3.Database("./database.db");

// Configuration
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
const SALT_ROUNDS = 10;
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(cors());

// Global request logger middleware
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} request to ${req.url}`
  );
  next();
});

// Promisify SQLite methods for async/await
const dbGet = util.promisify(db.get).bind(db);
const dbRun = util.promisify(db.run).bind(db);

// Initialize the database and create the users table if it doesn't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      api INTEGER NOT NULL DEFAULT 20
    )`,
    (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
      } else {
        console.log("Users table ready.");
      }
    }
  );
});

// Register Route
app.post("/register", async (req, res) => {
  console.log("Register attempt with data:", req.body);

  const { email, password, role } = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing email address." });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const sql = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
    await dbRun(sql, [email, hashedPassword, role || "user"]);
    console.log(`User registered: ${email}, role: ${role || "user"}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Database error during registration:", err.message);
    if (err.code === "SQLITE_CONSTRAINT") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  console.log("Login attempt with data:", req.body);

  const { email, password } = req.body;

  // Validate email and password presence
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const user = await dbGet(sql, [email]);

    if (!user) {
      console.log(`Invalid login attempt for email: ${email}`);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Invalid password for email: ${email}`);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create JWT payload
    const payload = { email: user.email, role: user.role };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Token valid for 1 hour

    console.log(`User logged in: ${email}, role: ${user.role}`);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Middleware to verify JWT and extract user info
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Unauthorized access attempt (no or invalid token)");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, userData) => {
    if (err) {
      console.log("JWT verification error:", err.message);
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = userData;
    console.log(`Verified user: ${req.user.email}, role: ${req.user.role}`);
    next();
  });
}

// Route to get the current API count for the authenticated user
app.get("/get-api-count", verifyJWT, async (req, res) => {
  console.log(`API count request by user: ${req.user.email}`);

  try {
    const sqlSelect = "SELECT api FROM users WHERE email = ?";
    const user = await dbGet(sqlSelect, [req.user.email]);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      apiCount: user.api,
      maxedOut: user.api <= 0,
    });
  } catch (err) {
    console.error("Error in /get-api-count:", err.message);
    res.status(500).json({ message: "Error retrieving API count." });
  }
});

// Middleware to check for admin role
function checkAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    console.log(`Access denied for user: ${req.user.email}`);
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}

// Protected Route (accessible to all authenticated users)
app.get("/protected", verifyJWT, (req, res) => {
  console.log(`Protected route accessed by user: ${req.user.email}`);
  res.json({ email: req.user.email });
});


// Admin-Only Route to Get All Users and Their API Counts
app.get("/admin", verifyJWT, checkAdmin, async (req, res) => {
  console.log(`Admin route accessed by admin: ${req.user.email}`);

  try {
    const sqlSelect = "SELECT id, email, role, api FROM users";
    db.all(sqlSelect, [], (err, rows) => {
      if (err) {
        console.error("Error fetching users:", err.message);
        return res.status(500).json({ message: "Error fetching users." });
      }

      res.json({
        message: "User data fetched successfully.",
        users: rows, // Array of user objects
      });
    });
  } catch (err) {
    console.error("Error in /admin:", err.message);
    res.status(500).json({ message: "Error fetching user data." });
  }
});

// Test Route
app.get("/test", (req, res) => {
  res.send("<h1>Test successful</h1>");
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
