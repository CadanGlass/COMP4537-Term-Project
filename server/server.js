// server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import CORS
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const db = new sqlite3.Database("./database.db"); // Correctly open SQLite DB

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // Use environment variable or default key
const SALT_ROUNDS = 10; // Number of salt rounds for bcrypt

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Global request logger middleware
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} request to ${req.url}`
  );
  next();
});

// Initialize the database and create the users table if it doesn't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
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

// Create JWT function
function createJWT(payload, secretKey) {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const encodedHeader = Buffer.from(header)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_"); // URL-safe base64

  const encodedPayload = Buffer.from(JSON.stringify(payload))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_"); // URL-safe base64

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_"); // URL-safe base64

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Middleware to verify JWT and extract user info
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Unauthorized access attempt (no or invalid token)");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const [header, payload, signature] = token.split(".");
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(`${header}.${payload}`)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_"); // URL-safe base64

    if (expectedSignature !== signature) {
      console.log("Invalid JWT signature");
      throw new Error("Invalid signature");
    }

    const userData = JSON.parse(
      Buffer.from(payload, "base64").toString("utf8")
    );

    // Ensure the payload contains 'email' and 'role'
    if (!userData.email || !userData.role) {
      console.log("Invalid JWT payload");
      throw new Error("Invalid payload");
    }

    req.user = userData; // Attach user data to request object
    console.log(`Verified user: ${req.user.email}, role: ${req.user.role}`);
    next();
  } catch (error) {
    console.log("JWT verification error:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
}

// Middleware to check for admin role
function checkAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    console.log(`Access denied for user: ${req.user.email}`);
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}

// Register route (store user in SQLite DB with a hashed password and role)
app.post("/register", async (req, res) => {
  console.log("Register attempt with data:", req.body);

  const { email, password, role } = req.body;

  // Validate email format (optional but recommended)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Invalid or missing email address." });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long." });
  }

  // Hash the password before storing it
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  } catch (hashError) {
    console.error("Error hashing password:", hashError);
    return res.status(500).json({ message: "Error processing password." });
  }

  // Insert user into SQLite database with a role (defaults to 'user')
  const sql = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
  db.run(sql, [email, hashedPassword, role || "user"], function (err) {
    if (err) {
      console.error("Database error:", err.message); // Log the error for debugging
      if (err.code === "SQLITE_CONSTRAINT") {
        return res.status(400).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Error registering user" });
    }

    console.log(`User registered: ${email}, role: ${role || "user"}`);
    res.status(201).json({ message: "User registered successfully" });
  });
});

// Login route (validate user using SQLite DB and compare hashed passwords)
app.post("/login", async (req, res) => {
  console.log("Login attempt with data:", req.body);

  const { email, password } = req.body;

  // Validate email and password presence
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // Retrieve user from SQLite database based on email
  const sql = "SELECT * FROM users WHERE email = ?";
  db.get(sql, [email], async (err, user) => {
    if (err) {
      console.error("Database error during login:", err.message);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (!user) {
      console.log(`Invalid login attempt for email: ${email}`);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare the hashed password with the provided password
    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (compareError) {
      console.error("Error comparing passwords:", compareError);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (!isPasswordValid) {
      console.log(`Invalid password for email: ${email}`);
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Create JWT with role
    const tokenPayload = { email: user.email, role: user.role };
    const token = createJWT(tokenPayload, SECRET_KEY);
    console.log(`User logged in: ${email}, role: ${user.role}`);
    res.json({ token });
  });
});

// Protected route (accessible to all authenticated users)
app.get("/protected", verifyJWT, (req, res) => {
  console.log(`Protected route accessed by user: ${req.user.email}`);
  res.json({ message: "Protected content", email: req.user.email });
});

// Admin-only route (accessible only to admin users)
app.get("/admin", verifyJWT, checkAdmin, (req, res) => {
  console.log(`Admin route accessed by admin: ${req.user.email}`);
  res.json({ message: "Welcome Admin!", email: req.user.email });
});

// Test route
app.get("/test", (req, res) => {
  res.send("<h1>Test successful</h1>");
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
