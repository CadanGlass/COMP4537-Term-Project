// server.js

//static rendering for reset password functionality page
const path = require("path");
app.use(express.static(path.join(__dirname, "../client/dist"))); // Adjust the path if your build folder is elsewhere

// The "catchall" handler: for any request that doesn't match an API route, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const util = require("util");

const app = express();
const db = new sqlite3.Database("./database.db");

// Configuration
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
const RESET_PASSWORD_SECRET =
  process.env.RESET_PASSWORD_SECRET || "your_reset_password_secret";
const SALT_ROUNDS = 10;
const PORT = process.env.PORT || 3003;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

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
const dbAll = util.promisify(db.all).bind(db);

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

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility function to send reset email
const sendResetEmail = async (email, token) => {
  const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
  };

  await transporter.sendMail(mailOptions);
};

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
    const sql =
      "INSERT INTO users (email, password, role, api) VALUES (?, ?, ?, ?)";
    await dbRun(sql, [email, hashedPassword, role || "user", 20]); // Explicitly set api to 20
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

// Endpoint to decrement the API count by one
app.post("/use-api", verifyJWT, async (req, res) => {
  const userEmail = req.user.email;

  try {
    // Start a transaction to ensure atomicity
    await dbRun("BEGIN TRANSACTION");

    // Check the current API count
    const selectSql = "SELECT api FROM users WHERE email = ?";
    const user = await dbGet(selectSql, [userEmail]);

    if (!user) {
      await dbRun("ROLLBACK");
      return res.status(404).json({ message: "User not found." });
    }

    if (user.api <= 0) {
      await dbRun("ROLLBACK");
      return res.status(403).json({ message: "API usage limit reached." });
    }

    // Decrement the API count
    const updateSql = "UPDATE users SET api = api - 1 WHERE email = ?";
    await dbRun(updateSql, [userEmail]);

    // Optionally, retrieve the updated API count
    const updatedUser = await dbGet(selectSql, [userEmail]);

    // Commit the transaction
    await dbRun("COMMIT");

    console.log(
      `API count decremented for user: ${userEmail}. Remaining API count: ${updatedUser.api}`
    );

    res.json({
      message: "API count decremented successfully.",
      apiCount: updatedUser.api,
      maxedOut: updatedUser.api <= 0,
    });
  } catch (err) {
    // Rollback the transaction in case of error
    await dbRun("ROLLBACK");
    console.error("Error decrementing API count:", err.message);
    res.status(500).json({ message: "Error decrementing API count." });
  }
});

// Admin-Only Route to Get All Users and Their API Counts
app.get("/admin", verifyJWT, checkAdmin, async (req, res) => {
  console.log(`Admin route accessed by admin: ${req.user.email}`);

  try {
    const sqlSelect = "SELECT id, email, role, api FROM users";
    const users = await dbAll(sqlSelect, []);
    res.json({
      message: "User data fetched successfully.",
      users, // Array of user objects
    });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Error fetching user data." });
  }
});

// Password Reset Request Route (No Token Storage)
app.post("/request-reset-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required to reset password." });
  }

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const user = await dbGet(sql, [email]);

    if (!user) {
      // For security, do not reveal whether the email exists
      return res
        .status(200)
        .json({
          message: "If that email is registered, a reset link has been sent.",
        });
    }

    // Generate a reset token (JWT)
    const resetToken = jwt.sign({ email }, RESET_PASSWORD_SECRET, {
      expiresIn: "1h",
    });

    // Send the reset email
    await sendResetEmail(email, resetToken);

    res
      .status(200)
      .json({
        message: "If that email is registered, a reset link has been sent.",
      });
  } catch (err) {
    console.error("Error in /request-reset-password:", err.message);
    res.status(500).json({ message: "Error requesting password reset." });
  }
});

// Reset Password Route (No Token Storage)
app.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Token and new password are required." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, RESET_PASSWORD_SECRET);
    const email = decoded.email;

    // Retrieve the user
    const sql = "SELECT * FROM users WHERE email = ?";
    const user = await dbGet(sql, [email]);

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update the user's password
    const updateSql = "UPDATE users SET password = ? WHERE email = ?";
    await dbRun(updateSql, [hashedPassword, email]);

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Error in /reset-password:", err.message);
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }
    res.status(500).json({ message: "Error resetting password." });
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
